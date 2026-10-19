import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

test('all seven scenes and assets remain available with reduced motion', async ({ page }) => {
 await page.goto('/');
 await expect(page.locator('.still-scene')).toHaveCount(7);
 await expect(page.locator('.journey-world')).toHaveCount(0);
 for (const image of await page.locator('.still-scene img').all()) {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
 }
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('dashboard controls update data, export CSV and acknowledge warning', async ({ page }) => {
 await page.goto('/#dashboard');
 const chart=page.locator('.history-chart'); const path=await chart.locator('path').last().getAttribute('d');
 await page.getByRole('button',{name:'7d',exact:true}).click();
 expect(await chart.locator('path').last().getAttribute('d')).not.toBe(path);
 await page.getByRole('button',{name:/MODULE 02/}).click();
 await expect(page.locator('.cells-widget')).toContainText('Module 02');
 await page.getByLabel('Inspect a cell').selectOption('0');
 await expect(page.locator('.cell-detail')).toContainText('Cell 25:');
 const download=page.waitForEvent('download');
 await page.getByRole('button',{name:'Export module data'}).click();
 expect((await download).suggestedFilename()).toBe('barak-demo-module-2.csv');
 await page.getByRole('button',{name:'Acknowledge',exact:true}).click();
 await expect(page.getByRole('status')).toContainText('condition remains active');
 await page.getByRole('button',{name:'Pause updates'}).click();
 await expect(page.getByRole('button',{name:'Resume updates'})).toBeVisible();
 await expect(page.locator('.journey-close a')).toHaveAttribute('href','company.html#contact');
});

test('story and dashboard pass automated accessibility checks', async ({ page }) => {
 await page.goto('/');
 await page.evaluate(() => document.fonts.ready);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 expect(result.violations).toEqual([]);
});

test('complete story and company content are pre-rendered without JavaScript', async ({ browser, baseURL }) => {
 const context=await browser.newContext({javaScriptEnabled:false}); const page=await context.newPage();
 await page.goto(baseURL!);
 await expect(page.locator('.still-scene')).toHaveCount(7);
 await expect(page.getByRole('heading',{name:'Battery overview',exact:true})).toBeVisible();
 await page.goto(`${baseURL}/company.html`);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
 await expect(page.locator('#contact')).toContainText('barakmicroelectronics@gmail.com');
 await context.close();
});

test('Rendered film load failure restores the entire still-image experience', async ({ page }) => {
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.route('**/video/bms-journey*.mp4', route => route.abort());
 await page.goto('/');
 await expect(page.locator('.still-scene')).toHaveCount(7,{timeout:30000});
 await expect(page.getByText('Film unavailable. The complete story is available below.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Retry rendered journey'})).toBeVisible();
});

test('camera timeline is continuous and reversible across every scene boundary', async ({}) => {
 const { chapters, sampleTimeline }=await import('../src/journey/timeline');
 for (const chapter of chapters.slice(1)) {
  const before=sampleTimeline(chapter.start-0.000001), after=sampleTimeline(chapter.start+0.000001);
  before.camera.forEach((n,i)=>expect(Math.abs(n-after.camera[i])).toBeLessThan(.01));
 }
});
