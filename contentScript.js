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
    //----Remove the 2 header elements
    let metaElement = document.querySelector('meta[name*="react-scroll"]');
    let styleElement = document.querySelector('style[data-emotion]');
    if(metaElement)metaElement.remove();
    if(styleElement)styleElement.remove();
    //----Remove the hidden property from main
    let mainElement = document.querySelector('div[class="flex-1 overflow-hidden"]');
    if(mainElement)mainElement.style.overflowY='auto';
    //----Make the inputbar fixed
    let searchElement = document.querySelector('.absolute.bottom-0');
    if(searchElement)searchElement.style.position="fixed";

    //----Handle DOM updates
    const targetNode = document.querySelector('div[class="flex-1 overflow-hidden"]');
    const observer = new MutationObserver((mutationsList, observer) => {
        //----Remove the hidden property from main
        console.log('mutation observed');
        setTimeout(()=> {
            let mainElement = document.querySelector('div[class="flex-1 overflow-hidden"]');
            if(mainElement)mainElement.style.overflowY='auto';
        },200);
        
    });
    if(targetNode)observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
}



