import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
// GLTFExporter uses FileReader in browsers. Node supplies Blob.arrayBuffer instead.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); }
  readAsDataURL(blob) { blob.arrayBuffer().then(result => { this.result = `data:${blob.type};base64,${Buffer.from(result).toString('base64')}`; this.onloadend?.(); }); }
};
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom' });
try {
  const m = await server.ssrLoadModule('/src/journey/models.ts');
  const models = { pcb: m.pcb(), pack: m.battery(), chassis: m.chassis(), 'car-body': m.carBody(), car: m.vehicle('car'), bus: m.vehicle('bus'), truck: m.vehicle('truck'), bike: m.vehicle('bike'), rickshaw: m.vehicle('rickshaw'), phone: m.phone() };
  await mkdir('public/models', { recursive: true });
  for (const [name, scene] of Object.entries(models)) {
    scene.name = `Barak_${name}`;
    const data = await new GLTFExporter().parseAsync(scene, { binary: true });
    await writeFile(`public/models/${name}.glb`, Buffer.from(data));
    console.log(`${name}.glb ${(data.byteLength / 1024).toFixed(1)} KB`);
  }
} finally { await server.close(); }
