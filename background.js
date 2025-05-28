const takeCaredOfDomains = [
    'tv16.nontondrama.click',
    'tv4.lk21official.cc'
]; 

chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
  // Get the source tab that initiated the new tab
  chrome.tabs.get(details.sourceTabId, (sourceTab) => {
    // Get the domain of the source tab
    const sourceDomain = new URL(sourceTab.url).hostname;
    // Get the domain of the new tab
    const newTabDomain = new URL(details.url).hostname;

    console.log(`Source Domain: ${sourceDomain}`);
    console.log(`New Tab Domain: ${newTabDomain}`);

    // If domains don't match, close the new tab
    if (takeCaredOfDomains.includes(sourceDomain) && sourceDomain !== newTabDomain) {
      chrome.tabs.remove(details.tabId);
    }
  });
});
