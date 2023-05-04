async function paste(thisURL) {
    document.head.innerHTML='';
    document.body.innerHTML='';    
    const postBody = {
        link: thisURL
    };
    const raw = await fetch("https://summary-production.up.railway.app/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",                
        },
        body: JSON.stringify(postBody),
    });
    let data;
    if(raw.ok)data = await raw.json();
    else return alert('not ok');

    const extractedText = data.data;
    const singleBreakText = extractedText.replace(/\n{2,}/g, '\n');
    const htmlText = singleBreakText
        .split('\n')
        .map(segment => `<div>${segment}</div>`)
        .join('');
    document.body.innerHTML = htmlText;
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
    //----Change code sections
    const codeElements = document.querySelectorAll('pre')
    if(codeElements)codeElements.forEach(tag=> {
        tag.style.transform = "translateX(-110px)";
        tag.style.width = "800px";
    });
    //----Add styling to input bar
    const inputBar=document.querySelector('main form');
    if(inputBar) {
        inputBar.style.borderRadius="8px";
        inputBar.style.cursor="pointer";
        inputBar.style.transition="outline 0.4s ease";
        inputBar.addEventListener('click', e=> {
            inputBar.querySelector('textarea').focus();
        });
        inputBar.querySelector('textarea').style.padding='4px 2px';
        inputBar.querySelector('textarea').style.fontSize='1.2rem';
        inputBar.addEventListener('mouseover', e=> {
            inputBar.style.outline="1px solid cyan";
        });
        inputBar.addEventListener('mouseout', e=> {
            inputBar.style.outline="none";
        });
    }
}

