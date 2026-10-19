import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

// Render local procedural geometry at exact timestamps, never record a slow GPU in real time.
const server = await createServer({ server: { port: 4174, strictPort: true, host: '127.0.0.1', hmr: false }, optimizeDeps: { noDiscovery: true, include: ['three', 'three/addons/geometries/RoundedBoxGeometry.js', 'three/addons/environments/RoomEnvironment.js'] } });
server.middlewares.use((request, response, next) => {
  if (request.url !== '/render.html') return next();
  response.setHeader('Content-Type', 'text/html');
  response.end('<!doctype html><html><head><title>Offline film renderer</title></head><body style="margin:0"></body></html>');
});
await server.listen();
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  await mkdir('tmp/hero-frames', { recursive: true });
  await mkdir('public/video', { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 960 }, reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4174/render.html');
  await page.evaluate(async () => {
    const { createBatteryScene } = await import('/src/scene/batteryScene.ts');
    document.body.innerHTML = '<section style="width:1080px;height:960px"><div id="film" style="width:1080px;height:960px"></div></section>';
    window.film = createBatteryScene(document.querySelector('#film'), document.querySelector('section'), () => {}, () => {}, true);
  });
  for (let frame = 0; frame < 288; frame++) {
    const data = await page.evaluate(time => window.film.renderFilmFrame(time), frame / 24);
    await writeFile(`tmp/hero-frames/${String(frame).padStart(4, '0')}.png`, Buffer.from(data, 'base64'));
    if (frame % 24 === 0) console.log(`Rendered ${frame}/288 frames`);
  }
  await new Promise((resolve, reject) => {
    const encoder = spawn('ffmpeg', ['-y', '-v', 'error', '-framerate', '24', '-i', 'tmp/hero-frames/%04d.png', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', 'public/video/battery-assembly-v2.mp4'], { stdio: 'inherit' });
    encoder.on('error', reject); encoder.on('exit', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
  });
  console.log('Wrote public/video/battery-assembly-v2.mp4');
} finally { await browser.close(); await server.close(); }
