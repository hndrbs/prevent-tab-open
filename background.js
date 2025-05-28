const domainsToKeep = [
    'tv16.nontondrama.click',
    'tv4.lk21official.cc'
]; 

const prevUrls = {};

function isDomainBlocked(sourceUrl, newUrl) {
    const sourceDomain = new URL(sourceUrl).hostname;
    const newDomain = new URL(newUrl).hostname;
    return (
      !domainsToKeep.includes(newDomain) 
      && (domainsToKeep.includes(sourceDomain) && sourceDomain !== newDomain)
    )
}


chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
  // Get the source tab that initiated the new tab
  chrome.tabs.get(details.sourceTabId, (sourceTab) => {
    if (isDomainBlocked(sourceTab.url, details.url)) {
      chrome.tabs.remove(details.tabId);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
  if (!changeInfo.url) return;

  const newUrl = changeInfo.url;
  const prevUrl = prevUrls[tabId];
  if (prevUrl && isDomainBlocked(prevUrl, newUrl)) {
    return chrome.tabs.update(tabId, { url: prevUrl });
  }
  prevUrls[tabId] = newUrl;
  return;
});

chrome.tabs.onRemoved.addListener((tabId) => {
    delete prevUrls[tabId];
});