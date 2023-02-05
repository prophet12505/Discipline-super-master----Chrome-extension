console.log("service worker launched!");
//the way to get url of an html panel
console.log(chrome.extension.getURL("drop-down-panel.html"));
// drop-down-panel-url : chrome-extension://bcmjpfphiegenlinpaicamddhgblgbnb/drop-down-panel.html

//initialize
let settingsObject = {};
settingsObject.blockedUrls = [];
settingsObject.keywords = [];
settingsObject.generalBlockSwitch = false;
settingsObject.whiteListMode=false;
settingsObject.allowedUrlsByDefault=
[
    'google.com',
    "www.google.com/",
    "https://www.google.com/",
    chrome.runtime.getURL('option-panel.html'),
    chrome.runtime.getURL('option-panel.js'),
    chrome.runtime.getURL('option-panel.css'),
    chrome.runtime.getURL('drop-down-panel.html'),
    chrome.runtime.getURL('drop-down-panel.js'),
    chrome.runtime.getURL('drop-down-panel.css'),
    "chrome://extensions/",
    "cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
    "localhost",
    "127.0.0.1",
    "localhost:",
    "http://localhost:8080",
    "localhost:8080/"
];
settingsObject.redirectUrl="google.com";
settingsObject.waitTimeBeforeUnlock=0;
chrome.storage.sync.get(settingsObject, items => {
    settingsObject.blockedUrls = items.blockedUrls;
    settingsObject.keywords = items.keywords;
    settingsObject.generalBlockSwitch = items.generalBlockSwitch;
    settingsObject.whiteListMode=items.whiteListMode;
    settingsObject.allowedUrlsByDefault=items.allowedUrlsByDefault;
    settingsObject.redirectUrl=items.redirectUrl;
    settingsObject.waitTimeBeforeUnlock=items.waitTimeBeforeUnlock;
}
);

function syncToStorage() {
    chrome.storage.sync.set(settingsObject, () => {
        console.log("settingsObject is stored")
    });
    chrome.runtime.sendMessage({
        type: "RETURN_ALL_STORAGE_INFORMATION",
        payload: settingsObject
    });
}





chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //console.log("request");
        //console.log(request);
        switch (request.type) {
            case "GET_ALL_STORAGE_INFORMATION": {
                //initialize data from the storage
                try {

                    //console.log("GET ALL STORAGE INFORMATION");
                    //console.log(settingsObject);
                    syncToStorage();

                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: "RETURN_ALL_STORAGE_INFORMATION",
                            payload: settingsObject
                        }, function (response) {
                            console.log(response);
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
                break;
            }
            case "GENERAL_BLOCK_TURNS_ON":
                {
                    //console.log("GENERAL_BLOCK_TURNS_ON");
                    settingsObject.generalBlockSwitch = true;
                    syncToStorage();// after setting the block switch, turn on the sync settings
                    break;
                }

            case "GENERAL_BLOCK_TURNS_OFF":
                {
                    // code block
                    //console.log("GENERAL_BLOCK_TURNS_OFF");
                    settingsObject.generalBlockSwitch = false;
                    syncToStorage();
                    break;
                }
            case "ADD_BLOCK_LIST": {
                console.log("ADD_BLOCK_LIST");
                settingsObject.blockedUrls.push(request.payload);
                syncToStorage();
                break;
            }
            case "ADD_KEYWORD": {
                //console.log("ADD_KEYWORD");
                settingsObject.keywords.push(request.payload);
                syncToStorage();
                break;
            }
            case "DELETE_BLOCK_URL": {
                console.log("DELETE_BLOCK_URL");
                settingsObject.blockedUrls.splice(request.payload, 1);
                syncToStorage();
                break;
            }
            case "DELETE_KEYWORD": {
                //console.log("DELETE_KEYWORD");
                settingsObject.keywords.splice(request.payload, 1);
                syncToStorage();
                break;
            }
            //get keywords to block in the content script
            case "UPDATE_SETTINGS":{
                //console.log("UPDATE_SETTINGS");
                settingsObject=request.payload;
                syncToStorage();
                break;
            }
            default:
                break;
        }
    }
);