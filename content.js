// content.js — XCrawl Chrome Extension content script
// Injects scrape button on web pages

console.log('🕷️ XCrawl Scraper loaded');

let scrapeButton = null;

function createButton() {
  if (scrapeButton) return;
  scrapeButton = document.createElement('div');
  scrapeButton.innerHTML = '🕷️ Scrape';
  scrapeButton.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; z-index: 999999;
    background: #4f46e5; color: white; padding: 10px 18px;
    border-radius: 8px; cursor: pointer; font-size: 14px;
    font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: all 0.2s;
  `;
  scrapeButton.onmouseover = () => { scrapeButton.style.transform = 'scale(1.05)'; };
  scrapeButton.onmouseout = () => { scrapeButton.style.transform = 'scale(1)'; };
  scrapeButton.onclick = async () => {
    scrapeButton.innerHTML = '⏳ Scraping...';
    try {
      const resp = await chrome.runtime.sendMessage({
        type: 'SCRAPE_PAGE',
        url: window.location.href,
      });
      if (resp.success) {
        alert('✅ Page scraped!\n' + (resp.content || '').substring(0, 500));
      } else {
        alert('❌ Error: ' + (resp.error || 'Unknown'));
      }
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
    scrapeButton.innerHTML = '🕷️ Scrape';
  };
  document.body.appendChild(scrapeButton);
}

// Wait for page load
if (document.readyState === 'complete') {
  setTimeout(createButton, 2000);
} else {
  window.addEventListener('load', () => setTimeout(createButton, 2000));
}
