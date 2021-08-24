figma.showUI(__html__, { width: 610, height: 480 });

const loadedFonts = {} as { [key: string]: boolean }

const updateLayers = async (headers: string[], targetFrame: FrameNode, item: string[]) => {
    for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
        const targetChildren = targetFrame.findAll((child) => child.name == `%${headers[headerIndex]}%`) || [] as SceneNode[];
        for (let childIndex = 0; childIndex < targetChildren.length; childIndex++) {
            const child = targetChildren[childIndex];
            switch (child.type) {
                case "TEXT": {
                    const fontName = child.fontName as FontName;
                    if (!loadedFonts[`${fontName.family}${fontName.style}`]) {
                        await figma.loadFontAsync(fontName);
                        loadedFonts[`${fontName.family}${fontName.style}`] = true;
                    }
                    child.characters = item[childIndex];
                    break;
                }
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
