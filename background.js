//TODO more settings? better object?
let darkModeEnabled = false

//Store Dark Mode to this extension's storage
chrome.storage.sync.get(['dark_mode'], function(items) {
    this.darkModeEnabled = items.dark_mode
})

//Listen for global settings changes 
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //Check for settings changes
        if (request.setting === "toggle_dark_mode") {

            //Toggle dark mode
            chrome.storage.sync.set({ dark_mode: !darkModeEnabled }, function() {
                darkModeEnabled = !darkModeEnabled

                //Update all open tabs
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { setting: 'dark_mode', new_value: darkModeEnabled }, function(response) {});
                });

            })
            sendResponse()
        } else if (request.setting === "dark_mode") {
            //Tabs use this to discover dark mode
            sendResponse({ value: darkModeEnabled });
        }
    }
);