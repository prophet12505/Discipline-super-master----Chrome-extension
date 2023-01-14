console.log("this script has been executed!");
//select all the text : document.body.
// console.log(chrome.extension.getURL("drop-down-panel.html"));
window.onload=async ()=>{
    chrome.runtime.sendMessage({
        type:"GET_KEYWORDS"
    });
    console.log("GET_KEYWORDS");
};
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
chrome.runtime.onMessage.addListener(
    (request,sender,response)=>{
        console.log("request:");
        console.log(request);
    switch(request.type){
        case "RETURN_KEYWORDS":{
            console.log("RETURN_KEYWORDS");
            //console.log(request.payload);
            const keywords=request.payload;
            const text=document.body.innerText;
            const regex = new RegExp(keywords.join("|"), "i");
            const containsKeyword = regex.test(text);
            if(containsKeyword){
                //const matchedKeyword= keywords.some(keyword => text.includes(keyword));
                console.log("keywords detacted!");
                window.open("https://www.google.com", "_self");
            }
            break;
        }
        default:{
            break;
        }
    }
});
