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

const updateLayers = async (headers: string[], targetFrame: FrameNode, item: string[]) => {
    /*
    for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
    }*/

    const targetChildren = targetFrame.findAll((child) => {
        /*
        child.name == `%${headers[headerIndex]}%`
        */

        return child.type === 'TEXT';
    }) || [] as SceneNode[];
    for (let childIndex = 0; childIndex < targetChildren.length; childIndex++) {
        const child = targetChildren[childIndex];
        switch (child.type) {
            case "TEXT": {
                const nodeStyles = [];
                console.log("Initial child node characters", child.characters.length, child.characters);
                for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
                    const headerItem = headers[headerIndex];
                    const target = `%%${headerItem}%%`;
                    const startIndex = child.characters.indexOf(target);
                    const value = item[headerIndex];

                    if (startIndex !== -1) {
                        const fontNames = child.getRangeAllFontNames(0, child.characters.length); /// Only expecting one
                        await loadFonts(fontNames);

                        const fontName = child.getRangeFontName(startIndex, startIndex + target.length) as FontName; /// Only expecting one
                        const fontSize = child.getRangeFontSize(startIndex, startIndex + target.length) as number; /// Only expecting one

                        console.log("fonffff", fontName)
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

                console.log("Final child node characters", child.characters.length, child.characters);
                const sortedStyles = nodeStyles.sort((a, b) => (b.startIndex + b.value.length) - (a.startIndex + a.value.length));
                for (let styleIndex = 0; styleIndex < sortedStyles.length; styleIndex++) {
                    const style = sortedStyles[styleIndex];
                    console.log("Setting style...", style.startIndex, style.endIndex);
                    child.setRangeFontName(style.startIndex, style.endIndex, style.fontName);
                    child.setRangeFontSize(style.startIndex, style.endIndex, style.fontSize);
                }

                break;
            }
        }
    }
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
                const createPreviewName = (name: string) => `[Preview] ${name}`;
                //// Find if there's a preview frame
                let targetPreviewFrame = figma.currentPage.findChild((node) => {
                    return node.type === 'FRAME' && node.name === createPreviewName(selectedFrame.name);
                }) as FrameNode;

                //// Clone the frame for preview
                if (targetPreviewFrame == null) {
                    targetPreviewFrame = selectedFrame.clone();
                    targetPreviewFrame.name = createPreviewName(selectedFrame.name);
                    targetPreviewFrame.x = targetPreviewFrame.x + 100 + selectedFrame.width;
                    figma.currentPage.appendChild(targetPreviewFrame);
                }


                switch (msg.action) {
                    case 'generate':
                    case 'preview': {
                        await updateLayers(headers, targetPreviewFrame, msg.item);

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
                            await updateLayers(headers, targetPreviewFrame, item);
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
