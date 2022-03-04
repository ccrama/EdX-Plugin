let darkModeEnabled = false

chrome.storage.sync.get(['dark_mode'], function(items) {
    this.darkModeEnabled = items.dark_mode
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.setting === "toggle_dark_mode") {
            chrome.storage.sync.set({ dark_mode: !darkModeEnabled }, function() {
                darkModeEnabled = !darkModeEnabled
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { setting: 'dark_mode', new_value: darkModeEnabled }, function(response) {});
                });

            })
            sendResponse()
        } else if (request.setting === "dark_mode") {
            sendResponse({ value: darkModeEnabled });
        }
    }
);