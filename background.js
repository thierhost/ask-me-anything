let session = null;

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

function setupContextMenu() {
    chrome.contextMenus.create({
      id: 'define-word',
      title: 'Ask Me Anything About This !',
      contexts: ['selection']
    });
  }
  
chrome.runtime.onInstalled.addListener(() => {
    setupContextMenu();
    (async() => {
        session =  await ai.assistant.create({
            systemPrompt: `Pretend to be one of the most knolewdgeable person in the world named Toto. 
            You will perform an Ask me Anything session with the rest of the world for sharing knowledge and wisdom.`
        });
    })();
  });

chrome.contextMenus.onClicked.addListener((info, tab) => {
    let selectedText = info.selectionText;
    let promptResult = null;
    if(selectedText) {
        // let ask Gemini about the selected text
        (async() => {
            if(session !== null){
                try {
                    const freshSession = await session.clone(); 
                    promptResult = await freshSession.prompt(`Tell me anything you know about the this topic: ${selectedText}. Keep the answer short in 100 words and consice.`);
                    if(promptResult){
                        let message  = {
                            'selectedText':selectedText,
                            'promptResult':promptResult
                        };
                        await chrome.runtime.sendMessage({amaAnswer : message});
                    }
                } catch (error) {
                    let message  = {
                        'selectedText':selectedText,
                        'promptResult':null
                    };
                    await chrome.runtime.sendMessage({amaAnswer : message});
                }
                
            }
        })();

        chrome.sidePanel.open({ windowId: tab.windowId });    
    }
});