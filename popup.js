const play = document.querySelector('#play');
const darkMode = document.querySelector('#darkMode');
const fontChooser = document.querySelector('.fontChooser');
const fontWrapper = document.querySelector('.fontWrapper');
if(fontWrapper)fontWrapper.addEventListener('click', e=> {
    handleFont(e);
});

if(fontChooser)fontChooser.addEventListener('click', async ()=> {
    if(!fontChooser.classList.contains('active')) {
        fontChooser.classList.add('active');
        fontWrapper.classList.remove('hidden');
    } else {
        
        fontChooser.classList.remove('active');
        fontWrapper.classList.add('hidden');
    }
});

async function handleFont(e) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    //----Apply css with fonts
    try {
        const response = await fetch(chrome.runtime.getURL("font.css"));
        const css = await response.text();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            chrome.scripting.insertCSS({
                target: { tabId: tab.id },
                css: css,
            });
        });
    } catch(err) { 
        console.log('Error: ', err);
    }

    //----Change tag style
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: applyfont,
        args: [e.target.id]
    });  
    window.close();
}
function applyfont(font) {
    const allTags=document.body.querySelectorAll('*');
    allTags.forEach(tag=> {
           tag.style.fontFamily=`${font}`;
    });
    
}

if(darkMode)darkMode.addEventListener('click', async ()=> {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: runDarkMode,
    });
    window.close();
});

function runDarkMode() {
    const allTags=document.body.querySelectorAll('*');
    allTags.forEach(tag=> {
           tag.style.backgroundColor="rgb(32,32,32)";
           if(tag.tagName==='A')tag.style.color="green";
           else tag.style.color="aliceBlue";
    });
    document.body.style.backgroundColor="rgb(32,32,32)";
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
    window.close();
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

