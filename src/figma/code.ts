figma.showUI(__html__, { width: 610, height: 480 });

const delay = (seconds: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds * 1000);
    })
}

const loadedFonts = {} as { [key: string]: boolean }
const loadFonts = async (valFontNames: FontName | FontName[]) => {
    const fontNames = Array.isArray(valFontNames) ? valFontNames : [valFontNames];
    for (let fontNameIndex = 0; fontNameIndex < fontNames.length; fontNameIndex++) {
        const fontName = fontNames[fontNameIndex];
        if (!loadedFonts[`${fontName.family}${fontName.style}`]) {
            await figma.loadFontAsync(fontName);
            loadedFonts[`${fontName.family}${fontName.style}`] = true;
        }
    }

}

let notifyHandler: NotificationHandler;
const notify = async (message: string) => {
    notifyHandler?.cancel?.();
    notifyHandler = figma.notify(message);
    await delay(0.5);
}

const notifyCancel = () => {
    notifyHandler?.cancel?.();
}

let isGenerating = false;
figma.on('close', () => {
    if (isGenerating) {
        notify('Generation aborted');
    }
})

const createPreviewName = (name: string) => `[Preview] ${name}`;

const updateLayers = async (headers: string[], selectedFrame: FrameNode, item: string[]) => {
    //// Find if there's a preview frame
    let targetFrame = figma.currentPage.findChild((node) => {
        return node.type === 'FRAME' && node.name === createPreviewName(selectedFrame.name);
    }) as FrameNode;

    //// Clone the frame for preview
    if (targetFrame != null) {
        targetFrame.remove();
    }

    targetFrame = selectedFrame.clone();
    targetFrame.name = createPreviewName(selectedFrame.name);
    targetFrame.x = targetFrame.x + 100 + selectedFrame.width;
    figma.currentPage.appendChild(targetFrame);

    const targetChildren = targetFrame.findAll((child) => child.type === 'TEXT') || [] as SceneNode[];
    const headersObject = headers.reduce((acc, headerItem, index) => {
        acc[headerItem] = index;
        return acc;
    }, {} as { [key: string]: number });

    for (let childIndex = 0; childIndex < targetChildren.length; childIndex++) {
        const child = targetChildren[childIndex];
        switch (child.type) {
            case "TEXT": {
                const search = new RegExp('(\\%\\%([a-zA-Z0-9-_]+)\\%\\%)', 'g');
                const nodeStyles: ((...args: any[]) => void)[] = [];

                const fontNames = child.getRangeAllFontNames(0, child.characters.length);
                await loadFonts(fontNames);


                const findMatches = (callback: (startIndex: number, endIndex: number, target: string, ctr: number, value: string) => void) => {
                    let ctr = 0;
                    let headerMatch: RegExpExecArray;
                    const jsonText = JSON.stringify(child.characters);
                    while ((headerMatch = search.exec(jsonText)) !== null) {
                        const headerItem = headerMatch[2];
                        const headerIndex = headersObject[headerItem];
                        if (headerIndex != null) {
                            const target = `%%${headerItem}%%`;
                            const startIndex = child.characters.indexOf(target);

                            if (startIndex !== -1) {
                                callback(startIndex, startIndex + target.length, target, ctr, item[headerIndex]);
                                ctr++;
                            }
                        }
                    }
                }

                // Obtain styles of every target item
                findMatches((startIndex, endIndex) => {
                    const obj = {
                        setRangeFontName: child.getRangeFontName(startIndex, endIndex),
                        setRangeFontSize: child.getRangeFontSize(startIndex, endIndex),
                        setRangeTextCase: child.getRangeTextCase(startIndex, endIndex),
                        setRangeTextDecoration: child.getRangeTextDecoration(startIndex, endIndex),
                        setRangeLetterSpacing: child.getRangeLetterSpacing(startIndex, endIndex),
                        setRangeLineHeight: child.getRangeLineHeight(startIndex, endIndex),
                        setRangeTextStyleId: child.getRangeTextStyleId(startIndex, endIndex),
                    }
                    nodeStyles.push((sIndex: number, eIndex: number) => {
                        Object.entries(obj).forEach(([setFunc, value]) => {
                            //@ts-ignore
                            child[(setFunc)](sIndex, eIndex, value);
                        })
                    })
                });

                // Replace all target items
                findMatches((startIndex, insertStart, _, ctr, value) => {
                    child.insertCharacters(insertStart, value, 'AFTER');
                    child.deleteCharacters(startIndex, insertStart)
                    nodeStyles[ctr](startIndex, startIndex + value.length);
                });

                break;
            }
        }
    }

    return targetFrame;
}

figma.ui.onmessage = async msg => {
    switch (msg.type) {
        case 'API': {
            const sendAPIKey = (value: string = '') => {
                figma.ui.postMessage({ type: 'API', action: 'get', value })
            }

            if (msg.action === 'store') {
                const finalValue = msg.value || '';
                figma.clientStorage.setAsync('APIKey', finalValue).then(() => {
                    sendAPIKey(finalValue);
                });
            } else if (msg.action === 'get') {
                figma.clientStorage.getAsync('APIKey').then(sendAPIKey);
            }
            break;
        }
        case 'Compose': {
            const selection = figma.currentPage.selection;
            if (selection.length === 1 && selection[0].type === 'FRAME') {
                const selectedFrame = selection[0];
                const headers = msg.headers;

                if ((selectedFrame?.name || '').startsWith('[Preview]')) {
                    figma.ui.postMessage({ type: 'Compose', action: 'error', message: 'Frame selected cannot start with [Preview]' })
                    return;
                }

                switch (msg.action) {
                    case 'generate':
                    case 'preview': {
                        const targetPreviewFrame = await updateLayers(headers, selectedFrame, msg.item);

                        if (msg.action === 'generate') {
                            isGenerating = true;
                            try {
                                await notify('Generating PDF...');
                                const pdfData = await targetPreviewFrame.exportAsync({ format: 'PDF' })
                                figma.ui.postMessage({ type: 'Compose', action: 'savePDF', data: pdfData, rowNumber: msg.index });
                                notifyCancel();
                                return;
                            } catch (e) {
                                figma.ui.postMessage({ type: 'Compose', action: 'error', message: 'Generate failed' })
                            }

                        }
                        break;
                    }
                    case 'generateAll': {
                        isGenerating = true;
                        type pdfItem = { name: string, data: Uint8Array };
                        const pdfItems = [] as pdfItem[];

                        for (let index = 0; index < msg.items.length; index++) {
                            const item = msg.items[index];
                            await notify(`Generating PDF #${index + 1}...`);
                            const targetPreviewFrame = await updateLayers(headers, selectedFrame, item);
                            const pdfData = await targetPreviewFrame.exportAsync({ format: 'PDF' });
                            pdfItems.push({
                                name: `${index} - ${headers[0]}${item[0]}.pdf`,
                                data: pdfData,
                            })
                            notifyCancel();
                        }

                        await notify('Generating Archive...');
                        figma.ui.postMessage({ type: 'Compose', action: 'savePDFArchive', data: pdfItems });
                        notifyCancel();
                        break;
                    }
                }
                return;
            } else {
                figma.ui.postMessage({ type: 'Compose', action: 'error', message: 'Selection should only be one Frame' })
                return;
            }
        }
    }
};
