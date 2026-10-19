import { useEffect, useRef, type RefObject } from 'react';

export const heroFilmUrl = `${import.meta.env.BASE_URL}video/battery-assembly-v2.mp4`;

/** Native video keeps the authored animation independent of the visitor's WebGL support. */
export function HeroFilm({ paused, onReady, onBlocked, onError, mediaRef }: {
  paused: boolean;
  onReady: (ready: boolean) => void;
  onBlocked: (blocked: boolean) => void;
  onError: (failed: boolean) => void;
  mediaRef: RefObject<HTMLVideoElement>;
}) {
  const syncRef = useRef<() => void>(() => {});
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; syncRef.current(); }, [paused]);
  useEffect(() => {
    const video = mediaRef.current;
    const section = video?.closest('section');
    if (!video || !section) return;
    let visible = false;
    let disposed = false;
    const sync = () => {
      if (disposed) return;
      if (pausedRef.current || !visible || document.hidden) { video.pause(); return; }
      if (!video.getAttribute('src')) video.src = heroFilmUrl;
      video.play().catch(error => {
        // A scroll/pause interrupt is expected, whereas autoplay denial needs a visible Play control.
        if (!disposed && error.name !== 'AbortError') onBlocked(true);
      });
    };
    syncRef.current = sync;
    const observer = new IntersectionObserver(entries => {
      const rect = section.getBoundingClientRect();
      visible = entries.some(entry => entry.isIntersecting) && rect.bottom > 0 && rect.top < innerHeight;
      sync();
    }, { threshold: .01 });
    observer.observe(section);
    document.addEventListener('visibilitychange', sync);
    return () => {
      disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', sync);
      syncRef.current = () => {}; video.pause(); video.removeAttribute('src'); video.load();
    };
  }, [onBlocked, mediaRef]);
  return <video ref={mediaRef} className="hero-film" muted loop playsInline preload="none" aria-hidden="true"
    onLoadedData={() => onReady(true)} onPlaying={() => { onReady(true); onError(false); }}
    onError={() => { onReady(false); onError(true); onBlocked(true); }} />;
}
