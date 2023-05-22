// Update the following number to however many seconds you want between IP checks
const checkTime = 10; // Default 10 = 10 seconds

chrome.runtime.onStartup.addListener(keepAlive);
function keepAlive() {
  setInterval(chrome.runtime.getPlatformInfo, 20e3);
}
keepAlive();

let currentIP = null;
let changeCount = 0;

function checkIP() {
  fetch('https://api.ipify.org')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then((ip) => {
      if (currentIP && currentIP !== ip) {
        changeCount++;
        chrome.action.setBadgeText({ text: changeCount.toString() });
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'IP Change Detected',
          message: 'Your IP has changed to ' + ip
        });
      }
      currentIP = ip;
    })
    .catch((error) => {
      console.error(`Fetch Error: ${error}`);
    });
}

checkIP();
setInterval(checkIP, (checkTime * 1000));

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "getIP") {
    sendResponse({ip: currentIP});
  } else if (request.type === "clearBadge") {
    changeCount = 0;
    chrome.action.setBadgeText({ text: '' });
  }
});