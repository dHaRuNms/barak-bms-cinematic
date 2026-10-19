import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-webgl'] });
await mkdir('.impeccable/review/film', { recursive: true });
const reports = [];
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/?motion=film-v2', { waitUntil: 'networkidle' });
  const state = () => page.locator('video').evaluate(video => ({ time: video.currentTime, frames: video.getVideoPlaybackQuality().totalVideoFrames, paused: video.paused, ready: video.readyState }));
  await page.waitForFunction(() => document.querySelector('video').currentTime > .5);
  await page.screenshot({ path: `.impeccable/review/film/${name}-live.png` });
  const first = await state();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `.impeccable/review/film/${name}-later.png` });
  const second = await state();
  await page.getByRole('button', { name: 'Pause animation' }).click();
  const paused = await state();
  await page.waitForTimeout(500);
  const pausedAfter = await state();
  await page.screenshot({ path: `.impeccable/review/film/${name}-paused.png` });
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images, image => { image.loading = 'eager'; return image.decode(); }));
    scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.screenshot({ path: `.impeccable/review/film/${name}-full.png`, fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.screenshot({ path: `.impeccable/review/film/${name}-reduced.png` });
  reports.push({ name, webglDisabled: true, first, second, paused, pausedAfter, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
  await page.close();
}
await writeFile('.impeccable/review/film/report.json', JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports, null, 2));
await browser.close();
