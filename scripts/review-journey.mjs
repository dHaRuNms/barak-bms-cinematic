import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
await mkdir('.impeccable/review/journey', { recursive: true });
const report = [];
for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844]]) {
 const page = await browser.newPage({viewport:{width,height}, reducedMotion:'no-preference'});
 page.setDefaultTimeout(60000);
 const errors = []; page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await page.locator('.journey-world.loaded').waitFor({timeout:40000}).catch(async()=>console.log('Playback diagnostics',await page.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,video:document.querySelector('video')?{ready:document.querySelector('video').readyState,network:document.querySelector('video').networkState,error:document.querySelector('video').error?.message,src:document.querySelector('video').src}:null,body:document.body.innerText.slice(0,250)}))));
 await page.waitForTimeout(1500);
 await page.screenshot({path:`.impeccable/review/journey/${name}.png`});
 for (const [stage,progress] of [['pack',.4],['fleet',.72],['phone',.89]]) {
  await page.evaluate(p=>{const s=document.querySelector('.journey-story');window.scrollTo({top:(s.offsetHeight-innerHeight)*p,behavior:'instant'});},progress);
  await page.waitForFunction(p => {const video=document.querySelector('.journey-film');return video && Number.isFinite(video.duration) && Math.abs(video.currentTime/video.duration-p)<.012;}, progress, {timeout:60000});
  await page.waitForTimeout(1000);
  await page.screenshot({path:`.impeccable/review/journey/${name}-${stage}.png`});
 }
 await page.evaluate(() => { const el=document.querySelector('.dashboard');window.scrollTo({top:el.getBoundingClientRect().top+scrollY-20,behavior:'instant'}); }); await page.waitForTimeout(1800);
 await page.screenshot({path:`.impeccable/review/journey/${name}-dashboard.png`});
 report.push({name, errors, info:await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,ready:!!document.querySelector('.journey-world.loaded'), film:!!document.querySelector('.journey-film'),filmTime:document.querySelector('.journey-film')?.currentTime, resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').pop(),size:r.encodedBodySize})),scene:document.querySelector('.scene-copy')?.getAttribute('data-scene')}))});
 await page.close();
}
await writeFile('.impeccable/review/journey/browser-report.json',JSON.stringify(report,null,2)); console.log(JSON.stringify(report.map(({name,errors,info})=>({name,errors,overflow:info.overflow,ready:info.ready})),null,2));await browser.close();
