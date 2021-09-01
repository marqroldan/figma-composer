figma.showUI(__html__, { width: 610, height: 480 });

const loadedFonts = {} as { [key: string]: boolean }
const loadFonts = async (valFontNames: FontName | FontName[]) => {
    const fontNames = Array.isArray(valFontNames) ? valFontNames : [valFontNames];
    for (let fontNameIndex = 0; fontNameIndex < fontNames.length; fontNameIndex++) {
        const fontName = fontNames[fontNameIndex];
        if (!loadedFonts[`${fontName.family}${fontName.style}`]) {
            console.log("hmmm loading font...", fontName)
            await figma.loadFontAsync(fontName);
            console.log("hmmm font loaded", fontName)
            loadedFonts[`${fontName.family}${fontName.style}`] = true;
        }
    }

}

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
                const nodeStyles = [];
                const search = new RegExp('(\\%\\%([a-zA-Z0-9-_]+)\\%\\%)', 'g');

                let headerMatch: string[] = [];

                while ((headerMatch = search.exec(child.characters)) !== null) {
                    const headerItem = headerMatch[2];
                    console.log("yay", headerItem);
                    const headerIndex = headersObject[headerItem];


                    if (headerIndex != null) {
                        const target = `%%${headerItem}%%`;
                        const startIndex = child.characters.indexOf(target);
                        const value = item[headerIndex];

                        if (startIndex !== -1) {
                            const fontNames = child.getRangeAllFontNames(0, child.characters.length); /// Only expecting one
                            await loadFonts(fontNames);

                            const fontName = child.getRangeFontName(startIndex, startIndex + target.length) as FontName; /// Only expecting one
                            const fontSize = child.getRangeFontSize(startIndex, startIndex + target.length) as number; /// Only expecting one

                            console.log("fonffff", fontName, fontSize, child.characters.substr(startIndex, startIndex + target.length))
                            await loadFonts(fontName);

                            const nodeStyleObject = {
                                value,
                                startIndex,
                                endIndex: startIndex + value.length,
                                fontName,
                                fontSize
                            };
                            console.log("Node style for target", target, '- --- -', nodeStyleObject);
                            nodeStyles.push(nodeStyleObject)

                            console.log("hmmm setting characters font...", fontName)
                            child.characters = child.characters.replace(target, value);
                        }
                    }
                }

                console.log("Final child node characters", child.characters.length, child.characters);
                const sortedStyles = nodeStyles.sort((a, b) => (b.startIndex + b.value.length) - (a.startIndex + a.value.length));
                for (let styleIndex = 0; styleIndex < sortedStyles.length; styleIndex++) {
                    const style = sortedStyles[styleIndex];
                    console.log("Setting style... for: ", style.value, style.startIndex, style.endIndex);
                    child.setRangeFontName(style.startIndex, style.endIndex, style.fontName);
                    child.setRangeFontSize(style.startIndex, style.endIndex, style.fontSize);
                }

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
                            try {
                                const handler = figma.notify('Generating PDF...');
                                const pdfData = await targetPreviewFrame.exportAsync({ format: 'PDF' })
                                figma.ui.postMessage({ type: 'Compose', action: 'savePDF', data: pdfData });
                                handler.cancel();
                                return;
                            } catch (e) {
                                figma.ui.postMessage({ type: 'Compose', action: 'error', message: 'Generate failed' })
                            }

                        }
                        break;
                    }
                    case 'generateAll': {
                        type pdfItem = { name: string, data: Uint8Array };
                        const pdfItems = [] as pdfItem[];

                        for (let index = 0; index < msg.items.length; index++) {
                            const item = msg.items[index];
                            const targetPreviewFrame = await updateLayers(headers, selectedFrame, item);
                            const handler = figma.notify(`Generating PDF #${index}...`);
                            const pdfData = await targetPreviewFrame.exportAsync({ format: 'PDF' });
                            pdfItems.push({
                                name: `${index} - ${headers[0]}${item[0]}.pdf`,
                                data: pdfData,
                            })
                            handler.cancel();
                        }

                        const handler = figma.notify('Generating Archive...');
                        figma.ui.postMessage({ type: 'Compose', action: 'savePDFArchive', data: pdfItems });
                        handler.cancel();
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
