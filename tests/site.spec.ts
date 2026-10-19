import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Make content checks deterministic independently of the animated-scene suite.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('renders without errors, broken images, or horizontal overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/company.html');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The intelligence layer for a more capable electric future.');
  await expect(page.getByRole('link', { name: 'Explore our solutions' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('solution selector exposes all four products and passes intent to contact', async ({ page }) => {
  await page.goto('/company.html');
  const names = ['Intelligent Battery Systems', 'Battery Emulation & Simulation', 'AI-Assisted Circuit & PCB Design', 'Connected Mobility & Fleet Software'];
  for (const name of names) {
    const item = page.locator('.solution-item').filter({ has: page.locator('summary', { hasText: name }) });
    if (!(await item.getAttribute('open')) && await item.getAttribute('open') !== '') await item.locator('summary').click();
    await expect(item).toHaveAttribute('open', '');
    await expect(item.locator('.solution-content')).toBeVisible();
    await item.getByRole('link', { name: 'Discuss this solution' }).click();
    await expect(page.getByLabel('I’m interested in')).toHaveValue(name);
  }
});

test('contact validates input and prepares an accurate email without claiming delivery', async ({ page }) => {
  await page.goto('/company.html#contact');
  await page.getByRole('button', { name: 'Prepare email' }).click();
  await expect(page.getByRole('link', { name: 'Open email draft' })).toHaveCount(0);
  await page.getByLabel('Your name').fill('   ');
  await page.getByLabel('Email address').fill('engineer@example.com');
  await page.getByLabel('What are you working on?').fill('            ');
  await page.getByRole('button', { name: 'Prepare email' }).click();
  await expect(page.getByRole('link', { name: 'Open email draft' })).toHaveCount(0);
  await page.getByLabel('Your name').fill('Example Engineer');
  await page.getByLabel('Email address').fill('engineer@example.com');
  await page.getByLabel('Organization').fill('Example Mobility');
  await page.getByLabel('What are you working on?').fill('We are exploring a battery management pilot for our fleet.');
  await page.getByRole('button', { name: 'Prepare email' }).click();
  const link = page.getByRole('link', { name: 'Open email draft' });
  await expect(link).toBeFocused();
  const href = await link.getAttribute('href');
  expect(href).toContain('mailto:barakmicroelectronics@gmail.com');
  expect(decodeURIComponent(href!)).toContain('engineer@example.com');
  expect(decodeURIComponent(href!)).toContain('battery management pilot');
  await expect(page.getByRole('status')).toContainText('review and send');
  await page.getByLabel('What are you working on?').fill('Changed project details for a new conversation.');
  await expect(link).toHaveCount(0);
  await page.getByRole('button', { name: 'Prepare email' }).click();
  await expect(link).toBeVisible();
  await page.getByLabel('I’m interested in').selectOption('Investment');
  await expect(link).toHaveCount(0);
});

test('mobile navigation is keyboard operable and closes on selection and Escape', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Mobile menu only');
  await page.goto('/company.html');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Company' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeHidden();
  await expect(page).toHaveURL(/#company$/);
});

test('passes WCAG 2.2 AA automated accessibility checks', async ({ page }) => {
  await page.goto('/company.html');
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('production HTML remains meaningful without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/company.html`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('.solution-item summary').nth(2).click();
  await expect(page.getByRole('heading', { name: 'An intelligent engineering environment for electronics development.' })).toBeVisible();
  await context.close();
});
