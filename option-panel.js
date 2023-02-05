
console.log("option-panel launched!");
var checkbox = document.getElementById("general-block-switch");
var whiteListSwitch=document.getElementById("whitelist-switch");
const addBlocklistButton=document.getElementById("add-blocklist-btn");
const addKeywordButton=document.getElementById("add-keyword-btn");
const inputBlockList=document.getElementById("input-blocklist");
const inputKeywords=document.getElementById("input-keywords");
const injectBlockList=document.getElementById("inject-blocklist");
const injectKeywords=document.getElementById("inject-keywords");
const exportBlocklist=document.getElementById("export-blocklist");
const inportBlocklist=document.getElementById('inport-blocklist');
const exportKeywords=document.getElementById('export-keywords');
const inportKeywords=document.getElementById('inport-keywords')
const fileInputBlockList = document.getElementById("fileInput-blocklist");
const fileInputKeywords = document.getElementById("fileInput-keywords");
const labelBlockList=document.getElementById("label-blocklist");
const inputRedirectUrl=document.getElementById("input-redirect-url");
const confirmRedirectUrl=document.getElementById("confirm-redirect-url");
const inputRestDelay= document.getElementById("input-rest-delay");

let settingsObject={};
let inputedArray=[];
function isURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}
window.onload = async function() {
    
    const response= await chrome.runtime.sendMessage(
        {
            type: "GET_ALL_STORAGE_INFORMATION"
        })
  }
  confirmRedirectUrl.addEventListener("click", async ()=>{
    //settingsObject.redirectUrl=inputRedirectUrl.value;
    //not function correctly
   
        if(settingsObject.blockedUrls.some(url=>inputRedirectUrl.value.startsWith(url))){
            alert("Can not redirect page that is in blocked url!");
        }
        
        else{
            alert("Change redirect url successfully");
            settingsObject.redirectUrl=inputRedirectUrl.value;
            updateSettings();
        }
    
    
    
  });
  inputRestDelay.addEventListener("change",async ()=>{
    settingsObject.waitTimeBeforeUnlock=inputRestDelay.value;
    updateSettings();
  })
addBlocklistButton.addEventListener("click",async ()=>{
    const inputURL=inputBlockList.value.replace(/^(https?:\/\/)?(www\.)?/, "");
    console.log("inputURL:"+inputURL);
    if(isURL(inputURL)){
        if(settingsObject.blockedUrls.some(url=>inputURL===url)){
            alert("url already exists!");
        }
        else{
            const response= await chrome.runtime.sendMessage(
                {
                    type: "ADD_BLOCK_LIST",
                    payload:inputURL
                })
        }
    }
    else{
        alert("please input legal url!!!");
    }
    
   
})
addKeywordButton.addEventListener("click",async ()=>{
    const response= await chrome.runtime.sendMessage(
        {
            type: "ADD_KEYWORD",
            payload:inputKeywords.value
        })
})
exportBlocklist.addEventListener("click",async ()=>{
    console.log("export-blocklist!");
    const csv = settingsObject.blockedUrls.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

// Create a link element to allow the user to download the CSV file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "blocklist.csv";
    // Add the link element to the document
    document.body.appendChild(link);

    // Click the link to download the CSV file
    link.click();

    // Remove the link element from the document
    document.body.removeChild(link);
});
exportKeywords.addEventListener("click",async ()=>{
    const csv = settingsObject.keywords.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

// Create a link element to allow the user to download the CSV file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "keywords.csv";
    // Add the link element to the document
    document.body.appendChild(link);

    // Click the link to download the CSV file
    link.click();
    // Remove the link element from the document
    document.body.removeChild(link);
})
inportBlocklist.addEventListener("click", async (e)=>{
    e.preventDefault();
    fileInputBlockList.click();
});
inportKeywords.addEventListener("click", async (e)=>{
    e.preventDefault();
    fileInputKeywords.click();
});

fileInputBlockList.addEventListener("change", function(event) {
    

    // Add an event listener to the FileReader's 'onload' event
    
        const inputedFile = event.target.files[0];
        // files[0].split("\\n");
        const reader=new FileReader();
        
        reader.addEventListener('load', function() {
            console.log("reader loaded");
            inputedArray = reader.result.split("\n");
            console.log(inputedArray);
            settingsObject.blockedUrls=inputedArray;
            chrome.runtime.sendMessage({type:"UPDATE_SETTINGS",payload:settingsObject});
        });
        reader.readAsText(inputedFile);// trigger load
})
fileInputKeywords.addEventListener("change", function(event) {
    // Add an event listener to the FileReader's 'onload' event
        const inputedFile = event.target.files[0];
        // files[0].split("\\n");
        const reader=new FileReader();
        
        reader.addEventListener('load', function() {
            console.log("reader loaded");
            inputedArray = reader.result.split("\n");
            console.log(inputedArray);
            settingsObject.keywords=inputedArray;
            chrome.runtime.sendMessage({type:"UPDATE_SETTINGS",payload:settingsObject});
        });
        reader.readAsText(inputedFile);// trigger load
})

async function deleteBlockUrl(index){
    const response= await chrome.runtime.sendMessage(
        {
            type: "DELETE_BLOCK_URL",
            payload:index
        });
    console.log("DELETE BLOCK URL");
}
async function deleteBlockKeyword(index){
    const response= await chrome.runtime.sendMessage(
        {
            type: "DELETE_KEYWORD",
            payload:index
        });
        console.log("DELETE_KEYWORD");
}


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    console.log("request received!");
    console.log(request.type);
        switch(request.type){
            case "RETURN_ALL_STORAGE_INFORMATION":{
                console.log("settingsObject");
                settingsObject=request.payload;


                //set up panel(render the component)
                checkbox.checked=settingsObject.generalBlockSwitch;
                whiteListSwitch.checked=settingsObject.whiteListMode;
                labelBlockList.innerHTML= settingsObject.whiteListMode?"Whitelist":"Blocklist";
                addBlocklistButton.innerHTML= settingsObject.whiteListMode?"Add to whiteList":"Add to blocklist";
                inputRedirectUrl.value=settingsObject.redirectUrl;
                inputRestDelay.value=settingsObject.waitTimeBeforeUnlock;
                injectBlockList.innerHTML=settingsObject.blockedUrls.map((url,index)=>{
                    return "<li class='list-group-item url-row'><p>"+url+"</p><button id='block-url-delete-"+index+"' class='btn btn-warning block-url-delete'>Delete</button></li>";
                
                }).join(" ");   
                //manipulate the dom to add the listener as well
                const blockUrlDeletes=document.querySelectorAll(".block-url-delete");
                for(let i = 0; i < blockUrlDeletes.length; i++){
                    blockUrlDeletes[i].addEventListener("click", function(e) {
                        console.log("delete:"+i);
                        deleteBlockUrl(i);
                    });
                }
                
                injectKeywords.innerHTML=settingsObject.keywords.map((keyword,index)=>{
                    return "<li class='list-group-item url-row'><p>"+keyword+"</p><button id='block-keyword-delete-"+index+"' class='btn btn-warning block-keyword-delete'>Delete</button></li>";
                }).join(" ");
                const blockKeywordDeletes=document.querySelectorAll(".block-keyword-delete");
                for(let i=0;i<blockKeywordDeletes.length;i++){
                    blockKeywordDeletes[i].addEventListener("click",(e)=>{
                        console.log("delete:"+blockKeywordDeletes[i]);
                        deleteBlockKeyword(i);
                    })
                }
                console.log(settingsObject);
                break;
            }
            default:{
                break;
            }
        }
      
    }
  );

checkbox.addEventListener("click", async function() {
    if (this.checked) {
        // Run operation
        console.log("checkbox checked!");
        const response = await chrome.runtime.sendMessage(
            {
                type: "GENERAL_BLOCK_TURNS_ON"
            });
        // do something with response here, not outside the function
        //console.log(response);
    } else {
        // Do something else
        console.log("checkbox unchecked!");
        const response = await chrome.runtime.sendMessage(
            {
                type: "GENERAL_BLOCK_TURNS_OFF"
            });
        //console.log(response);
    }
});
async function updateSettings(){
    console.log("UPDATE_SETTINGS");
    console.log(settingsObject);
    const response = await chrome.runtime.sendMessage(
        {
            type: "UPDATE_SETTINGS",
            payload:settingsObject
        });
}

whiteListSwitch.addEventListener("click", async ()=>{
  
    settingsObject.whiteListMode=!settingsObject.whiteListMode;
    updateSettings();
});

// document.getElementById("form").onclick=()=>{
//     chrome.runtime.sendMessage({
//         aciton:"CREATE_URL",
//         payload:document.getElementById("input-blocklist").value
//     })
// }