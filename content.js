console.log('Content script running');

function extractCompanyName() {
  const domain = window.location.hostname.replace('www.', '').replace('.com', '');
  console.log('domain:', domain);

  const metaTags = document.querySelectorAll('meta');
  console.log('metaTags:', metaTags);
  let metaCompanyName = '';
  metaTags.forEach((tag) => {
    if (
      tag.getAttribute('name') === 'author' ||
      tag.getAttribute('property') === 'og:site_name' ||
      tag.getAttribute('property') === 'og:title' ||
      tag.getAttribute('property') === 'og:brand' ||
      tag.getAttribute('name') === 'twitter:title' ||
      tag.getAttribute('name') === 'twitter:site'
    ) {
      metaCompanyName = tag.getAttribute('content');
    }
  });
  console.log('metaCompanyName:', metaCompanyName);

  return domain;
}

const companyName = extractCompanyName();
console.log('Extracted Company Name:', companyName);

chrome.runtime.sendMessage({
  action: 'setCompanyName',
  companyName: extractCompanyName()
}, (response) => {
  if (chrome.runtime.lastError) {
    console.error('Error sending message:', chrome.runtime.lastError.message);
  } else {
    console.log('Response from background script:', response);
  }
});