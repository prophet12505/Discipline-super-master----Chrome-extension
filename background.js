// Listen for form submission
document.getElementById("form").addEventListener("submit", e => {
    // Prevent the form from submitting
    e.preventDefault();
  
    // Get the blocklist and keywords from the form
    const blocklist = document.getElementById("blocklist").value;
    const keywords = document.getElementById("keywords").value;
  
    // Save the blocklist and keywords to chrome.storage
    chrome.storage.sync.set({ blocklist, keywords });
  });
  
  // Retrieve the blocklist and keywords from chrome.storage when the extension is loaded
  chrome.storage.sync.get(["blocklist", "keywords"], items => {
    const blockedUrls = items.blocklist.split("\n");
    const keywords = items.keywords.split("\n");
  
    // Use the blocklist and keywords to block websites
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        // Check if the URL is in the blocked list
        if (blockedUrls.some(url => details.url.startsWith(url))) {
          return {cancel: true};
        }
        // If the URL is not in the blocked list, fetch the website content
        // and scan it for keywords
        fetch(details.url)
          .then(response => response.text())
          .then(text => {
            for (const keyword of keywords) {
              if (text.includes(keyword)) {
                return {cancel: true};
              }
            }
          });
      },
      {urls: ["<all_urls>"]},
      ["blocking"]
    );
  });
  