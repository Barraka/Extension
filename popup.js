
const play = document.querySelector('#play');
const darkMode = document.querySelector('#darkMode');
const fontChooser = document.querySelector('.fontChooser');
const fontWrapper = document.querySelector('.fontWrapper');
const chatWrapper = document.querySelector('.chatWrapper');

if(chatWrapper)chatWrapper.addEventListener('click', handleChat);


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

async function handleChat(e) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: removeTags,
    });  
    window.close();
}

async function handleFont(e) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    //----Change tag style
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: applyfont,
        args: [e.target.id]
    });  
    window.close();
}

function applyfont(font) {
    //----Insert new link tak
    const link = document.createElement('link');
    link.setAttribute('href',"https://fonts.googleapis.com/css2?family=Anton&family=Corben&family=Dosis&family=Montserrat&family=Open+Sans:wght@500&family=Poppins&family=Roboto&display=swap");
    link.setAttribute('rel','stylesheet');
    link.setAttribute('type','text/css');
    link.setAttribute('crossorigin','true');
    document.head.append(link);

    //----Change fonts
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

function removeTags() {
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
    //----Add styling to input bar
    const inputBar=document.querySelector('main form');
    if(inputBar) {
        inputBar.style.borderRadius="8px";
        inputBar.style.cursor="pointer";
        inputBar.addEventListener('click', e=> {
            inputBar.querySelector('textarea').focus();
        });
        inputBar.querySelector('textarea').style.padding='4px 2px';
        inputBar.querySelector('textarea').style.fontSize='1.2rem';
        inputBar.addEventListener('mouseover', e=> {
            inputBar.style.outline="2px solid cyan";
        });
        inputBar.addEventListener('mouseout', e=> {
            inputBar.style.outline="none";
        });
    }
}

