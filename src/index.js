function createTemplateResult(selectedText, promptResult){
    let html = ` 
        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
            <main class="px-3">
                <h3>You asked question about : <span class="text-info"> ${selectedText}</span> </h3>
                <p class="lead">${promptResult}</p>

            </main>
         </div>
        `;
    document.body.innerHTML = '';
    document.body.innerHTML = html;
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.amaAnswer){
        console.log(request.amaAnswer);
        let {selectedText, promptResult} = request.amaAnswer;
        if(!promptResult){
            promptResult = `Unfortunately I don't know nothing about this topic. Please retry later !`;
        }
        createTemplateResult(selectedText, promptResult);
    } 
});