import { spawn } from 'node:child_process';
import { mkdir,writeFile,readFile } from 'node:fs/promises';
const timing=[['board',0],['connection',.22],['pack',.38],['vehicle',.55],['fleet',.72],['phone',.86],['dashboard',.965]];
await mkdir('public/images/journey',{recursive:true});
for(const [name,progress] of timing){
 const time=progress*(24-1/24), output=`public/images/journey/${name}.webp`;
 await new Promise((resolve,reject)=>{const p=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-ss',String(time),'-i','public/video/bms-journey.mp4','-frames:v','1','-c:v','libwebp','-quality','88',output],{stdio:'inherit'});p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(new Error(`Frame export failed: ${name}`)));});
 await writeFile(`${output}.json`,JSON.stringify({origin:'Original rendered BMS journey film frame',source:'video/bms-journey.mp4',timeSeconds:time,renderSource:'src/journey/World.tsx + src/journey/models.ts + src/journey/timeline.ts',script:'scripts/extract-journey-stills.mjs',type:'Authored concept geometry; no stock images or footage'},null,2));
}
console.log('Extracted all seven fallback/loading stills from the original rendered film.');
