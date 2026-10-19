import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type BatteryScene = { setPaused: (paused: boolean) => void; renderFilmFrame: (time: number) => string; dispose: () => void };

/** Illustrative, locally constructed geometry. No real product dimensions or telemetry. */
export function createBatteryScene(host: HTMLDivElement, section: HTMLElement, ready: () => void, failed: () => void, film = false): BatteryScene {
  const mobile = () => window.innerWidth <= 760;
  const renderer = new THREE.WebGLRenderer({ alpha: !film, antialias: true, preserveDrawingBuffer: film, powerPreference: 'low-power' });
  renderer.setClearColor(0x101110, film ? 1 : 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile() ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.shadowMap.enabled = !mobile();
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 4, -4, .1, 80);
  camera.position.set(8.5, 8.2, 12);
  camera.lookAt(0, 1.9, 0);
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, .06);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = .85;
  environment.dispose();
  pmrem.dispose();

  const warm = new THREE.DirectionalLight(0xffbc73, 4.5);
  warm.position.set(3, 6, -5);
  const key = new THREE.DirectionalLight(0xe4ecf2, 3.5);
  key.position.set(-5, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 7, bottom: -5, near: .5, far: 30 });
  key.shadow.normalBias = .04;
  key.shadow.bias = -.0002;
  const rim = new THREE.DirectionalLight(0xff9d43, 3);
  rim.position.set(6, 2, 3);
  scene.add(warm, key, rim, new THREE.HemisphereLight(0xd8b894, 0x151817, 1.3));

  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const textures: THREE.Texture[] = [];
  function material(parameters: THREE.MeshStandardMaterialParameters) {
    const value = new THREE.MeshStandardMaterial(parameters);
    materials.push(value);
    return value;
  }
  const graphite = material({ color: 0x222623, roughness: .24, metalness: .9 });
  const rubber = material({ color: 0x080b0a, roughness: .72, metalness: .15 });
  const aluminum = material({ color: 0x9daba7, roughness: .23, metalness: 1 });
  const copper = material({ color: 0xb97840, roughness: .28, metalness: 1 });
  const solder = material({ color: 0xddd3b7, roughness: .35, metalness: .9 });
  const silicon = material({ color: 0x202622, roughness: .53, metalness: .4 });
  const signal = material({ color: 0xf2bb74, emissive: 0xed8e26, emissiveIntensity: 1.3, roughness: .4, metalness: .5 });
  const unitBox = new RoundedBoxGeometry(1, 1, 1, 2, .055);
  geometries.push(unitBox);
  const simpleBox = new THREE.BoxGeometry(1, 1, 1);
  geometries.push(simpleBox);
  const assembly = new THREE.Group();
  const housing = new THREE.Group();
  const cells = new THREE.Group();
  const board = new THREE.Group();
  const cover = new THREE.Group();
  assembly.add(housing, cells, board, cover);
  scene.add(assembly);

  type Placement = [number, number, number, number, number, number];
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  function instances(parent: THREE.Group, geometry: THREE.BufferGeometry, mat: THREE.Material, placements: Placement[]) {
    const mesh = new THREE.InstancedMesh(geometry, mat, placements.length);
    placements.forEach(([x, y, z, sx, sy, sz], index) => {
      matrix.compose(position.set(x, y, z), quaternion, scale.set(sx, sy, sz));
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    parent.add(mesh);
    return mesh;
  }
  function box(parent: THREE.Group, mat: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number) {
    const mesh = new THREE.Mesh(unitBox, mat);
    mesh.position.set(x, y, z); mesh.scale.set(w, h, d); parent.add(mesh);
    return mesh;
  }

  // Machined enclosure, perimeter channels and mounting tabs.
  box(housing, graphite, 0, -.05, 0, 6.8, .24, 4.1);
  box(housing, rubber, 0, .095, 0, 6.45, .08, 3.78);
  for (const z of [-1.96, 1.96]) {
    box(housing, graphite, 0, .24, z, 6.8, .54, .17);
    box(housing, aluminum, 0, .5, z, 6.65, .025, .18);
  }
  for (const x of [-3.3, 3.3]) box(housing, graphite, x, .24, 0, .18, .54, 4.1);
  const ribs: Placement[] = [];
  for (let i = 0; i < 15; i++) for (const z of [-2.065, 2.065]) ribs.push([-3.05 + i * .436, .25, z, .09, .47, .055]);
  instances(housing, simpleBox, graphite, ribs);
  for (const x of [-3.48, 3.48]) for (const z of [-1.65, 1.65]) box(housing, graphite, x, .06, z, .38, .17, .5);
  box(housing, rubber, -3.43, .27, 0, .3, .32, .8);
  box(housing, copper, -3.61, .27, -.2, .12, .17, .17);
  box(housing, copper, -3.61, .27, .2, .12, .17, .17);

  // 84 cell cans share geometry and draw calls. Fine rings and terminals catch light.
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 32);
  geometries.push(cylinder);
  const canPositions: Placement[] = [], capPositions: Placement[] = [], terminalPositions: Placement[] = [], collars: Placement[] = [];
  for (let row = 0; row < 7; row++) for (let col = 0; col < 12; col++) {
    const x = (col - 5.5) * .505;
    const z = (row - 3) * .5;
    canPositions.push([x, .65, z, .218, 1.25, .218]);
    capPositions.push([x, 1.29, z, .207, .038, .207]);
    terminalPositions.push([x, 1.325, z, .091, .03, .091]);
    collars.push([x, 1.245, z, .226, .06, .226]);
  }
  instances(cells, cylinder, aluminum, canPositions);
  instances(cells, cylinder, graphite, collars);
  instances(cells, cylinder, copper, capPositions);
  instances(cells, cylinder, solder, terminalPositions);
  box(cells, graphite, 0, -.015, 0, 6.45, .09, 3.7);
  for (const z of [-1.82, 1.82]) box(cells, copper, 0, 1.21, z, 6.38, .11, .085);
  for (const x of [-3.17, 3.17]) box(cells, copper, x, .62, 0, .09, 1.35, 3.7);
  const busbars: Placement[] = [];
  for (let i = 0; i < 12; i++) busbars.push([(i - 5.5) * .505, 1.345, 0, .11, .035, 3.21]);
  instances(cells, simpleBox, copper, busbars);

  // Trace artwork is deterministic circuit geometry painted into a local GPU texture.
  const artwork = document.createElement('canvas'); artwork.width = 2048; artwork.height = 1024;
  const ctx = artwork.getContext('2d')!;
  ctx.fillStyle = '#17251c'; ctx.fillRect(0, 0, 2048, 1024);
  ctx.lineWidth = 2.5;
  for (let side = 0; side < 4; side++) {
    ctx.save(); ctx.translate(1024, 512); ctx.rotate(side * Math.PI / 2);
    for (let lane = 0; lane < 23; lane++) {
      const x = (lane - 11) * 15;
      const reach = 220 + (lane % 6) * 39;
      ctx.strokeStyle = lane % 5 === 0 ? '#b58b47' : '#496347';
      ctx.beginPath(); ctx.moveTo(x, 140); ctx.lineTo(x, 180 + Math.abs(lane - 11) * 4);
      ctx.lineTo(x + (lane - 11) * 13, 250); ctx.lineTo(x + (lane - 11) * 13, reach); ctx.stroke();
      ctx.fillStyle = '#cfb777'; ctx.beginPath(); ctx.arc(x + (lane - 11) * 13, reach, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  ctx.strokeStyle = '#b29b69'; ctx.lineWidth = 3; ctx.strokeRect(24, 24, 2000, 976);
  const boardTexture = new THREE.CanvasTexture(artwork); boardTexture.colorSpace = THREE.SRGBColorSpace; textures.push(boardTexture);
  const boardMat = material({ map: boardTexture, roughness: .45, metalness: .45 });
  box(board, graphite, 0, 0, 0, 6.45, .105, 3.72);
  const boardPlane = new THREE.PlaneGeometry(6.4, 3.68); geometries.push(boardPlane);
  const pcb = new THREE.Mesh(boardPlane, boardMat); pcb.rotation.x = -Math.PI / 2; pcb.position.y = .058; board.add(pcb);
  box(board, silicon, -.15, .17, 0, 1.23, .2, 1.05);
  box(board, graphite, -.15, .29, 0, .93, .045, .78);
  const chips: Placement[] = [], pins: Placement[] = [], resistors: Placement[] = [];
  for (const x of [-2.1, -1.35, 1.3, 2.15]) for (const z of [-1.1, 1.1]) {
    chips.push([x, .15, z, .54, .16, .4]);
    for (let i = 0; i < 7; i++) for (const sign of [-1, 1]) pins.push([x + (i - 3) * .066, .11, z + sign * .25, .026, .03, .12]);
  }
  for (let i = 0; i < 22; i++) for (const side of [-1, 1]) pins.push([-.15 + (i - 10.5) * .05, .115, side * .57, .018, .027, .16]);
  for (let i = 0; i < 50; i++) {
    const x = ((i * 17) % 43) / 7.5 - 2.8;
    const z = ((i * 13) % 29) / 10 - 1.4;
    if (Math.abs(x) > .8 || Math.abs(z) > .7) resistors.push([x, .11, z, .11, .075, .055]);
  }
  instances(board, unitBox, silicon, chips);
  instances(board, simpleBox, solder, pins);
  instances(board, simpleBox, solder, resistors);
  for (const x of [-2.8, 2.8]) {
    for (let i = 0; i < 6; i++) {
      const cap = new THREE.Mesh(cylinder, graphite); cap.scale.set(.12, .31, .12); cap.position.set(x, .22, (i - 2.5) * .44); board.add(cap);
    }
  }
  for (const z of [-1.65, 1.65]) box(board, rubber, 0, .2, z, 1.95, .25, .24);
  const leds: Placement[] = [];
  for (let i = 0; i < 5; i++) leds.push([2.2 + i * .12, .11, 1.45, .055, .06, .07]);
  instances(board, simpleBox, signal, leds);

  // Fin array and copper seam, with visible precision fastening hardware.
  box(cover, graphite, 0, 0, 0, 6.8, .16, 4.1);
  box(cover, copper, 0, -.095, 0, 6.7, .025, 4);
  const fins: Placement[] = [];
  for (let i = 0; i < 43; i++) fins.push([(i - 21) * .149, .24, 0, .045, .42, 3.82]);
  instances(cover, simpleBox, graphite, fins);
  for (const x of [-3.2, 3.2]) for (const z of [-1.84, 1.84]) {
    const screw = new THREE.Mesh(cylinder, aluminum); screw.scale.set(.06, .27, .06); screw.position.set(x, .15, z); cover.add(screw);
    const head = new THREE.Mesh(cylinder, graphite); head.scale.set(.105, .06, .105); head.position.set(x, .31, z); cover.add(head);
    box(cover, aluminum, x, .345, z, .1, .008, .017);
    const standoff = new THREE.Mesh(cylinder, copper); standoff.scale.set(.055, .28, .055); standoff.position.set(x * .96, -.11, z * .95); board.add(standoff);
  }
  assembly.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; } });

  let disposed = false, paused = film, visible = true, contextLost = false;
  let frame = 0, lastTime = 0, elapsed = 0, rendered = false;
  let quality = 1, sampleCount = 0, sampleDuration = 0;
  let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
  let scroll = 0;
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(film ? 1 : Math.min(window.devicePixelRatio, mobile() ? 1.25 : 1.5) * quality);
    renderer.shadowMap.enabled = !film && !mobile() && quality === 1;
    renderer.setSize(width, height);
    const half = film ? 4.25 : mobile() ? 3.8 : 3.7;
    const aspect = width / height;
    camera.left = -half * aspect; camera.right = half * aspect; camera.top = half; camera.bottom = -half;
    camera.clearViewOffset();
    if (!film && !mobile()) camera.setViewOffset(width, height, -width * .245, -height * .025, width, height);
    camera.updateProjectionMatrix();
    if (paused) draw();
  }
  function onScroll() { const rect = section.getBoundingClientRect(); scroll = Math.max(0, Math.min(1, -rect.top / rect.height)); }
  function onPointer(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;
    const rect = section.getBoundingClientRect();
    pointerX = (event.clientX / rect.width - .5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
  }
  function resetPointer() { pointerX = 0; pointerY = 0; }
  function draw() {
    const separation = .55 + .43 * Math.sin(elapsed * .45);
    smoothX += (pointerX - smoothX) * .035;
    smoothY += (pointerY - smoothY) * .035;
    assembly.rotation.y = -.25 + Math.sin(elapsed * .19) * .27 + smoothX * .09 + scroll * .3;
    assembly.rotation.x = Math.sin(elapsed * .13) * .035 + smoothY * .025;
    assembly.position.y = -.2 + Math.sin(elapsed * .4) * .07 - scroll * .3;
    cells.position.y = .6 + separation * .2;
    board.position.y = 2.02 + separation * .85 + scroll * .35;
    cover.position.y = 2.65 + separation * 1.65 + scroll * .6;
    warm.position.x = 3 + Math.sin(elapsed * .28) * 4;
    rim.intensity = 2.7 + Math.sin(elapsed * .5) * .5;
    signal.emissiveIntensity = 1.1 + Math.sin(elapsed * 1.8) * .45;
    if (film) {
      // A seamless 12-second authored assembly cycle for inexpensive native video playback.
      const phase = elapsed / 12 * Math.PI * 2;
      const opening = (1 - Math.cos(phase)) / 2;
      assembly.rotation.set(.025 * Math.sin(phase), -.3 + .42 * Math.sin(phase), 0);
      assembly.position.y = -.3;
      cells.position.y = .55 + opening * .25;
      board.position.y = 1.95 + opening * .85;
      cover.position.y = 2.35 + opening * 1.9;
      warm.position.x = 3 + Math.sin(phase) * 4;
      rim.intensity = 2.7 + Math.sin(phase) * .5;
      signal.emissiveIntensity = 1.1 + Math.sin(phase * 2) * .45;
    }
    renderer.render(scene, camera);
    canvas.dataset.time = elapsed.toFixed(3);
    if (!rendered) { rendered = true; ready(); }
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || paused || !visible || document.hidden || contextLost) return;
    if (!lastTime) lastTime = now;
    const delta = now - lastTime;
    // A cinematic 30 fps ceiling avoids spending GPU time on imperceptible frames.
    if (delta > 0 && delta < 1000 / 30) { frame = requestAnimationFrame(tick); return; }
    elapsed += Math.min(delta / 1000, .25); lastTime = now;
    if (delta > 0 && quality > .6) {
      sampleDuration += delta; sampleCount++;
      if (sampleCount >= 16) {
        if (sampleDuration / sampleCount > 60) {
          quality = quality === 1 ? .75 : .6;
          resize();
        }
        sampleCount = 0; sampleDuration = 0;
      }
    }
    draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastTime = 0;
    const running = !disposed && !paused && visible && !document.hidden && !contextLost;
    canvas.dataset.running = String(running);
    if (running) frame = requestAnimationFrame(tick);
  }
  function lost(event: Event) { event.preventDefault(); contextLost = true; sync(); failed(); }
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .01 });
  observer.observe(section);
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  section.addEventListener('pointermove', onPointer, { passive: true });
  section.addEventListener('pointerleave', resetPointer);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', sync);
  canvas.addEventListener('webglcontextlost', lost);
  resize(); onScroll(); draw(); sync();

  return {
    setPaused(value) { paused = value; sync(); },
    renderFilmFrame(time) { paused = true; sync(); elapsed = time; draw(); return canvas.toDataURL('image/png').split(',')[1]; },
    dispose() {
      disposed = true; sync(); observer.disconnect(); resizeObserver.disconnect();
      section.removeEventListener('pointermove', onPointer); section.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', sync); canvas.removeEventListener('webglcontextlost', lost);
      assembly.traverse(object => { if (object instanceof THREE.InstancedMesh) object.dispose(); });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(mat => mat.dispose()); textures.forEach(texture => texture.dispose());
      key.shadow.dispose(); environmentTarget.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
