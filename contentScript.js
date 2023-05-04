const port = chrome.runtime.connect({ name: "content" });
port.postMessage({ type: "ready" });
port.onMessage.addListener((message) => {
    if (message.type === "openUrl") {
        alert('openurl');
    }
});

let currentUrl = window.location.href;

//----ChatGPT disable auto scroll
if (currentUrl.includes("openai")) {
    console.log('dom has loaded');
    setTimeout(()=> {
        removeTags();
        const targetNode = document.body;
        const config = { attributes: true, childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            removeTags(); 
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    },300);    
}




