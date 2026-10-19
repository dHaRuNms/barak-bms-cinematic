import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, useGLTF, Line, Detailed, PerformanceMonitor, useProgress } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, SSAO, Vignette } from '@react-three/postprocessing';
import * as T from 'three';
import { sampleTimeline, smooth } from './timeline';

export type WorldProps = { progress: MutableRefObject<number>; mobile: boolean; paused: boolean; onReady: () => void; onError: () => void; onLoadProgress: (n: number) => void; film?: boolean; filmTime?: MutableRefObject<number> };
const url = (name: string) => `${import.meta.env.BASE_URL}models/${name}.glb`;
function useModel(name: string) {
  const { scene } = useGLTF(url(name));
  return useMemo(() => { const copy = scene.clone(true); copy.traverse(o => { if (o instanceof T.Mesh) { o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone(); o.castShadow = true; o.receiveShadow = true; } }); return copy; }, [scene]);
}
function fade(object: T.Object3D, opacity: number) {
  object.visible = opacity > .005;
  object.traverse(o => { if (o instanceof T.Mesh) { const mats = Array.isArray(o.material) ? o.material : [o.material]; for (const m of mats) { m.transparent = opacity < .99; m.opacity = opacity; m.depthWrite = opacity > .95; } } });
}
function silkscreen() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 660;
  const x = c.getContext('2d')!; x.fillStyle = '#d5e8d3'; x.font = '24px monospace'; x.fillText('BARAK', 70, 75); x.font = '13px monospace'; x.fillText('BATTERY MANAGEMENT SYSTEM', 70, 100); x.fillText('CONCEPT · REV 01', 700, 75);
  x.font = '12px monospace'; [['MCU',455,330],['CELL MONITOR',120,140],['POWER STAGE',710,245],['SHUNT',230,300],['SENSE / 12P',440,540],['STATUS',710,545]].forEach(([s,a,b]) => x.fillText(String(s), Number(a), Number(b)));
  x.strokeStyle = '#d5e8d3'; x.lineWidth = 1.5; x.strokeRect(385, 230, 170, 165); x.strokeRect(650, 200, 270, 230);
  const texture = new T.CanvasTexture(c); texture.colorSpace = T.SRGBColorSpace; return texture;
}
function Board({ progress, paused, filmTime }: Pick<WorldProps, 'progress' | 'paused' | 'filmTime'>) {
  const model = useModel('pcb'), group = useRef<T.Group>(null), led = useRef<T.MeshStandardMaterial>(null);
  const texture = useMemo(silkscreen, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(({ clock }) => { const f = sampleTimeline(progress.current); if (!group.current) return; group.current.position.set(...f.board); group.current.scale.setScalar(f.boardScale); group.current.rotation.set(...f.boardRotation); const time = filmTime?.current ?? clock.elapsedTime; if ((!paused || filmTime) && progress.current < .15) group.current.rotation.y += Math.sin(time * .24) * .045; if (led.current) led.current.emissiveIntensity = paused && !filmTime ? 1 : 1.5 + Math.sin(time * 2) * .7; });
  return <group ref={group}><primitive object={model}/><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .061, 0]}><planeGeometry args={[4.5, 2.9]}/><meshBasicMaterial map={texture} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1}/></mesh><mesh position={[1.12, .13, 1.13]}><boxGeometry args={[.065, .025, .09]}/><meshStandardMaterial ref={led} color="#c1ffdf" emissive="#52ffb0" emissiveIntensity={2}/></mesh></group>;
}
function Cables({ progress }: Pick<WorldProps, 'progress'>) {
  const group = useRef<T.Group>(null), last = useRef(-1);
  const geometries = useMemo(() => Array.from({ length: 13 }, () => new T.BufferGeometry()), []);
  useEffect(() => () => geometries.forEach(g => g.dispose()), [geometries]);
  useFrame(() => {
    const p = progress.current, f = sampleTimeline(p);
    if (!group.current) return;
    group.current.visible = p > .16 && p < .63;
    if (!group.current.visible || Math.abs(p - last.current) < .001) return;
    last.current = p;
    const assembly = smooth((p - .26) / .18);
    for (let i = 0; i < 13; i++) {
      const start = new T.Vector3(-.4 + (i % 12) * .1, .18, 1.5).multiplyScalar(f.boardScale).applyEuler(new T.Euler(...f.boardRotation)).add(new T.Vector3(...f.board));
      const freeEnd = new T.Vector3(-2.1 + (i % 4) * 1.4, -.1, 4.7 - Math.floor(i / 4) * 1.3);
      const end = freeEnd.lerp(new T.Vector3(-2.04 + (i % 4) * 1.36, -.1, -3.3 + Math.floor(i / 4) * 1.3), assembly);
      const bend1 = start.clone().add(new T.Vector3(0, .1, .6));
      const bend2 = end.clone().add(new T.Vector3(.2, .3, .3));
      const curve = new T.CatmullRomCurve3([start, bend1, bend2, end]);
      let next: T.BufferGeometry;
      if (i === 12) {
        const shape = new T.Shape(); shape.moveTo(-.1,-.008);shape.lineTo(.1,-.008);shape.lineTo(.1,.008);shape.lineTo(-.1,.008);shape.closePath();
        next = new T.ExtrudeGeometry(shape,{steps:40,bevelEnabled:false,extrudePath:curve});
      } else next = new T.TubeGeometry(curve,40,.013,5,false);
      geometries[i].copy(next); next.dispose();
      const count = geometries[i].index?.count ?? geometries[i].attributes.position.count;
      geometries[i].setDrawRange(0,Math.floor(smooth((p-.16)/.11)*count/3)*3);
    }
  });
  return <group ref={group}>{geometries.map((geometry, i) => <mesh key={i} geometry={geometry}><meshStandardMaterial color={i === 12 ? '#b0bbbc' : i % 3 === 0 ? '#d87c66' : i % 3 === 1 ? '#c0c9bd' : '#263c3d'} roughness={.6} side={T.DoubleSide}/></mesh>)}</group>;
}
function Pack({ progress }: Pick<WorldProps, 'progress'>) {
  const model = useModel('pack'), inst = useRef<T.InstancedMesh>(null);
  const dummy = useMemo(() => new T.Object3D(), []);
  useFrame(() => { const p = progress.current, f = sampleTimeline(p); fade(model, f.pack); model.position.y = -1 + f.pack; if (inst.current) { inst.current.visible = p > .29 && p < .6; for (let i = 0; i < 24; i++) { dummy.position.set(-2.04 + (i % 4) * 1.36, -.15, -3.3 + Math.floor(i / 4) * 1.3); dummy.scale.set(1, smooth((p - .3 - i * .003) / .04), 1); dummy.updateMatrix(); inst.current.setMatrixAt(i, dummy.matrix); } inst.current.instanceMatrix.needsUpdate = true; } });
  return <><primitive object={model}/><instancedMesh ref={inst} args={[undefined, undefined, 24]}><boxGeometry args={[.9, .025, .025]}/><meshStandardMaterial color="#b8ffdc" emissive="#50ffc2" emissiveIntensity={1.5}/></instancedMesh></>;
}
function Vehicle({ progress }: Pick<WorldProps, 'progress'>) {
  const chassis = useModel('chassis'), body = useModel('car-body');
  useFrame(() => { const f = sampleTimeline(progress.current); fade(chassis, f.chassis); fade(body, f.body); body.position.y = (1 - f.body) * 2; });
  return <><primitive object={chassis}/><primitive object={body}/><Line points={[[0, -.08, 2], [0, -.08, -2.5], [0, .1, -3.7]]} color="#7cebd4" lineWidth={2} visible={progress.current > .46 && progress.current < .63}/></>;
}
function FleetVehicle({ kind, position, scale = 1 }: { kind: string; position: [number, number, number]; scale?: number }) {
  const model = useModel(kind);
  return <group position={position} scale={scale}><Detailed distances={[0, 90]}><primitive object={model}/><mesh position={[0, .5, 0]}><boxGeometry args={kind === 'bus' || kind === 'truck' ? [5.6, 3.5, 13] : [3, 1.5, 5]}/><meshStandardMaterial color="#6d8c91" metalness={.65} roughness={.3}/></mesh></Detailed><mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1, 1.05, 48]}/><meshBasicMaterial color="#70dfbe" transparent opacity={.6}/></mesh></group>;
}
function Fleet({ progress }: Pick<WorldProps, 'progress'>) {
  const group = useRef<T.Group>(null);
  useFrame(() => { if (group.current) { const f = sampleTimeline(progress.current); fade(group.current, f.fleet); group.current.position.y = (1 - f.fleet) * -3; } });
  return <group ref={group}><FleetVehicle kind="bus" position={[-8, 0, -4]} scale={.8}/><FleetVehicle kind="truck" position={[8, 0, -6]} scale={.8}/><FleetVehicle kind="bike" position={[7.5, 0, 5]}/><FleetVehicle kind="rickshaw" position={[-6, 0, 5]}/></group>;
}
function phoneScreen() {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 1024; const c = canvas.getContext('2d')!;
  c.fillStyle = '#0b171a'; c.fillRect(0, 0, 512, 1024); c.fillStyle = '#e8f5ef'; c.font = 'bold 32px sans-serif'; c.fillText('barak / connect', 36, 82); c.font = '19px sans-serif'; c.fillStyle = '#a5b8b4'; c.fillText('BATTERY OVERVIEW', 36, 150);
  c.lineWidth = 17; c.strokeStyle = '#243d3b'; c.beginPath(); c.arc(256, 340, 126, 0, Math.PI * 2); c.stroke(); c.strokeStyle = '#9cf6d0'; c.beginPath(); c.arc(256, 340, 126, -Math.PI / 2, Math.PI * 1.14); c.stroke(); c.fillStyle = '#edf9f5'; c.font = '76px sans-serif'; c.textAlign = 'center'; c.fillText('82%', 256, 357); c.font = '20px sans-serif'; c.fillStyle = '#aac2b9'; c.fillText('STATE OF CHARGE', 256, 397);
  c.textAlign = 'left'; c.font = '25px sans-serif'; c.fillText('Health', 36, 550); c.fillText('98.4%', 345, 550); c.fillText('Range', 36, 610); c.fillText('286 km', 330, 610); c.font = '18px sans-serif'; c.fillText('CHARGE HISTORY', 36, 710); c.strokeStyle = '#7ae2d0'; c.lineWidth = 4; c.beginPath(); for (let i = 0; i < 45; i++) { const x = 36 + i * 10, y = 860 - Math.sin(i * .13) * 37 - i * 1.3; if (!i) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); c.fillStyle = '#9cf6d0'; c.font = '19px sans-serif'; c.fillText('SIMULATED TELEMETRY', 36, 960);
  const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace; return texture;
}
function Phone({ progress }: Pick<WorldProps, 'progress'>) {
  const phone = useModel('phone'), group = useRef<T.Group>(null), texture = useMemo(phoneScreen, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(() => { const f = sampleTimeline(progress.current); if (group.current) { group.current.visible = f.phone > .001; group.current.scale.setScalar(Math.max(.001, f.phone)); group.current.rotation.y = (1 - f.phone) * -.8; } });
  return <group ref={group} position={[18, 3, 0]}><primitive object={phone}/><mesh position={[0, 0, .135]}><planeGeometry args={[2.22, 4.64]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh></group>;
}
function DataFlow({ progress, paused, filmTime }: Pick<WorldProps, 'progress' | 'paused' | 'filmTime'>) {
  const ref = useRef<T.InstancedMesh>(null);
  const dummy = useMemo(() => new T.Object3D(), []);
  const curves = useMemo(() => [-8, 0, 8].map(x => new T.CatmullRomCurve3([new T.Vector3(x, 0, -2), new T.Vector3(x + 4, 4, -3), new T.Vector3(13, 5, -1), new T.Vector3(18, 3, 0)])), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.visible = progress.current > .74 && progress.current < .94;
    for (let i = 0; i < 36; i++) {
      const t = (i / 12 + (filmTime ? filmTime.current * .12 : paused ? 0 : clock.elapsedTime * .12)) % 1;
      dummy.position.copy(curves[i % 3].getPoint(t)); dummy.scale.setScalar(.045); dummy.updateMatrix(); ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={ref} args={[undefined, undefined, 36]}><sphereGeometry args={[1, 6, 6]}/><meshBasicMaterial color="#9cf6e5"/></instancedMesh>;
}
function Later({ progress }: Pick<WorldProps, 'progress'>) { return <><Pack progress={progress}/><Vehicle progress={progress}/><Fleet progress={progress}/><Phone progress={progress}/></>; }
function Scene(props: WorldProps & { lowEffects: boolean }) {
  const { progress, mobile, paused, onReady, lowEffects, film, filmTime } = props;
  const { camera, gl, invalidate } = useThree(); const [later, setLater] = useState(!!film || progress.current > .15);
  const target = useMemo(() => new T.Vector3(), []); const ready = useRef(false);
  useEffect(() => { const timer = window.setTimeout(() => ['pack','chassis','car-body','bus','truck','bike','rickshaw','phone'].forEach(name => useGLTF.preload(url(name))), 500); return () => clearTimeout(timer); }, []);
  useEffect(() => { const update = () => invalidate(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, [invalidate]);
  useFrame(({ pointer }) => {
    const p = progress.current, f = sampleTimeline(p);
    if (!later && p > .12) setLater(true);
    camera.position.set(...f.camera); target.set(...f.target);
    if (mobile) { const phoneBlend = smooth((p - .76) / .14); const wide = 1.35 + smooth((p - .56) / .09) * .55; camera.position.multiplyScalar(1 + (wide - 1) * (1 - phoneBlend)); target.lerp(new T.Vector3(0, -.1, 0), 1 - phoneBlend); }
    if (!paused && !mobile) { camera.position.x += pointer.x * .08; camera.position.y += pointer.y * .06; }
    camera.lookAt(target); if (camera instanceof T.PerspectiveCamera) { camera.fov = f.fov + (mobile ? 6 : 0); camera.updateProjectionMatrix(); }
    gl.domElement.dataset.progress = p.toFixed(3);
    if (!ready.current) { ready.current = true; onReady(); }
  });
  return <><color attach="background" args={['#070c0d']}/><fog attach="fog" args={['#070c0d', 45, 125]}/><ambientLight intensity={.6}/><directionalLight position={[3, 10, 5]} intensity={3} color="#edf7f5" castShadow={!lowEffects} shadow-mapSize={[1024, 1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20}/><pointLight position={[-6, 3, -4]} color="#67ebcf" intensity={35}/><pointLight position={[8, 3, 3]} color="#93c7fa" intensity={30}/>
    <Environment resolution={mobile ? 64 : 128} frames={1}><Lightformer intensity={4} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 8, 1]}/><Lightformer intensity={3} color="#9bded3" position={[-8, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[10, 3, 1]}/><Lightformer intensity={2} position={[3, 3, 8]} scale={[12, 2, 1]}/></Environment>
    <Board progress={progress} paused={paused} filmTime={filmTime}/><DataFlow progress={progress} paused={paused} filmTime={filmTime}/><Cables progress={progress}/>{later && <Suspense fallback={null}><Later progress={progress}/></Suspense>}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.22, 0]} receiveShadow><planeGeometry args={[200, 200]}/><meshStandardMaterial color="#090f10" metalness={.3} roughness={.4}/></mesh>
    {!lowEffects && !film && <EffectComposer multisampling={0} enableNormalPass><SSAO worldDistanceThreshold={20} worldDistanceFalloff={5} worldProximityThreshold={.4} worldProximityFalloff={.1} radius={.15} intensity={8} luminanceInfluence={.8}/><Bloom luminanceThreshold={1.3} intensity={.25} mipmapBlur/><DepthOfField focusDistance={.02} focalLength={.08} bokehScale={.35} height={360}/><Vignette darkness={.35} offset={.3}/></EffectComposer>}
  </>;
}
function LoadingProgress({ onLoadProgress }: Pick<WorldProps, 'onLoadProgress'>) {
  const { progress } = useProgress();
  useEffect(() => onLoadProgress(progress), [progress, onLoadProgress]);
  return null;
}
export default function World(props: WorldProps) {
  const [lowEffects, setLowEffects] = useState(props.mobile || !!props.film);
  return <><LoadingProgress onLoadProgress={props.onLoadProgress}/><Canvas shadows={!lowEffects} dpr={props.film ? 1 : lowEffects ? 1 : [1, 1.5]} camera={{ position: [5, 7, 9], near: .05, far: 220, fov: 36 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, preserveDrawingBuffer: !!props.film }} frameloop={props.paused ? 'demand' : 'always'} onCreated={({ gl, invalidate }) => { if (props.film) (window as unknown as { bmsFilmInvalidate: () => void }).bmsFilmInvalidate = invalidate; gl.domElement.addEventListener('webglcontextlost', props.onError, { once: true }); gl.toneMapping = T.ACESFilmicToneMapping; }} fallback={<span>3D unavailable. Showing scene artwork.</span>}>{!props.film && <PerformanceMonitor bounds={() => [28, 55]} flipflops={1} onDecline={() => setLowEffects(true)} onFallback={() => setLowEffects(true)}/>}<Suspense fallback={null}><Scene {...props} lowEffects={lowEffects}/></Suspense></Canvas></>;
}
