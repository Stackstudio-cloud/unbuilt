import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshots() {
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  const baseUrl = 'http://localhost:5000';
  
  // Wait for page loads
  const waitOptions = { 
    waitUntil: 'networkidle0', 
    timeout: 10000 
  };

  try {
    console.log('Taking screenshots...');

    // 1. Homepage
    console.log('📸 Homepage');
    await page.goto(baseUrl, waitOptions);
    await page.waitForTimeout(2000); // Let animations settle
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-homepage.png'),
      fullPage: false
    });

    // 2. Search Results (if there are existing searches)
    console.log('📸 Search Results');
    try {
      // Look for existing search results or create a new search
      const searchButton = await page.$('button[type="submit"]');
      if (searchButton) {
        const searchInput = await page.$('input[type="text"], input[placeholder*="search"]');
        if (searchInput) {
          await searchInput.click();
          await searchInput.type('AI healthcare innovation');
          await searchButton.click();
          await page.waitForTimeout(3000); // Wait for search to complete
          await page.screenshot({ 
            path: path.join(screenshotsDir, '02-search-results.png'),
            fullPage: false
          });
        }
      }
    } catch (e) {
      console.log('Could not capture search results:', e.message);
    }

    // 3. About Page
    console.log('📸 About Page');
    try {
      await page.goto(`${baseUrl}/about`, waitOptions);
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '03-about.png'),
        fullPage: false
      });
    } catch (e) {
      console.log('Could not capture about page:', e.message);
    }

    // 4. Help Page
    console.log('📸 Help Page');
    try {
      await page.goto(`${baseUrl}/help`, waitOptions);
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '04-help.png'),
        fullPage: false
      });
    } catch (e) {
      console.log('Could not capture help page:', e.message);
    }

    // 5. Search History (if available)
    console.log('📸 Search History');
    try {
      await page.goto(`${baseUrl}/searches`, waitOptions);
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: path.join(screenshotsDir, '05-search-history.png'),
        fullPage: false
      });
    } catch (e) {
      console.log('Could not capture search history:', e.message);
    }

    console.log('✅ Screenshots completed!');

  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);