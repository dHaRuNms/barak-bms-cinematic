import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const width = Number(process.env.FILM_WIDTH || (process.argv.includes('--mobile') ? 720 : 1280));
const height = Number(process.env.FILM_HEIGHT || (process.argv.includes('--mobile') ? 1280 : 720));
const fps = Number(process.env.FILM_FPS || 24);
const duration = Number(process.env.FILM_DURATION || 24);
const portrait = height > width;
const name = (portrait ? 'bms-journey-mobile' : 'bms-journey') + ((process.env.FILM_PROOF || process.argv.includes('--proof')) ? '-proof' : '');
const count = (process.env.FILM_PROOF || process.argv.includes('--proof')) ? 8 : Math.round(duration * fps);
const output = `public/video/${name}.mp4`;
const directory = `tmp/${name}-render-v4-frames`;
const port = portrait ? 4176 : 4175;
const server = await createServer({server:{port,strictPort:true,host:'127.0.0.1',hmr:false},optimizeDeps:{noDiscovery:true,include:['react','react-dom/client','@react-three/fiber','@react-three/drei','@react-three/postprocessing','three']}});
server.middlewares.use((req,res,next)=>{if(req.url!=='/render-journey.html')return next();res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><title>Barak original film render</title></head><body style="margin:0;background:#070c0d"></body></html>');});
await server.listen();
const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome',args:['--no-sandbox','--enable-unsafe-swiftshader','--disable-web-security']});
try {
 await mkdir(directory,{recursive:true});await mkdir('public/video',{recursive:true});
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 page.on('pageerror',error=>console.error('Render error:',error.message));
 await page.goto(`http://127.0.0.1:${port}/render-journey.html`);
 await page.evaluate(async ({width,height,portrait})=>{
  const ReactModule=await import('/node_modules/.vite/deps/react.js'); const React=ReactModule.default || ReactModule;
  const ReactDOM=await import('/node_modules/.vite/deps/react-dom_client.js'); const createRoot=ReactDOM.createRoot || ReactDOM.default?.createRoot;
  
  const {default:World}=await import('/src/journey/World.tsx');
  const {DefaultLoadingManager}=await import('/node_modules/.vite/deps/three.js');
  const root=document.createElement('div');root.style.width=`${width}px`;root.style.height=`${height}px`;document.body.append(root);
  const progress={current:0},filmTime={current:0};
  window.renderState={ready:false,loaded:false,progress,filmTime};
  DefaultLoadingManager.onLoad=()=>{window.renderState.loaded=true;};
  createRoot(root).render(React.createElement(World,{progress,filmTime,film:true,mobile:portrait,paused:true,onReady:()=>{window.renderState.ready=true;},onError:()=>{throw new Error('WebGL render failed');},onLoadProgress:()=>{}}));
  window.renderJourneyFrame=async(p,time)=>{
   progress.current=p;filmTime.current=time;window.bmsFilmInvalidate();
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const actual=Number(document.querySelector('canvas').dataset.progress); if(Math.abs(actual-p)>.002) throw new Error(`Camera did not advance: wanted ${p}, got ${actual}`);
   return document.querySelector('canvas').toDataURL('image/jpeg',.96).split(',')[1];
  };
 },{width,height,portrait});
 await page.waitForFunction(()=>window.renderState?.ready && window.renderState.loaded,undefined,{timeout:90000});
 await page.waitForTimeout(1500);
 for(let index=0;index<count;index++) {
  const file=`${directory}/${String(index).padStart(5,'0')}.jpg`;
  const rangeArg=process.argv.find(arg=>arg.startsWith('--range='));
  const [rangeStart,rangeEnd]=rangeArg ? rangeArg.slice(8).split(':').map(Number) : [-1,-1];
  const inRange=rangeArg && index/(count-1)>=rangeStart && index/(count-1)<=rangeEnd;
  if (!process.argv.includes('--force') && !inRange) {try{await stat(file);continue;}catch{}}
  const data=await page.evaluate(({p,time})=>window.renderJourneyFrame(p,time),{p:index/(count-1),time:index/fps});
  await writeFile(file,Buffer.from(data,'base64'));
  if(index%fps===0)console.log(`${name}: ${index}/${count} frames (${Math.round(index/count*100)}%)`);
 }
 await new Promise((resolve,reject)=>{
  const encoder=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-framerate',String(fps),'-i',`${directory}/%05d.jpg`,'-vf','vignette=PI/5,eq=saturation=1.04:contrast=1.04','-c:v','libx264','-preset','slow','-crf','23','-g','12','-keyint_min','12','-sc_threshold','0','-pix_fmt','yuv420p','-movflags','+faststart','-an',output],{stdio:'inherit'});
  encoder.on('error',reject);encoder.on('exit',code=>code===0?resolve():reject(new Error(`Encoder failed ${code}`)));
 });
 const bytes=(await stat(output)).size;
 await writeFile(`${output}.provenance.json`,JSON.stringify({type:'Original rendered film',source:'src/journey/World.tsx + src/journey/models.ts + src/journey/timeline.ts',script:'scripts/render-journey-film.mjs',duration,fps,width,height,frames:count,bytes,camera:'One continuous deterministic camera path; no stock footage and no scene cuts',codec:'H.264 / yuv420p / keyframe interval 12 / faststart',created:new Date().toISOString()},null,2));
 console.log(`Complete: ${output} — ${(bytes/1048576).toFixed(2)} MB`);
}finally{await browser.close();await server.close();}
