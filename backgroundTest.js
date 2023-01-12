console.log("service worker launched!");
console.log(chrome.extension.getURL("drop-down-panel.html"));
// drop-down-panel-url : chrome-extension://bcmjpfphiegenlinpaicamddhgblgbnb/drop-down-panel.html

//initialize
let settingsObject={};
settingsObject.blockedUrls=[];
settingsObject.keywords=[];
settingsObject.generalBlockSwitch=false;
chrome.storage.sync.get(settingsObject, items => {
    settingsObject.blockedUrls = items.blockedUrls;
    settingsObject.keywords = items.keywords;
    settingsObject.generalBlockSwitch=items.generalBlockSwitch;
}
);

function syncToStorage(){
    chrome.storage.sync.set(settingsObject,()=>{
        console.log("settingsObject is stored")
    });
    chrome.runtime.sendMessage({
        type:"RETURN_ALL_STORAGE_INFORMATION",
        payload:settingsObject
    });
}

//how to dynamically change this??? change the block when settingsObject changed
//keyword function is not available
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      // Check if the URL is in the blocked list
    if (settingsObject.blockedUrls.some(url => details.url.startsWith(url))) {
        return {
            cancel: true
        };
    }
      // If the URL is not in the blocked list, fetch the website content
      // and scan it for keywords
    fetch(details.url)
        .then(response => response.text())
        .then(text => {
        console.log("text captured");
        // for (const keyword in settingsObject.keywords) {
        //     if (text.includes(keyword)) {
        //     return {
        //         cancel: true
        //     };
        //     }
        // }
        });
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
  );


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("request");
        console.log(request);
        switch(request.type) {
            case "GET_ALL_STORAGE_INFORMATION":{
                //initialize data from the storage
                try {
                   
                    console.log("GET ALL STORAGE INFORMATION");
                    console.log(settingsObject);
                    syncToStorage();
                } catch (error) {
                    console.log(error);
                }
                break;
            }
            case "GENERAL_BLOCK_TURNS_ON":
              {
                console.log("GENERAL_BLOCK_TURNS_ON");
                settingsObject.generalBlockSwitch=true;
                syncToStorage();// after setting the block switch, turn on the sync settings

                
                break;
              }
              
            case "GENERAL_BLOCK_TURNS_OFF":
                {
                    // code block
                    console.log("GENERAL_BLOCK_TURNS_OFF");
                    settingsObject.generalBlockSwitch=false;
                    syncToStorage();
                    break;
                }
            case "ADD_BLOCK_LIST":{
                console.log("ADD_BLOCK_LIST");
                settingsObject.blockedUrls.push(request.payload);
                syncToStorage();
                break;
            }
            case "ADD_KEYWORD":{
                console.log("ADD_KEYWORD");
                settingsObject.keywords.push(request.payload);
                syncToStorage();
                break;
            }
            case "DELETE_BLOCK_URL":{
                console.log("DELETE_BLOCK_URL");
                settingsObject.blockedUrls.splice(request.payload,1);
                syncToStorage();
                break;
            }
            case "DELETE_KEYWORD":{
                console.log("DELETE_KEYWORD");
                settingsObject.keywords.splice(request.payload,1);
                syncToStorage();
                break;
            }
            default:
              break;
          }
    }
  );