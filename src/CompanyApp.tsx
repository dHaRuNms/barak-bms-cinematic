import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, ArrowDown, Plus, Minus, Menu, X, Pause, Play, Check, Copy, Send } from 'lucide-react';
import { audiences, email, principles, solutions } from './content';
import { HeroFilm, heroFilmUrl } from './HeroFilm';
import { usePageMotion } from './usePageMotion';

const asset = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;

function Mark({ className = '' }: { className?: string }) {
  return <svg className={className} width="34" height="38" viewBox="0 0 34 38" fill="none" aria-hidden="true"><path d="M3 3h15c7 0 11 4 11 9 0 4-2 6-5 7 5 1 7 4 7 8 0 6-5 9-12 9H3V3Z" stroke="currentColor" strokeWidth="3"/><path d="M10 11h8c2 0 4 1 4 3s-2 3-4 3h-8m0 7h9c3 0 5 1 5 3s-2 3-5 3h-9" stroke="currentColor" strokeWidth="3"/><path d="M10 3v33" stroke="currentColor" strokeWidth="3"/></svg>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  const links = [['Solutions', '#solutions'], ['Our approach', '#approach'], ['Company', '#company']];
  return <header className="site-header">
    <div className="nav-wrap">
      <a className="brand" href="#home" aria-label="Barak Microelectronics home" onClick={() => setOpen(false)}><Mark/><span>barak<span className="brand-sub">MICROELECTRONICS</span></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
      <a className="nav-contact" href="#contact">Let’s talk <ArrowUpRight size={17}/></a>
      <button ref={toggleRef} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{[...links, ['Start a conversation', '#contact']].map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={20}/></a>)}</nav>
  </header>;
}

function Hero({ paused, setPaused }: { paused: boolean; setPaused: (value: boolean) => void }) {
  const [sceneReady, setSceneReady] = useState(false);
  const [filmError, setFilmError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const filmRef = useRef<HTMLVideoElement>(null);
  function toggleFilm() {
    if (filmError) { setFilmError(false); setAttempt(value => value + 1); setPaused(false); return; }
    if (!paused) { filmRef.current?.pause(); setPaused(true); return; }
    // Start within the click's user activation for browsers that disallow autoplay.
    const video = filmRef.current;
    if (video) {
      if (!video.getAttribute('src')) video.src = heroFilmUrl;
      video.play().catch(error => { if (error.name !== 'AbortError') setPaused(true); });
    }
    setPaused(false);
  }
  return <section className={`hero ${paused ? 'is-paused' : ''}`} data-scene-ready={sceneReady} id="home" aria-labelledby="hero-heading">
    <picture className="hero-art"><source srcSet={`${asset('hero-engineering-960.webp')} 960w, ${asset('hero-engineering.webp')} 1920w`} sizes="100vw"/><img src={asset('hero-engineering.webp')} width="1920" height="1080" alt="" {...{ fetchpriority: "high" }}/></picture>
    <HeroFilm key={attempt} mediaRef={filmRef} paused={paused} onReady={setSceneReady} onBlocked={setPaused} onError={setFilmError}/>
    <div className="hero-shade"/>
    <div className="hero-content container">
      <h1 id="hero-heading">The intelligence<br className="desktop-break"/> layer for a more<br className="desktop-break"/> capable<br className="desktop-break"/> <span>electric future.</span></h1>
      <p>Barak Microelectronics develops intelligent battery systems, engineering software, and connected mobility platforms for organizations building the next generation of physical products.</p>
      <div className="hero-actions"><a className="button button-accent" href="#solutions">Explore our solutions <ArrowUpRight size={19}/></a><a className="text-link" href="#contact">Start a conversation <ArrowUpRight size={17}/></a></div>
    </div>
    <div className="hero-baseline container"><a href="#introduction" className="scroll-link"><span className="round-icon"><ArrowDown size={17}/></span>Discover what connects us</a><div className="art-caption"><span>Engineering concept visualization</span><button className="motion-toggle" aria-pressed={!paused} onClick={toggleFilm}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{filmError ? 'Retry animation' : paused ? 'Play animation' : 'Pause animation'}</span></button></div></div>
  </section>;
}

function Introduction() {
  return <section className="introduction container" id="introduction" aria-labelledby="intro-heading">
    <div className="section-rule" aria-hidden="true"/>
    <div className="intro-layout"><h2 id="intro-heading">Complex engineering.<br/><span className="muted">Clearer possibilities.</span></h2><div className="intro-copy"><p>We develop intelligent systems at the intersection of energy, electronics, software, and mobility.</p><p>Our promise: convert complex engineering challenges into safer, more dependable, and deployment-ready technology.</p></div></div>
    <div className="trust-strip"><p><span className="small-cross" aria-hidden="true"/>Engineered for demanding energy<br/>and mobility environments</p><p><span className="small-cross" aria-hidden="true"/>Designed around safety, reliability,<br/>and scalable deployment</p><p><span className="small-cross" aria-hidden="true"/>Connecting physical systems with<br/>actionable software intelligence</p></div>
  </section>;
}

function Solutions({ onInterest }: { onInterest: (interest: string) => void }) {
  const [active, setActive] = useState('battery');
  const current = solutions.find(item => item.id === active) ?? solutions[0];
  return <section className="solutions section-pad" id="solutions" aria-labelledby="solutions-heading">
    <div className="container">
      <div className="section-heading"><h2 id="solutions-heading">Engineering the systems<br/>behind what comes next.</h2><p>A connected portfolio.<br/>Built around real engineering challenges.</p></div>
      <div className="solutions-layout">
        <div className="solution-list">{solutions.map(solution => <details key={solution.id} className="solution-item" name="solutions" open={active === solution.id} onToggle={event => { if (event.currentTarget.open) setActive(solution.id); }}>
          <summary><span>{solution.name}</span><Plus className="expand-icon" size={20}/><Minus className="collapse-icon" size={20}/></summary>
          <div className="solution-content">
            {solution.status && <span className="status-label"><span/>{solution.status}</span>}
            <h3>{solution.title}</h3><p>{solution.description}</p><p>{solution.detail}</p>
            <ul className="benefit-list">{solution.benefits.map(benefit => <li key={benefit}><Check size={14}/><span>{benefit}</span></li>)}</ul>
            {solution.audience && <p className="best-for"><strong>Built with these teams in mind</strong>{solution.audience}</p>}
            <a className="text-link accent-link" href="#contact" onClick={() => onInterest(solution.name)}>Discuss this solution <ArrowUpRight size={17}/></a>
          </div>
        </details>)}</div>
        <div className="solution-visual"><figure key={current.id}>
          <img src={asset(current.image)} width="1200" height="900" loading="lazy" alt={current.alt} className={current.id === 'battery' ? 'battery-image' : ''}/>
          <figcaption><span>{current.discipline}</span><span>Concept visualization</span></figcaption>
        </figure><div className="portfolio-note"><span className="small-cross" aria-hidden="true"/><p>From the cell to the system.<br/>From engineering intent to real-world operation.</p></div></div>
      </div>
    </div>
  </section>;
}

function Intelligence() {
  return <section className="intelligence container section-pad" id="approach" aria-labelledby="intelligence-heading">
    <div className="section-rule" aria-hidden="true"/>
    <div className="intelligence-layout"><div><h2 id="intelligence-heading">Applied intelligence.<br/><span className="muted">Human judgment.</span></h2><p className="lead">AI should reduce friction without removing human judgment.</p><p>Barak is developing AI-assisted products that help teams interpret information, respond faster, automate repeatable workflows, and make more informed operational decisions.</p><p>Our AI work spans engineering assistance, customer and operations workflows, diagnostics, and connected product experiences. The principle is straightforward: deliver useful augmentation while keeping accountability and control with the people operating the system.</p></div>
      <div className="intelligence-diagram" role="img" aria-label="Physical systems feed signals into applied intelligence. People guide decisions and keep accountability and control.">
        <div className="signal-inputs"><span>Physical systems</span><div><i/><i/><i/><i/><i/><i/><i/></div><span>Signals · Context · Conditions</span></div>
        <svg className="signal-lines" viewBox="0 0 480 180" fill="none" aria-hidden="true"><path d="M30 0v35c0 40 210 15 210 70v75M100 0v25c0 40 140 20 140 80M170 0v15c0 50 70 40 70 90M240 0v180M310 0v15c0 50-70 40-70 90M380 0v25c0 40-140 20-140 80M450 0v35c0 40-210 15-210 70" stroke="currentColor"/><path className="signal-progress" pathLength="1" d="M100 0v25c0 40 140 20 140 80v75M380 0v25c0 40-140 20-140 80" stroke="var(--accent)"/><path className="signal-highlight" pathLength="1" d="M100 0v25c0 40 140 20 140 80v75M380 0v25c0 40-140 20-140 80" stroke="var(--text)"/></svg>
        <div className="intelligence-core"><Mark/><span>Applied intelligence</span></div>
        <div className="human-connection"><span/><ArrowDown size={17}/></div><div className="human-label">People guide the decisions<span>Accountability stays human.</span></div>
      </div>
    </div>
  </section>;
}

function Audience({ onInterest }: { onInterest: (interest: string) => void }) {
  return <section className="audience section-pad" aria-labelledby="audience-heading"><div className="container audience-layout"><div><h2 id="audience-heading">Technology for teams<br/>advancing critical work.</h2><p>The challenges are different.<br/>The need for dependable intelligence is shared.</p></div><div className="audience-list">{audiences.map(([title, body]) => <a href="#contact" key={title} onClick={() => onInterest('Partnerships')}><div><h3>{title}</h3><p>{body}</p></div><ArrowUpRight size={21}/></a>)}</div></div></section>;
}

function Company() {
  return <section className="company container section-pad" id="company" aria-labelledby="company-heading">
    <div className="section-rule" aria-hidden="true"/>
    <div className="company-layout"><div className="company-heading"><h2 id="company-heading">Ambitious technology.<br/><span className="muted">Practical outcomes.</span></h2><div className="company-symbol" aria-hidden="true"><Mark/><span>Energy.<br/>Electronics.<br/>Mobility.</span></div></div>
      <div className="company-copy"><p className="lead">Barak Microelectronics is an India-based technology company developing the systems infrastructure behind next-generation mobility and intelligent hardware.</p><p>We operate across energy management, electronics engineering, artificial intelligence, and connected operations. Our objective is to help manufacturers, engineering teams, and fleet operators identify risk earlier, accelerate technical decisions, and deliver products with greater confidence.</p><p>We are building a product portfolio rather than a single-purpose solution: intelligent battery management, battery emulation and simulation, AI-assisted engineering workflows, and software infrastructure for modern mobility networks.</p>
        <div className="purpose-list"><details><summary>Our mission<Plus size={18}/></summary><p>To make advanced energy and electronics technology more accessible, dependable, and effective in real operating environments.</p></details><details><summary>Our vision<Plus size={18}/></summary><p>A future in which batteries, electronic systems, and vehicles are designed with greater technical clarity, operated with greater confidence, and continuously improved through intelligent software.</p></details></div>
      </div>
    </div>
    <div className="principles-layout"><div><h3>Deeply technical.<br/>Commercially focused.</h3><p>Barak combines hardware discipline with software velocity. We focus on consequential engineering problems, design for the conditions in which products actually operate, and build solutions that can mature from an initial deployment into a dependable, extensible platform.</p></div><div className="principles-list">{principles.map(([title, body], i) => <details key={title} open={i === 0}><summary>{title}<Plus size={18}/></summary><p>{body}</p></details>)}</div></div>
  </section>;
}

function Contact({ interest, setInterest }: { interest: string; setInterest: (interest: string) => void }) {
  const [draft, setDraft] = useState<{ href: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const draftRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => { if (draft) draftRef.current?.focus(); }, [draft]);
  useEffect(() => { setDraft(null); setCopied(false); setCopyError(false); }, [interest]);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const reply = String(data.get('email') ?? '').trim();
    const organization = String(data.get('organization') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const nameInput = event.currentTarget.elements.namedItem('name') as HTMLInputElement;
    const messageInput = event.currentTarget.elements.namedItem('message') as HTMLTextAreaElement;
    nameInput.setCustomValidity(name ? '' : 'Please enter your name.');
    messageInput.setCustomValidity(message.length >= 10 ? '' : 'Please describe your project in at least 10 characters.');
    if (!event.currentTarget.reportValidity()) return;
    const text = `Hello Barak,\n\n${message}\n\nName: ${name}\nEmail: ${reply}\nOrganization: ${organization || 'Not provided'}\nInterested in: ${interest}`;
    setDraft({ href: `mailto:${email}?subject=${encodeURIComponent(`Let's talk: ${interest}`)}&body=${encodeURIComponent(text)}`, text });
    setCopied(false); setCopyError(false);
  }
  async function copyDraft() {
    if (!draft) return;
    try { await navigator.clipboard.writeText(draft.text); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  return <>
    <section className="partnership" aria-labelledby="partnership-heading"><div className="container"><div className="partnership-top"><ArrowUpRight size={52} strokeWidth={1}/></div><h2 id="partnership-heading">Build the next layer<br/>{' '}of intelligent infrastructure.</h2><div className="partnership-bottom"><p>We welcome conversations with vehicle manufacturers, battery companies, fleet operators, engineering teams, research institutions, manufacturing partners, and investors who share our interest in practical deep technology.</p><a className="button button-dark" href="#contact" onClick={() => setInterest('Partnerships')}>Partner with Barak <ArrowUpRight size={18}/></a></div></div></section>
    <section className="contact container section-pad" id="contact" aria-labelledby="contact-heading"><div className="contact-intro"><h2 id="contact-heading">Tell us what<br/>you are building.</h2><p>Whether you are evaluating a pilot, seeking an engineering partner, or investing in the future of intelligent hardware, we want to understand the system you are building and the constraints that matter most.</p><a className="email-link" href={`mailto:${email}`}>{email}<ArrowUpRight size={18}/></a><span className="contact-location">Based in Tamil Nadu, India</span></div>
      <form onSubmit={prepare} className="contact-form" onInput={event => { const input = event.target; if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) input.setCustomValidity(''); }} onChange={() => { if (draft) setDraft(null); }}>
        <div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Alex Kumar" required maxLength={100}/></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254}/></label></div>
        <div className="form-row"><label>Organization <span className="optional">(optional)</span><input name="organization" autoComplete="organization" placeholder="Company or institution" maxLength={160}/></label><label>I’m interested in<select name="interest" value={interest} onChange={event => setInterest(event.target.value)}>{['Partnerships', ...solutions.map(solution => solution.name), 'Pilot opportunities', 'Investment', 'General conversation'].map(option => <option key={option}>{option}</option>)}</select></label></div>
        <label>What are you working on?<textarea name="message" rows={4} placeholder="Tell us about your project, your goals, and the challenges that matter." required minLength={10} maxLength={4000}/></label>
        <div className="form-footer"><p>Prepare a draft to review and send<br/>from your email app.</p><button className="button button-accent" type="submit">Prepare email <ArrowUpRight size={18}/></button></div>
        {draft && <div className="draft-result"><p role="status">Your draft is ready. Open it in your email app to review and send.</p><div className="draft-actions"><a ref={draftRef} className="text-link accent-link" href={draft.href}>Open email draft <Send size={16}/></a><button type="button" className="text-link" onClick={copyDraft}>{copied ? 'Message copied' : 'Copy message'}{copied ? <Check size={16}/> : <Copy size={16}/>}</button></div>{copyError && <label className="copy-fallback">Select and copy your message below:<textarea readOnly value={draft.text} rows={8} onFocus={event => event.target.select()}/></label>}</div>}
      </form>
    </section>
  </>;
}

function Footer() {
  return <footer className="footer container"><div className="footer-top"><p>Intelligent systems for energy,<br/>electronics, and mobility.</p><a href="#home" className="text-link">Back to top <ArrowUpRight size={17}/></a></div><div className="footer-wordmark" aria-hidden="true">barak<ArrowUpRight/></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Barak Microelectronics</span><nav aria-label="Footer navigation"><a href="#solutions">Solutions</a><a href="#company">Company</a><a href="#contact">Contact</a></nav><span>Engineered in India.</span></div><p className="disclaimer">Product names and descriptions marked as in development represent Barak Microelectronics’ current product direction and may evolve as development and validation progress. Product availability, certifications, performance characteristics, and integration scope should be confirmed directly with Barak Microelectronics.</p></footer>;
}

export default function App() {
  const [interest, setInterest] = useState('Partnerships');
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPaused(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    // Initial deep links should land immediately, before optional GPU work starts.
    // Smooth scrolling is reserved for navigation after the page has loaded.
    try {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      target?.scrollIntoView({ behavior: 'instant' });
    } catch { /* An invalid URL fragment has no navigation target. */ }
  }, []);
  usePageMotion();
  return <div className={`page-shell ${paused ? 'is-motion-paused' : ''}`}><a href="#main" className="skip-link">Skip to content</a><Header/><main id="main"><Hero paused={paused} setPaused={setPaused}/><Introduction/><Solutions onInterest={setInterest}/><Intelligence/><Audience onInterest={setInterest}/><Company/><Contact interest={interest} setInterest={setInterest}/></main><Footer/></div>;
}
