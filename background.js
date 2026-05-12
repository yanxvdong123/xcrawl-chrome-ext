// background.js — XCrawl Chrome Extension service worker
// Handles API calls from popup and content script

const XCRAWL_API_URL = 'https://api.xcrawl.com/v1';

chrome.runtime.onInstalled.addListener(() => {
  console.log('🕷️ XCrawl Scraper Extension installed');
});

// Listen for scrape requests from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCRAPE_PAGE') {
    handleScrape(request.url, request.apiKey)
      .then(sendResponse)
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async response
  }
  if (request.type === 'GET_API_KEY') {
    chrome.storage.sync.get(['xcrawlApiKey'], (result) => {
      sendResponse({ apiKey: result.xcrawlApiKey || '' });
    });
    return true;
  }
});

async function handleScrape(url, apiKey) {
  const key = apiKey || await getStoredApiKey();
  if (!key) return { success: false, error: 'API key not set. Click the extension icon to set it.' };
  
  const resp = await fetch(XCRAWL_API_URL + '/scrape', {
    method: 'POST',
    headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, format: 'markdown' }),
  });
  
  if (!resp.ok) return { success: false, error: `API error: ${resp.status}` };
  return await resp.json();
}

function getStoredApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['xcrawlApiKey'], (result) => {
      resolve(result.xcrawlApiKey || '');
    });
  });
}
