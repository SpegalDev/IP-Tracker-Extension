chrome.runtime.sendMessage({type: "getIP"}, function(response) {
  document.getElementById('ip').innerText = response.ip;
});

// Send message to clear badge when popup is opened
chrome.runtime.sendMessage({type: "clearBadge"});