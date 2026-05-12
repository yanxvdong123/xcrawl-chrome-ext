// === XCrawl Data Extractor - Popup Script ===

const XCRAWL_API_URL = 'https://api.xcrawl.com/v1/scrape';

const elements = {
  currentUrl: document.getElementById('currentUrl'),
  formatSelect: document.getElementById('formatSelect'),
  extractBtn: document.getElementById('extractBtn'),
  screenshotBtn: document.getElementById('screenshotBtn'),
  resultArea: document.getElementById('resultArea'),
  resultContent: document.getElementById('resultContent'),
  loadingArea: document.getElementById('loadingArea'),
  errorArea: document.getElementById('errorArea'),
  errorMessage: document.getElementById('errorMessage'),
  copyBtn: document.getElementById('copyBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  settingsLink: document.getElementById('settingsLink'),
};

// === Current Tab Info ===
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (tab?.url) {
    elements.currentUrl.textContent = tab.url.length > 50
      ? tab.url.slice(0, 50) + '...'
      : tab.url;
  }
});

// === Extract Button ===
elements.extractBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return showError('No active tab detected.');

  const url = tab.url;
  const format = elements.formatSelect.value;

  showLoading();
  hideResult();
  hideError();

  try {
    const result = await scrapeUrl(url, format);
    displayResult(JSON.stringify(result, null, 2));
  } catch (err) {
    showError(err.message);
  }
});

// === Screenshot Button ===
elements.screenshotBtn.addEventListener('click', async () => {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
    displayResult(`data:image/png;base64,${dataUrl.split(',')[1]}`);
    // For display purposes, show a note
    elements.resultContent.textContent = '✅ Screenshot captured! Use "Download" to save.';
  } catch (err) {
    showError('Screenshot failed: ' + err.message);
  }
});

// === Copy Button ===
elements.copyBtn.addEventListener('click', () => {
  const text = elements.resultContent.textContent;
  navigator.clipboard.writeText(text).then(() => {
    elements.copyBtn.textContent = '✅ Copied!';
    setTimeout(() => { elements.copyBtn.textContent = '📋 Copy'; }, 1500);
  });
});

// === Download Button ===
elements.downloadBtn.addEventListener('click', () => {
  const text = elements.resultContent.textContent;
  const format = elements.formatSelect.value;
  const ext = format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt';
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `extracted-data.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
});

// === Settings Link ===
elements.settingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// === API Helper ===
async function scrapeUrl(url, format = 'json') {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['xcrawlApiKey', 'apiEndpoint'], (items) => {
      const apiKey = items.xcrawlApiKey || '';
      const endpoint = items.apiEndpoint || XCRAWL_API_URL;

      if (!apiKey) {
        reject(new Error('No API key set. Please configure in Settings.'));
        return;
      }

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({ url, format }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  });
}

// === UI Helpers ===
function showLoading() {
  elements.loadingArea.classList.remove('hidden');
}

function hideLoading() {
  elements.loadingArea.classList.add('hidden');
}

function showResult() {
  elements.resultArea.classList.remove('hidden');
}

function hideResult() {
  elements.resultArea.classList.add('hidden');
}

function showError(msg) {
  elements.errorMessage.textContent = msg;
  elements.errorArea.classList.remove('hidden');
}

function hideError() {
  elements.errorArea.classList.add('hidden');
}

function displayResult(text) {
  hideLoading();
  elements.resultContent.textContent = text;
  showResult();
}
