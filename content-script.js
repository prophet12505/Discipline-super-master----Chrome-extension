console.log("this script has been executed!");
//select all the text : document.body.
// console.log(chrome.extension.getURL("drop-down-panel.html"));
window.onload=async ()=>{
    chrome.runtime.sendMessage({
        // type:"GET_KEYWORDS"
        type:"GET_ALL_STORAGE_INFORMATION"
    });
    console.log("GET_ALL_STORAGE_INFORMATION");
};
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
    function keywordsDetect(settingsObject){
        //if block switch is open
        if(settingsObject.generalBlockSwitch){
        const text=document.body.innerText;
            const regex = new RegExp(settingsObject.keywords.join("|"), "i");
            const containsKeyword = regex.test(text);
            if(containsKeyword){
                //const matchedKeyword= keywords.some(keyword => text.includes(keyword));
                console.log("keywords detacted!");
                // window.open(settingsObject.redirectUrl, "_self");
                let fullPath = settingsObject.redirectUrl;
                window.location.replace(fullPath);
            }
        }
    }
    function urlDetect(settingsObject){
        let currentUrl = window.location.pathname;
        console.log(currentUrl); // "/path"
        if(settingsObject.generalBlockSwitch){

            //check if it's in the  whiteListMode
            if(!settingsObject.whiteListMode){
                //if it's in the block list
                if (settingsObject.blockedUrls.some(url => currentUrl.startsWith(url))) {
                    //if it's not in the allowed list
                    if (!settingsObject.allowedUrlsByDefault.some(url => currentUrl.startsWith(url))){
                        console.log("blocked url is detacted!");
                        let fullPath = settingsObject.redirectUrl;
                         window.location.replace(fullPath);
                    }
                }
            }
            //white list mode
            else{
                console.log("It's whitelist mode!");
                //if it's not in the 
                if(settingsObject.blockedUrls.some(url => currentUrl.startsWith(url))){
                    console.log("your webpage is in the whitelist");
                }
                else{
                    console.log("your webpage is not in the whitelist");
                    //if it's not in the allowed list
                    if (!settingsObject.allowedUrlsByDefault.some(url => currentUrl.startsWith(url))){
                        
                        let fullPath = settingsObject.redirectUrl;
                        alert("blocked url is detacted, redirecting:"+fullPath);
                        window.location.replace(fullPath);
                    }
                }
            }
            
        }
    }
chrome.runtime.onMessage.addListener(
    (request,sender,response)=>{
        console.log("request:");
        console.log(request);
    switch(request.type){
        case "RETURN_ALL_STORAGE_INFORMATION":{
            console.log("RETURN_ALL_STORAGE_INFORMATION");
            //console.log(request.payload);
            const settingsObject=request.payload;
            console.log(settingsObject);
            if(!window.location.href.startsWith(settingsObject.redirectUrl)){
                keywordsDetect(settingsObject);
                urlDetect(settingsObject);
            }
        
            break;
        }
        default:{
            break;
        }
    }
});
