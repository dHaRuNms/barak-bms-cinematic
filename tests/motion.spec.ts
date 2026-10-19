import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

async function playbackTime(page: import('@playwright/test').Page) {
  return page.locator('.hero-film').evaluate((node: HTMLVideoElement) => node.currentTime);
}

test('native film displays decoded moving frames, pauses, resumes and suspends', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/company.html');
  const video = page.locator('.hero-film');
  await expect(page.locator('.hero')).toHaveAttribute('data-scene-ready', 'true');
  await expect(video).toHaveCSS('opacity', '1');
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.getVideoPlaybackQuality().totalVideoFrames)).toBeGreaterThan(3);
  await expect.poll(() => playbackTime(page)).toBeGreaterThan(.3);
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  const frozen = await playbackTime(page);
  await page.waitForTimeout(300);
  expect(await playbackTime(page)).toBe(frozen);
  await page.getByRole('button', { name: 'Play animation' }).click();
  await expect.poll(() => playbackTime(page)).toBeGreaterThan(frozen);
  await page.locator('#approach').scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.paused)).toBe(true);
  expect(errors).toEqual([]);
});

test('reduced motion starts still and allows an explicit play choice', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/company.html');
  await expect(page.locator('.hero-art')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-film')).not.toHaveAttribute('src');
  await page.getByRole('button', { name: 'Play animation' }).click();
  await expect.poll(() => playbackTime(page)).toBeGreaterThan(.2);
  await expect(page.locator('.hero-film')).toHaveCSS('opacity', '1');
});

test('animation works with WebGL disabled and no GPU scene downloaded', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).includes('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/company.html');
  await expect.poll(() => playbackTime(page)).toBeGreaterThan(.3);
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(requests.some(url => url.includes('batteryScene'))).toBe(false);
});

test('direct contact links defer the film until the hero is visible', async ({ page }) => {
  await page.goto('/company.html#contact');
  await expect(page.locator('#contact')).toBeInViewport();
  await expect(page.locator('.hero-film')).not.toHaveAttribute('src');
  await page.getByLabel('Your name').fill('Example Engineer');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => playbackTime(page)).toBeGreaterThan(.2);
});

test('autoplay denial exposes Play and recovers on user choice', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    let blocked = false;
    HTMLMediaElement.prototype.play = function () {
      if (!blocked) { blocked = true; return Promise.reject(new DOMException('Autoplay denied', 'NotAllowedError')); }
      return original.call(this);
    };
  });
  await page.goto('/company.html');
  await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
  await page.getByRole('button', { name: 'Play animation' }).click();
  await expect.poll(() => playbackTime(page)).toBeGreaterThan(.2);
});

test('failed media retains the poster and retry restores animation', async ({ page }) => {
  await page.route('**/video/*.mp4', route => route.abort());
  await page.goto('/company.html');
  await expect(page.getByRole('button', { name: 'Retry animation' })).toBeVisible();
  await expect(page.locator('.hero-art')).toHaveCSS('opacity', '1');
  await page.unroute('**/video/*.mp4');
  await page.getByRole('button', { name: 'Retry animation' }).click();
  await expect.poll(() => playbackTime(page)).toBeGreaterThan(.2);
});
