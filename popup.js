const play = document.querySelector('#play');
const darkMode = document.querySelector('#darkMode');

if(darkMode)darkMode.addEventListener('click', async ()=> {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: runDarkMode,
    });
});

function runDarkMode() {
    const allTags=document.body.querySelectorAll('*');
    allTags.forEach(tag=> {
           tag.style.backgroundColor="rgb(32,32,32)";
           tag.style.color="aliceBlue";
    });
}

if(play)play.addEventListener('click', async ()=> {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: runlink,
    });

    //----Get CSS and apply it
    fetch(chrome.runtime.getURL("body.css"))
    .then(response => response.text())
    .then(css => {        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                css: css,
            });
        });
    })
    .catch((error) => {
    console.error("Error loading CSS file:", error);
    });
});

async function runlink(l) {
    const output = [];
    const outputText = [];
    const allTags=document.body.querySelectorAll('*:not(a):not(script):not(style):not(iframe):not(html)');
    function processNode(node) {
        if(node.tag==='style' || node.tag==='script')return;
        if (node.nodeType === Node.TEXT_NODE) {
            const trimmedText = node.textContent.trim();
            const cleanedText = trimmedText.replace(/\s\s+/g, ' ');        
            if (cleanedText && !outputText.includes(cleanedText)) {
                outputText.push(cleanedText);
                const tag = document.createElement('div');
                tag.classList.add('newDiv');
                tag.innerText = cleanedText;
                output.push(tag);
            }
        } else {
            if(!['A', 'SCRIPT', 'STYLE', 'IFRAME', 'HTML'].includes(node.tagName)) {
                node.childNodes.forEach(child => processNode(child));
            }
        }
    }

    allTags.forEach(tag=> processNode(tag));
    document.head.innerHTML='';
    document.body.innerHTML='';
    output.forEach(x=> {
        document.body.append(x);
    });  
    document.head.innerHTML=''; 
}

