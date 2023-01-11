
console.log("option-panel launched!");
var checkbox = document.getElementById("general-block-switch");
const addBlocklistButton=document.getElementById("add-blocklist-btn");
const addKeywordButton=document.getElementById("add-keyword-btn");
const inputBlockList=document.getElementById("input-blocklist");
const injectBlockList=document.getElementById("inject-blocklist");
//could not select them yet because they are not rendered yet
const blockUrlDeletes=document.querySelectorAll(".block-url-delete");

// update the panel to sync with chrome Storage
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         const { blockedUrls,
//             keywords ,
//             generalBlockSwitch}=request;
//         checkbox.checked=generalBlockSwitch;
//     }

// );
let settingsObject={};


window.onload = async function() {
    
    const response= await chrome.runtime.sendMessage(
        {
            type: "GET_ALL_STORAGE_INFORMATION"
        })
        
        //console.log(response);
    console.log(blockUrlDeletes);
  }

addBlocklistButton.addEventListener("click",async ()=>{
    const response= await chrome.runtime.sendMessage(
        {
            type: "ADD_BLOCK_LIST",
            payload:inputBlockList.value
        })
})
async function deleteBlockUrl(index){
    const response= await chrome.runtime.sendMessage(
        {
            type: "DELETE_BLOCK_URL",
            payload:index
        });
    console.log("DELETE BLOCK URL");
}

for(let i = 0; i < blockUrlDeletes.length; i++){
    
    blockUrlDeletes[i].addEventListener("click", function(e) {
        console.log("delete:"+i);
        deleteBlockUrl(i);
      });
}

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        switch(request.type){
            case "RETURN_ALL_STORAGE_INFORMATION":{
                console.log("settingsObject");
                settingsObject=request.payload;


                //set up panel
                checkbox.checked=settingsObject.generalBlockSwitch;
                injectBlockList.innerHTML=settingsObject.blockedUrls.map((url,index)=>{
                    return "<li class='list-group-item'>"+url+"<button id='block-url-delete-"+index+"' class='btn btn-primary bg-warning block-url-delete'>delete</button></li>";
                });
               

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

// document.getElementById("blocklists").innerHTML=blocklists.map((blocklist)=>{
//     return <>
//     <ul>
//         <li>
//             {blocklist}
//         </li>
//     </ul>
//     </>
// });

// document.getElementById("form").onclick=()=>{
//     chrome.runtime.sendMessage({
//         aciton:"CREATE_URL",
//         payload:document.getElementById("input-blocklist").value
//     })
// }