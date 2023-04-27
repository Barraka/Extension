
function createContextMenuItem() {
    chrome.contextMenus.create({
      id: "1",
      title: "Extract text",
      contexts: ["link"],
    });
}

chrome.contextMenus.removeAll(() => {
    createContextMenuItem();
});

//listener for context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const newURL = info.linkUrl;
    if (newURL) {
        chrome.tabs.create({ url: "empty.html" }, (newTab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === newTab.id && changeInfo.status === "complete") {
                    chrome.tabs.sendMessage(newTab.id, { type: "openUrl", url: newURL });
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            });
        });
    }
});
