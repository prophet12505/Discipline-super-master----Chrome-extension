console.log("drop-down-panel.js is loaded");
document.getElementById("settings-button").innerHTML="open setting panel";
async function updateSettings(){
  console.log("UPDATE_SETTINGS");
  console.log(settingsObject);
  const response = await chrome.runtime.sendMessage(
      {
          type: "UPDATE_SETTINGS",
          payload:settingsObject
      });
}

function openOptionPanel(){
      // Open the extension's options page
      if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
        
      } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('option-panel.html'));
        
      }
}
var settingsObject=[];
var countdown=0;
var optionIsClickable=true;
document.getElementById("settings-button").addEventListener("click", () => {
  if(optionIsClickable){
    setupTimer(settingsObject.waitTimeBeforeUnlock);
  }
  else{
    if(countdown<=0){
      openOptionPanel();
      optionIsClickable=true;
    }
    
  }    
  });
  document.getElementById("open-switch-button").addEventListener("click",()=>{
    settingsObject.generalBlockSwitch=true;
    updateSettings();
    document.getElementById("open-switch-button").style.display="none";
  })
  function updateCountdownTimer() {
    countdown--;
    if (countdown > 0) {
      document.getElementById("settings-button").innerHTML = "Please wait until: "+countdown+" seconds";
    }
    if (countdown <= 0) {
        
        document.getElementById("settings-button").innerHTML = "Time's Up! Open control panel!";
        clearInterval(intervalId);
    }
}
function setupTimer(waitTimeBeforeUnlock){
  countdown=waitTimeBeforeUnlock;
  
  optionIsClickable=false;
  
  //updateCountdownTimer()
  document.getElementById("settings-button").innerHTML = "Please wait !";
  var intervalId = setInterval(updateCountdownTimer, 1000);
}

  window.onload = async function() {
    
    const response= await chrome.runtime.sendMessage(
        {
            type: "GET_ALL_STORAGE_INFORMATION"
        })
  }
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    //console.log("request received!");
    //console.log(request.type);
        switch(request.type){
            case "RETURN_ALL_STORAGE_INFORMATION":{
              settingsObject=request.payload;
              //  countdown=waitTimeBeforeUnlock;
              //console.log(settingsObject);
              if(!settingsObject.generalBlockSwitch){
                document.getElementById("open-switch-button").style.display="block";
              }
              else{
                document.getElementById("open-switch-button").style.display="none";
              }
             
              break;
            }
            default:
              break;
          }
        })