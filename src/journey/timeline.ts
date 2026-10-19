export type Vec3 = [number, number, number];
export type Frame = { at: number; camera: Vec3; target: Vec3; fov: number; board: Vec3; boardScale: number; boardRotation: Vec3; pack: number; chassis: number; body: number; fleet: number; phone: number };
export type Chapter = { id: string; name: string; start: number; end: number; title: string; description: string; frames: Frame[] };
const base: Frame = { at: 0, camera: [5, 7, 9], target: [-1.6, 0, 0], fov: 36, board: [0, 0, 0], boardScale: 1, boardRotation: [0, 0, -.12], pack: 0, chassis: 0, body: 0, fleet: 0, phone: 0 };
const frame = (at: number, changes: Partial<Frame>): Frame => ({ ...base, at, ...changes });
// All scene timing and camera/object keyframes live here. Values use one common world space.
// Every boundary has a single keyframe; reversible interpolation cannot create a camera cut.
export const chapters: Chapter[] = [
  { id: 'board', name: 'The brain', start: 0, end: .15, title: 'The brain of every battery.', description: 'Meet the intelligence that connects every cell to everything it powers.', frames: [frame(0, {}), frame(.15, { camera: [3.2, 4.5, 5.4], target: [.2, 0, .6], boardRotation: [0, .16, 0] })] },
  { id: 'connection', name: 'The connection', start: .15, end: .3, title: 'Small signals.\nComplete understanding.', description: 'Voltage. Temperature. Current. A continuous conversation with every cell.', frames: [frame(.3, { camera: [7, 8, 11], target: [-1.4, -.3, 0], board: [0, .5, 0], boardScale: .6, pack: .55 })] },
  { id: 'pack', name: 'The pack', start: .3, end: .45, title: 'Every cell.\nMonitored. Balanced.\nProtected.', description: 'Individual measurements become a complete picture of the battery.', frames: [frame(.45, { camera: [10, 10, 15], target: [-1.5, -.5, 0], board: [0, .15, 1.8], boardScale: .32, pack: 1, chassis: .25 })] },
  { id: 'vehicle', name: 'The vehicle', start: .45, end: .6, title: 'Built into the heart\nof the vehicle.', description: 'Battery intelligence, connected to the systems that move us.', frames: [frame(.6, { camera: [13, 9, 17], target: [-1.8, 0, 0], board: [0, .15, 1.8], boardScale: .32, pack: 1, chassis: 1, body: 1 })] },
  { id: 'fleet', name: 'The fleet', start: .6, end: .78, title: 'One platform.\nEvery kind of EV.', description: 'From the everyday commute to the movement of a city. An adaptable vision for electric mobility.', frames: [frame(.7, { camera: [23, 22, 34], target: [1, 0, -2], boardScale: .32, board: [0, .15, 1.8], pack: 1, chassis: 1, body: 1, fleet: 1 }), frame(.78, { camera: [25, 18, 32], target: [3, 0, -2], boardScale: .32, board: [0, .15, 1.8], pack: 1, chassis: 1, body: 1, fleet: 1, phone: .3 })] },
  { id: 'phone', name: 'Your connection', start: .78, end: .9, title: 'A whole world of energy.\nIn your hands.', description: 'From physical signals to a clear view of battery health. Wherever you are.', frames: [frame(.9, { camera: [18, 5, 8], target: [18, 3, 0], fov: 32, boardScale: .32, board: [0, .15, 1.8], pack: 1, chassis: 1, body: 1, fleet: 1, phone: 1 })] },
  { id: 'dashboard-scene', name: 'The intelligence', start: .9, end: 1, title: 'Clarity. At every level.', description: 'Explore a working preview of the connected battery dashboard.', frames: [frame(1, { camera: [18, 3.4, 3.9], target: [18, 3.3, 0], fov: 30, boardScale: .32, board: [0, .15, 1.8], pack: 1, chassis: 1, body: 1, fleet: 1, phone: 1 })] },
];
export const frames = chapters.flatMap(chapter => chapter.frames);
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
export function sampleTimeline(progress: number): Frame {
  const next = frames.findIndex(f => f.at > progress);
  if (next === -1) return frames[frames.length - 1];
  if (next === 0) return frames[0];
  const a = frames[next - 1], b = frames[next], t = smooth((progress - a.at) / (b.at - a.at));
  const mix = (x: number, y: number) => x + (y - x) * t;
  const vector = (x: Vec3, y: Vec3): Vec3 => [mix(x[0], y[0]), mix(x[1], y[1]), mix(x[2], y[2])];
  return { at: progress, camera: vector(a.camera, b.camera), target: vector(a.target, b.target), fov: mix(a.fov, b.fov), board: vector(a.board, b.board), boardScale: mix(a.boardScale, b.boardScale), boardRotation: vector(a.boardRotation, b.boardRotation), pack: mix(a.pack, b.pack), chassis: mix(a.chassis, b.chassis), body: mix(a.body, b.body), fleet: mix(a.fleet, b.fleet), phone: mix(a.phone, b.phone) };
}
