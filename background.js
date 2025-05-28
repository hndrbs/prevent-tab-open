const domainsToKeep = [
    'tv16.nontondrama.click',
    'tv4.lk21official.cc'
]; 

function isDomainAllowed(sourceUrl, newUrl) {
    const sourceDomain = new URL(sourceUrl).hostname;
    const newDomain = new URL(newUrl).hostname;
    return domainsToKeep.includes(sourceDomain) && sourceDomain === newDomain;
}


chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
  // Get the source tab that initiated the new tab
  chrome.tabs.get(details.sourceTabId, (sourceTab) => {
    if (!isDomainAllowed(sourceTab.url, details.url)) {
      chrome.tabs.remove(details.tabId);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
  if (changeInfo.url) {
    // Get the original URL from the tab's opener
    chrome.tabs.get(tabId, (currentTab) => {
      if (currentTab.openerTabId) {
        chrome.tabs.get(currentTab.openerTabId, (openerTab) => {
          if (!isDomainAllowed(openerTab.url, changeInfo.url)) {
            chrome.tabs.remove(tabId)
          }
        });
      }
    });
  }
});