# XCrawl Data Extractor 🕷️

A Chrome extension for one-click web page data extraction. Powered by XCrawl Proxy API.

## Features

- 🔍 **Extract** — scrape any webpage's content in one click
- 📸 **Screenshot** — capture visible tab as PNG
- 📋 **Copy** — results to clipboard
- ⬇️ **Download** — save as Markdown/JSON/Text
- ⚙️ **Customizable** — your own XCrawl API key

## Installation

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `chrome-ext-data-extractor` folder
5. Click the extension icon to open the popup
6. Go to Settings (⚙️) → enter your XCrawl API Key

## Development

```bash
# Make changes, then reload the extension from chrome://extensions
```

## Publishing to Chrome Web Store

1. Zip the folder: `zip -r xcrawl-extractor.zip manifest.json *.html *.js *.css icons/`
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Pay one-time registration fee ($5) if not registered
4. Upload zip, fill details, submit for review

## Monetization

- **Free tier**: 10 extracts/month
- **Premium**: $2.99/mo via Chrome Web Store licensing
