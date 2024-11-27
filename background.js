let currentCompanyName = '';

console.log('Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.action === 'setCompanyName') {
    currentCompanyName = message.companyName;
    console.log('Company name set to:', currentCompanyName);
    sendResponse(true);
  } else if (message.action === 'getCompanyName') {
    sendResponse({ companyName: currentCompanyName });
  } else if (message.action === 'updateBadge') {
    const companyName = message.companyName;
    console.log('updateBadge action received with companyName:', companyName);
    updateBadge(companyName).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Error updating badge:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});

async function updateBadge(name) {
  console.log('updateBadge called with name:', name);
  const response = await fetch(chrome.runtime.getURL('./esg_scores.json'));
  const esgData = await response.json();
  console.log('esgData loaded');

  // const normalizedName = name.trim().toLowerCase();
  const normalizedName = 'asos';
  console.log('normalizedName:', normalizedName);
  const result = esgData.find((entry) => entry.Company.toLowerCase() === normalizedName);

  const score = result ? result.Value : 'N/A';
  console.log('Matched ESG Score:', score);

  chrome.action.setBadgeText({ text: score !== 'N/A' ? `${Math.round(score)}` : 'N/A' });
  chrome.action.setBadgeBackgroundColor({ color: score !== 'N/A' ? 'green' : 'gray' });
}