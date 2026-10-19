import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
await mkdir('.impeccable/review', { recursive: true });
const reports = [];
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { for (const img of document.images) { img.loading = 'eager'; } await Promise.all([...document.images].map(img => img.decode().catch(() => {}))); });
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
  await page.screenshot({ path: `.impeccable/review/${name}-hero.png` });
  await page.locator('.partnership').screenshot({ path: `.impeccable/review/${name}-partnership.png` });
  reports.push({ name, errors, ...(await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src), heading: document.querySelector('h1').innerText }))) });
  await page.close();
}
await writeFile('.impeccable/review/browser-report.json', JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports, null, 2));
await browser.close();
