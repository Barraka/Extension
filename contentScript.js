const port = chrome.runtime.connect({ name: "content" });
port.postMessage({ type: "ready" });
port.onMessage.addListener((message) => {
    if (message.type === "openUrl") {
        alert('openurl');
    }
  });

