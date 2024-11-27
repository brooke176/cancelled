console.log('Popup script started');

document.addEventListener('DOMContentLoaded', async() => {
  console.log('Popup script loaded');
  try {
    const response = await fetch(chrome.runtime.getURL('./esg_scores.json'));
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const esgData = await response.json();
    console.log('esgData:', esgData);

    chrome.runtime.sendMessage({ action: 'getCompanyName' }, (response) => {
      const companyName = response.companyName;
      const result = esgData.find((entry) => entry.Company.toLowerCase() === companyName.toLowerCase());
      const score = result ? result.Value : 'N/A';

      document.getElementById('score').innerText = score !== 'N/A' ? score : 'No Score Found';
      document.getElementById('details').innerText = companyName || 'Unknown Company';

      chrome.runtime.sendMessage({
        action: 'updateBadge',
        companyName: companyName
      }, (response) => {
        if (response.success) {
          console.log('Badge updated successfully');
        } else {
          console.error('Failed to update badge:', response.error);
        }
      });
    });
  } catch (error) {
    console.error('Failed to fetch ESG data:', error);
  }
});