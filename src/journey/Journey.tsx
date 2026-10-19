import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Box, Image, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters, smooth } from './timeline';
import Dashboard from './Dashboard';
import './journey.css';
const JourneyFilm = lazy(() => import('./JourneyFilm'));
const images = ['board', 'connection', 'pack', 'vehicle', 'fleet', 'phone', 'dashboard'];
const asset = (i: number) => `${import.meta.env.BASE_URL}images/journey/${images[i]}.webp`;
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
const annotations = [
  ['Cell voltage monitoring', 'Individual measurements help reveal differences between cells.'],
  ['Temperature sensing', 'Thermal signals bring potential hotspots into view.'],
  ['Active balancing', 'A concept balancing stage redistributes energy between cells.'],
  ['Over-current protection', 'Current measurement supports fault detection and protective action.'],
];
function Callouts() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="board-callouts">{annotations.map(([title, body], i) => <div key={title}><button aria-expanded={open === i} aria-controls={`callout-${i}`} onClick={() => setOpen(open === i ? null : i)} onMouseEnter={() => setOpen(i)}><span className="callout-line"/>{title}<span className="callout-dot"/></button><p id={`callout-${i}`} hidden={open !== i}>{body}</p></div>)}</div>;
}
export default function Journey() {
  const story = useRef<HTMLElement>(null), progress = useRef(0);
  const [loadPercent, setLoadPercent] = useState(0), [sleeping, setSleeping] = useState(false);
  const [enhanced, setEnhanced] = useState(false), [mobile, setMobile] = useState(false), [ready, setReady] = useState(false), [failed, setFailed] = useState(false), [active, setActive] = useState(0), [percent, setPercent] = useState(0), [reduced, setReduced] = useState(false);
  const onError = useCallback(() => { setFailed(true); setEnhanced(false); }, []);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)'), small = matchMedia('(max-width: 760px)');
    const sync = () => { setReduced(mq.matches); setEnhanced(!mq.matches); setMobile(small.matches); };
    sync(); mq.addEventListener('change', sync); small.addEventListener('change', sync);
    return () => { mq.removeEventListener('change', sync); small.removeEventListener('change', sync); };
  }, []);
  useEffect(() => {
    let visible = true;
    const update = () => setSleeping(document.hidden || !visible);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (story.current) observer.observe(story.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  useEffect(() => {
    if (!enhanced || !story.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(progress, { current: 1, ease: 'none', scrollTrigger: { trigger: story.current, start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true }, onUpdate: () => { const p = progress.current; setPercent(Math.round(p * 100)); setActive(p >= 1 ? 6 : Math.max(0, chapters.findIndex(c => p >= c.start && p < c.end))); } });
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { clearTimeout(timer); tween.scrollTrigger?.kill(); tween.kill(); };
  }, [enhanced]);
  useEffect(() => { if (!enhanced || ready) return; const timeout = window.setTimeout(onError, 25000); return () => clearTimeout(timeout); }, [enhanced, ready, onError]);
  useEffect(() => { if (!location.hash) return; const timer = window.setTimeout(() => { try { document.querySelector(location.hash)?.scrollIntoView({ behavior: 'instant' }); } catch { /* Invalid hash */ } }, 150); return () => clearTimeout(timer); }, [enhanced]);
  const go = (i: number) => {
    if (!enhanced) { document.getElementById(`still-${chapters[i].id}`)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' }); return; }
    if (!story.current) return;
    const top = story.current.offsetTop + (story.current.offsetHeight - innerHeight) * (chapters[i].start + .025);
    window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
  };
  return <div className={`bms-site ${enhanced ? 'is-cinematic' : 'is-still'}`}>
    <a className="bms-skip" href="#dashboard">Skip to interactive dashboard</a>
    <header className="journey-header"><a className="journey-brand" href={import.meta.env.BASE_URL} aria-label="Barak Microelectronics home"><svg viewBox="0 0 32 36" width="27" height="31" fill="none" aria-hidden="true"><path d="M3 3h14c7 0 10 4 10 8 0 4-2 6-6 7 5 0 8 3 8 7 0 5-4 8-11 8H3V3Z M10 3v30 M10 11h8 M10 24h9" stroke="currentColor" strokeWidth="2.5"/></svg><span>barak<small>MICROELECTRONICS</small></span></a><nav aria-label="Main navigation"><a className="product-nav" href="#journey">Battery intelligence</a><a href="#dashboard">Dashboard</a><a className="nav-demo" href="company.html#contact">Request a demo <ArrowUpRight size={15}/></a></nav></header>
    <main><section className="journey-story" id="journey" ref={story} aria-label="From circuit board to connected mobility">
      {enhanced ? <div className="journey-stage">
        <img className={`journey-poster ${ready ? 'loaded' : ''}`} src={asset(active)} alt=""/>
        <div className={`journey-world ${ready ? 'loaded' : ''}`} style={{ "--phone-stage": smooth((progress.current - .77) / .08) } as React.CSSProperties} aria-hidden="true"><SceneBoundary onError={onError}><Suspense fallback={null}><JourneyFilm progress={progress} mobile={mobile} paused={sleeping} onReady={onReady} onError={onError} onLoadProgress={setLoadPercent}/></Suspense></SceneBoundary></div>
        <div className="journey-shade"/>
        <div className="scene-copy" data-scene={active}><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .3 }}>
          {active === 0 ? <h1>The brain of<br/>every battery<span>.</span></h1> : <h2>{chapters[active].title}</h2>}
          <p>{chapters[active].description}</p>
          {active === 0 && <a className="hero-discover" href="#dashboard">Explore the dashboard <ArrowUpRight size={16}/></a>}
          {active === 6 && <a className="journey-cta" href="#dashboard">Explore the dashboard <ArrowDown size={16}/></a>}
        </motion.div></AnimatePresence></div>
        {active === 1 && <Callouts/>}
        {active === 4 && <div className="fleet-labels">{['Car · 60 kWh', 'Bus · 350 kWh', 'Truck · 500 kWh', 'Bike · 3 kWh', 'Three-wheeler · 8 kWh'].map(label => <span key={label}>{label}</span>)}<small>Illustrative pack capacities</small></div>}
        {active === 0 && <div className="board-spec"><span className="status-dot"/>Battery Management System<span>Hardware concept · In development</span></div>}
        {!ready && <div className="scene-loader" role="status"><span className="loader-mark">b</span><span>Preparing the journey<small>{Math.round(loadPercent)}% · Loading rendered film</small></span><span className="loader-track"/></div>}
        <div className="journey-baseline"><button className="scroll-cue" onClick={() => go(Math.min(active + 1, 6))}><span><ArrowDown size={17}/></span>{active === 0 ? 'Scroll to explore' : 'Continue the story'}</button><span className="concept-caption">Original rendered BMS film</span><button className="view-toggle" onClick={() => setEnhanced(false)}><Image size={14}/>Still images</button></div>
        <nav className="chapter-nav" aria-label="Story chapters">{chapters.map((chapter, i) => <button key={chapter.id} aria-current={active === i ? 'step' : undefined} onClick={() => go(i)}><span className="chapter-number">0{i + 1}</span><span className="chapter-name">{chapter.name}</span><span className="chapter-track"><span style={{ width: `${Math.min(100, Math.max(0, (percent / 100 - chapter.start) / (chapter.end - chapter.start) * 100))}%` }}/></span></button>)}</nav>
      </div> : <div className="still-story">{chapters.map((chapter, i) => <section className="still-scene" id={`still-${chapter.id}`} key={chapter.id}><img src={asset(i)} alt={[ 'Original Barak BMS circuit board with green solder mask, MCU, monitoring chips, power stage and connectors.', 'Sense wires and ribbon cable connecting to a detailed circuit board.', 'Open battery pack with individual cell modules, busbars and a BMS.', 'Electric vehicle cutaway exposing its battery and chassis.', 'An electric car, bus, truck, motorcycle and three-wheeler.', 'Floating smartphone connected to the vehicle fleet.', 'Battery monitoring dashboard displayed on a smartphone.' ][i]} loading={i ? 'lazy' : 'eager'}/><div className="still-shade"/><div className="still-copy">{i === 0 ? <h1>{chapter.title}</h1> : <h2>{chapter.title}</h2>}<p>{chapter.description}</p>{i === 0 && <><a className="hero-discover" href="#dashboard">Explore the dashboard <ArrowUpRight size={16}/></a><p className="still-status">{failed ? 'Film unavailable. The complete story is available below.' : reduced ? 'Reduced motion · Still-image experience' : 'Original rendered BMS film'}</p><button className="view-toggle" onClick={() => { setFailed(false); setReady(false); setEnhanced(true); }}><Box size={15}/>{failed ? 'Retry rendered journey' : 'Play rendered journey'}</button></>}{i === 1 && <Callouts/>}</div></section>)}</div>}
    </section><Dashboard/></main>
    <footer className="journey-footer"><a className="footer-brand" href="#journey">barak<ArrowUpRight/></a><div><span>Intelligence, from cell to system.</span><nav aria-label="Footer navigation"><a href={`${import.meta.env.BASE_URL}video/bms-journey.mp4`} download>Download rendered film</a><a href="company.html">Company website</a><a href="company.html#contact">Contact</a><a href="#journey"><RotateCcw size={14}/>Replay the story</a></nav></div><p>© {new Date().getFullYear()} Barak Microelectronics. Engineered in India.</p><p className="development-note">BMS in development. All hardware and vehicles are original rendered concept designs. Dashboard data and capacities are simulated. Product performance, availability and integration scope require confirmation with Barak.</p></footer>
  </div>;
}
