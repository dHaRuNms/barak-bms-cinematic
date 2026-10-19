import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const materials = {
  pcb: new T.MeshStandardMaterial({ color: '#075b43', metalness: .38, roughness: .34 }),
  dark: new T.MeshStandardMaterial({ color: '#141a1e', roughness: .5, metalness: .25 }),
  gold: new T.MeshStandardMaterial({ color: '#cdb16b', metalness: .87, roughness: .25 }),
  silver: new T.MeshStandardMaterial({ color: '#a7b4b9', metalness: .9, roughness: .29 }),
  ceramic: new T.MeshStandardMaterial({ color: '#cfb89b', roughness: .5 }),
  trace: new T.MeshStandardMaterial({ color: '#488c68', metalness: .7, roughness: .5 }),
  white: new T.MeshStandardMaterial({ color: '#dbe9de', roughness: .5 }),
  cell: new T.MeshStandardMaterial({ color: '#426765', metalness: .78, roughness: .27 }),
  paint: new T.MeshPhysicalMaterial({ color: '#6d8c91', metalness: .72, roughness: .24, clearcoat: 1, clearcoatRoughness: .16 }),
  glass: new T.MeshPhysicalMaterial({ color: '#0c202a', metalness: .7, roughness: .13, clearcoat: 1 }),
  tire: new T.MeshStandardMaterial({ color: '#111416', roughness: .94 }),
  light: new T.MeshStandardMaterial({ color: '#bdfff0', emissive: '#78f7cc', emissiveIntensity: 2 }),
  red: new T.MeshStandardMaterial({ color: '#ed6853', emissive: '#c22c15', emissiveIntensity: .8 }),
};
type Mat = keyof typeof materials;
function box(g: T.Group, size: [number, number, number], pos: [number, number, number], mat: Mat, radius = 0) {
  const mesh = new T.Mesh(radius ? new RoundedBoxGeometry(...size, 2, radius) : new T.BoxGeometry(...size), materials[mat]);
  mesh.position.set(...pos); g.add(mesh); return mesh;
}
function cylinder(g: T.Group, radius: number, length: number, pos: [number, number, number], mat: Mat, segments = 16) {
  const m = new T.Mesh(new T.CylinderGeometry(radius, radius, length, segments), materials[mat]); m.position.set(...pos); g.add(m); return m;
}
// Merge static geometry by material: detailed PCB remains a small number of draw calls.
export function batch(g: T.Group) {
  g.updateMatrixWorld(true);
  const buckets = new Map<T.Material, T.BufferGeometry[]>();
  g.traverse(obj => { if (obj instanceof T.Mesh && !Array.isArray(obj.material)) {
    const geo = obj.geometry.clone().applyMatrix4(obj.matrixWorld);
    if (!geo.index) geo.setIndex(Array.from({ length: geo.attributes.position.count }, (_, i) => i));
    buckets.set(obj.material, [...(buckets.get(obj.material) || []), geo]);
  }});
  const result = new T.Group();
  buckets.forEach((geos, material) => { const geometry = mergeGeometries(geos); if (geometry) { const m = new T.Mesh(geometry, material); m.castShadow = true; m.receiveShadow = true; result.add(m); } geos.forEach(geo => geo.dispose()); });
  return result;
}
export function pcb() {
  const g = new T.Group();
  box(g, [4.5, .11, 2.9], [0, 0, 0], 'pcb', .08);
  for (const x of [-2.02, 2.02]) for (const z of [-1.2, 1.2]) { cylinder(g, .095, .02, [x, .065, z], 'gold'); cylinder(g, .05, .025, [x, .08, z], 'dark'); }
  box(g, [.72, .13, .72], [-.25, .12, -.1], 'dark', .025);
  for (let i = 0; i < 14; i++) for (const side of [-1, 1]) {
    box(g, [.025, .035, .14], [-.57 + i * .05, .085, -.1 + side * .41], 'silver');
    box(g, [.14, .035, .025], [-.25 + side * .41, .085, -.42 + i * .05], 'silver');
  }
  for (let i = 0; i < 4; i++) {
    box(g, [.44, .1, .28], [-1.55 + i * .87, .11, -.94], 'dark', .015);
    for (let j = 0; j < 8; j++) for (const s of [-1, 1]) box(g, [.026, .025, .1], [-1.73 + i * .87 + j * .05, .07, -.94 + s * .18], 'silver');
  }
  for (let i = 0; i < 6; i++) {
    box(g, [.3, .12, .37], [.82 + (i % 3) * .42, .13, -.25 + Math.floor(i / 3) * .58], 'dark');
    box(g, [.25, .015, .12], [.82 + (i % 3) * .42, .2, -.32 + Math.floor(i / 3) * .58], 'silver');
  }
  for (let i = 0; i < 46; i++) {
    const x = -1.87 + (i % 12) * .32, z = .67 + Math.floor(i / 12) * .14;
    box(g, [.17, .04, .07], [x, .085, z], i % 3 ? 'ceramic' : 'dark');
    for (const side of [-1, 1]) box(g, [.035, .045, .075], [x + side * .073, .085, z], 'silver');
  }
  for (let i = 0; i < 42; i++) {
    const x = -1.97 + (i % 21) * .19;
    box(g, [.012, .005, .23 + (i % 5) * .09], [x, .059, -.55 + Math.floor(i / 21) * 1.02], 'trace');
    box(g, [.17, .005, .013], [x + .08, .059, -.44 + Math.floor(i / 21) * 1.02], 'trace');
    cylinder(g, .022, .007, [x, .06, -.68 + Math.floor(i / 21) * 1.02], 'gold', 8);
  }
  for (let i = 0; i < 3; i++) { cylinder(g, .13, .23, [-1.73, .18, -.35 + i * .33], 'dark'); cylinder(g, .115, .01, [-1.73, .3, -.35 + i * .33], 'silver'); }
  box(g, [.22, .14, .44], [-1.12, .14, -.1], 'silver');
  box(g, [.12, .15, .32], [-1.12, .15, -.1], 'dark');
  box(g, [1.3, .26, .29], [.15, .18, 1.35], 'white', .025);
  for (let i = 0; i < 12; i++) box(g, [.042, .09, .15], [-.4 + i * .1, .18, 1.51], 'gold');
  box(g, [.35, .32, .73], [2.1, .21, .05], 'dark', .025);
  for (let i = 0; i < 3; i++) box(g, [.08, .14, .12], [2.28, .2, -.16 + i * .2], 'gold');
  for (let i = 0; i < 3; i++) box(g, [.06, .045, .09], [.9 + i * .22, .1, 1.13], i ? 'light' : 'red');
  return batch(g);
}
export function battery() {
  const g = new T.Group();
  box(g, [5.6, .25, 8.1], [0, -.85, 0], 'silver', .16);
  for (const x of [-2.75, 2.75]) box(g, [.12, .6, 8], [x, -.5, 0], 'silver');
  for (let row = 0; row < 6; row++) for (let col = 0; col < 4; col++) {
    const x = -2.04 + col * 1.36, z = -3.3 + row * 1.3;
    box(g, [1.23, .55, 1.14], [x, -.44, z], 'cell', .06);
    for (let line = 0; line < 6; line++) box(g, [.018, .006, 1.04], [x - .44 + line * .175, -.16, z], 'silver');
    box(g, [.13, .05, .25], [x - .4, -.12, z + .4], 'gold'); box(g, [.13, .05, .25], [x + .4, -.12, z - .4], 'gold');
  }
  for (let row = 0; row < 5; row++) box(g, [4.3, .035, .05], [0, -.09, -2.65 + row * 1.3], 'gold');
  return batch(g);
}
function wheels(g: T.Group, width: number, front: number, rear: number, r = .72) {
  for (const x of [-width / 2, width / 2]) for (const z of [front, rear]) {
    const tire = cylinder(g, r, .48, [x, -.43, z], 'tire', 32); tire.rotation.z = Math.PI / 2;
    const rim = cylinder(g, r * .72, .51, [x, -.43, z], 'silver', 24); rim.rotation.z = Math.PI / 2;
    const cap = cylinder(g, r * .4, .53, [x, -.43, z], 'dark', 16); cap.rotation.z = Math.PI / 2;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const spoke = box(g, [.54, .045, r * 1.25], [x, -.43, z], 'silver'); spoke.rotation.x = a; }
  }
}
export function chassis() {
  const g = new T.Group(); wheels(g, 6.2, -3.3, 3.25);
  for (const x of [-2.9, 2.9]) box(g, [.18, .27, 9.2], [x, -.54, 0], 'silver', .06);
  for (const z of [-3.3, 3.25]) { const axle = cylinder(g, .14, 6.2, [0, -.43, z], 'dark'); axle.rotation.z = Math.PI / 2; }
  box(g, [1.6, .75, 1.1], [0, -.1, -3.8], 'silver', .2);
  return batch(g);
}
export function carBody() {
  const g = new T.Group();
  const silhouette = new T.Shape();
  silhouette.moveTo(-4.9,-.3); silhouette.quadraticCurveTo(-4.95,.18,-4.5,.48); silhouette.quadraticCurveTo(-3.6,.68,-2.7,.72); silhouette.lineTo(2.7,.72); silhouette.quadraticCurveTo(4.1,.64,4.7,.36); silhouette.quadraticCurveTo(5,.15,4.9,-.3);
  silhouette.lineTo(4.18,-.3); silhouette.absarc(3.3,-.43,.9,.145,Math.PI-.145,false); silhouette.lineTo(-2.35,-.3); silhouette.absarc(-3.3,-.43,.9,.145,Math.PI-.145,false); silhouette.lineTo(-4.9,-.3); silhouette.closePath();
  const lowerBody = new T.Mesh(new T.ExtrudeGeometry(silhouette,{depth:5.3,steps:1,bevelEnabled:true,bevelSize:.17,bevelThickness:.17,bevelSegments:4,curveSegments:16}),materials.paint);
  lowerBody.rotation.y=Math.PI/2; lowerBody.position.x=-2.65; g.add(lowerBody);
  box(g, [4.9, .12, 2.65], [0, .63, 3], 'paint', .06);

  // Shaped cabin profile, extruded across vehicle width.
  const shape = new T.Shape(); shape.moveTo(-2.95, .4); shape.lineTo(-1.6, 1.7); shape.quadraticCurveTo(-1.3, 1.85, -.9, 1.85); shape.lineTo(.9, 1.82); shape.quadraticCurveTo(1.2, 1.8, 1.5, 1.52); shape.lineTo(2.7, .4); shape.closePath();
  const cabin = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: 4.65, bevelEnabled: true, bevelSize: .13, bevelThickness: .13, bevelSegments: 3, steps: 1 }), materials.glass);
  cabin.rotation.y = Math.PI / 2; cabin.position.x = -2.325; g.add(cabin);
  box(g, [4.35, .11, 2.05], [0, 1.85, -.1], 'paint', .06);
  for (const x of [-2.42, 2.42]) box(g, [.08, 1.16, .13], [x, 1.18, -.1], 'paint');
  for (const x of [-2.95, 2.95]) box(g, [.4, .19, .54], [x, 1, 1.3], 'paint', .07);
  for (const x of [-1.9, 1.9]) { box(g, [1.4, .1, .12], [x, .44, 4.86], 'light', .03); box(g, [1.45, .09, .1], [x, .47, -4.86], 'red', .02); }
  box(g, [3, .21, .08], [0, -.02, 4.91], 'dark');
  for (const x of [-2.93, 2.93]) for (const z of [-1.3, 1]) box(g, [.05, .05, .36], [x, .5, z], 'silver');
  return batch(g);
}
export function vehicle(kind: 'car' | 'bus' | 'truck' | 'bike' | 'rickshaw') {
  const g = new T.Group();
  if (kind === 'car') { g.add(carBody(), chassis()); return g; }
  if (kind === 'bus') {
    box(g, [5.6, 4.4, 14], [0, 1.3, 0], 'paint', .35); wheels(g, 5.6, -4.9, 4.5, .9);
    for (const x of [-2.82, 2.82]) for (let i = 0; i < 7; i++) box(g, [.03, 1.65, 1.56], [x, 2.2, -5.7 + i * 1.85], 'glass', .01);
    box(g, [4.9, 2.3, .04], [0, 1.9, 7.02], 'glass');
    for (const x of [-2.1, 2.1]) box(g, [.6, .16, .05], [x, .2, 7.05], 'light');
  } else if (kind === 'truck') {
    box(g, [5.8, 4.6, 10.5], [0, 1.5, -2.5], 'silver', .16);
    box(g, [5.6, 3.5, 4], [0, 1, 5], 'paint', .3); wheels(g, 5.7, -5, 5, .95); wheels(g, 5.7, -2.7, -2.7, .95);
    box(g, [5.1, 1.6, .06], [0, 1.8, 7.03], 'glass');
    for (const x of [-2.2, 2.2]) box(g, [.65, .15, .06], [x, .1, 7.05], 'light');
    for (let i = 0; i < 18; i++) for (const x of [-2.92, 2.92]) box(g, [.035, 4.3, .045], [x, 1.5, -7.4 + i * .57], 'dark');
  } else if (kind === 'bike') {
    for (const z of [-1.65, 1.65]) { const wheel = cylinder(g, .65, .25, [0, -.45, z], 'tire', 24); wheel.rotation.z = Math.PI / 2; const rim = cylinder(g, .44, .27, [0, -.45, z], 'silver'); rim.rotation.z = Math.PI / 2; }
    box(g, [.8, .65, 1.65], [0, .1, -.1], 'paint', .2); box(g, [.85, .18, 1.4], [0, .75, -.45], 'dark', .08);
    const fork = box(g, [.17, 1.7, .16], [0, .2, 1.3], 'silver'); fork.rotation.x = -.25;
    box(g, [1.3, .1, .12], [0, 1.1, 1], 'dark'); box(g, [.38, .3, .1], [0, .9, 1.5], 'light', .08);
  } else {
    box(g, [2.7, 1.7, 3.6], [0, .1, -.4], 'paint', .18); box(g, [2.7, .16, 3.8], [0, 2.1, -.2], 'dark', .12);
    for (const x of [-1.2, 1.2]) box(g, [.08, 1.7, .08], [x, 1.3, 1.3], 'silver');
    box(g, [2.4, 1.15, .06], [0, 1.35, 1.4], 'glass'); wheels(g, 2.9, -1.3, -1.3, .55);
    const tire = cylinder(g, .55, .3, [0, -.43, 1.8], 'tire'); tire.rotation.z = Math.PI / 2;
    box(g, [.4, .3, .1], [0, .3, 1.48], 'light');
  }
  return batch(g);
}
export function phone() {
  const g = new T.Group(); box(g, [2.5, 5.1, .22], [0, 0, 0], 'silver', .21); box(g, [2.41, 5.02, .235], [0, 0, .01], 'dark', .18);
  box(g, [.66, .12, .015], [0, 2.32, .14], 'dark', .05); box(g, [.04, .6, .08], [1.26, .9, 0], 'silver');
  return batch(g);
}
