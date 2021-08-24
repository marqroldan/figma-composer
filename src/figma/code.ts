figma.showUI(__html__, { width: 610, height: 480 });

figma.ui.onmessage = async msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    console.log("I got triggered!");
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
                figma.ui.postMessage({ type: 'Compose', action: 'progress', message: 'Nice selection' })
                const selectedFrame = selection[0];
                const headers = msg.headers;

                if ((selectedFrame?.name || '').startsWith('[Preview]')) {
                    console.log("Frame started with [Preview]")
                    return;
                }

                switch (msg.action) {
                    case 'preview': {
                        const item = msg.item;
                        const createPreviewName = (name: string) => `[Preview] ${name}`;
                        //// Find if there's a preview frame
                        let targetPreviewFrame = figma.currentPage.findChild((node) => {
                            return node.type === 'FRAME' && node.name === createPreviewName(selectedFrame.name);
                        }) as FrameNode;
                        //// Clone the frame for preview
                        if (targetPreviewFrame == null) {
                            console.log("No targetPreviewFrame found")
                            targetPreviewFrame = selectedFrame.clone();
                            targetPreviewFrame.name = createPreviewName(selectedFrame.name);
                            targetPreviewFrame.x = targetPreviewFrame.x + 100 + selectedFrame.width;
                            figma.currentPage.appendChild(targetPreviewFrame);
                        }
                        figma.viewport.scrollAndZoomIntoView([targetPreviewFrame]);

                        //// Iterate through children and find matching targets
                        headers.forEach((header: string, index: number) => {
                            const targetChildren = targetPreviewFrame.findAll((child) => child.name == `%${header}%`) || [] as SceneNode[];
                            targetChildren.forEach(async (child) => {
                                ///modify
                                switch (child.type) {
                                    case "TEXT": {
                                        await figma.loadFontAsync(child.fontName as FontName)
                                        child.characters = item[index];
                                        break;
                                    }
                                }
                            })
                        })


                        break;
                    }
                }
                return;
            } else {
                figma.ui.postMessage({ type: 'Compose', action: 'error', message: 'Selection should only be one Frame' })
                return;
            }
        }
        case 'create-rectangles': {
            const nodes: SceneNode[] = [];
            /*
            
            for (let i = 0; i < msg.count; i++) {
              const rect = figma.createRectangle();
              rect.x = i * 150;
              rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
              figma.currentPage.appendChild(rect);
              nodes.push(rect);
            }
        
            */
            //figma.currentPage.selection = nodes;
            //figma.viewport.scrollAndZoomIntoView(nodes);
            const selectedFrame = figma.currentPage.findChild((n) => {
                return n.type === 'FRAME' && n.name === 'A4 - 5';
            });

            const data = [];
            for (let i = 0; i < 1; i++) {
                try {
                    const pdfData = await selectedFrame.exportAsync({ format: 'PDF' });
                    data.push(pdfData);
                } catch (e) {
                    //
                }
            }

            figma.ui.postMessage({ type: 'pdfExport', data })
            break;
        }
    }
    //figma.closePlugin();

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
};
