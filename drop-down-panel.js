console.log("drop-down-panel.js is loaded");
document.getElementById("settings-button").innerHTML="open setting panel";
document.getElementById("settings-button").style.color="red";
document.getElementById("settings-button").addEventListener("click", () => {
    // Open the extension's options page
    if (chrome.runtime.openOptionsPage) {
      // New way to open options pages, if supported (Chrome 42+).
      chrome.runtime.openOptionsPage();
    } else {
      // Reasonable fallback.
      window.open(chrome.runtime.getURL('option-panel.html'));
    }
  });