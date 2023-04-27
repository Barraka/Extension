chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "openUrl") {
        paste(request.url);
    }
});


async function paste(thisURL) {  
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
        .map(segment => `<div class='newDiv'>${segment}</div>`)
        .join('');
    document.body.innerHTML = htmlText;
}
