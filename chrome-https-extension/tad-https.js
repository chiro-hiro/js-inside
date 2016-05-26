/*
Copyright (c) 2016 Dung Tran <tad88.dev@gmail.com>
The MIT License (MIT)
found in the LICENSE file.
*/

//Redirect to HTTPS by default
chrome.tabs.onUpdated.addListener(function(tabId , info) {
    if (info.status == "loading") {
      chrome.tabs.executeScript({
        code: 'if(window.location.protocol === "http:"){window.location.protocol = "https:"};'
      });
    }
});

//Maill to me
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript({
    code: 'window.open("mailto:tad88.dev@gmail.com");'
  });
});
