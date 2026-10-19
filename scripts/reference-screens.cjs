const { chromium } = require('/home/dharun/.cache/ms-playwright-go/1.57.0/package');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  for (const [name,url] of [['psi','https://psi.inc/'], ['on-energy','https://www.on.energy/']]) {
    const page = await browser.newPage({ viewport: {width:1440,height:1000}, reducedMotion:'reduce' });
    try {
      await page.goto(url, { waitUntil:'domcontentloaded', timeout:45000 });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `.impeccable/review/reference-${name}.png` });
      console.log(name, await page.title());
    } catch(e) {console.log(name, e.message)}
    await page.close();
  }
  await browser.close();
})();
