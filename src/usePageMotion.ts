import { useEffect } from 'react';

/** Scroll acts on the diagram's explanatory sequence, never on content visibility. */
export function usePageMotion() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.querySelector<HTMLElement>('.page-shell');
    const diagram = document.querySelector<HTMLElement>('.intelligence-diagram');
    const intro = document.querySelector<HTMLElement>('.introduction');
    if (!root || !diagram || !intro) return;
    let frame = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    function update() {
      frame = 0;
      if (!root || !diagram || !intro) return;
      root.dataset.reducedMotion = String(preference.matches);
      root.dataset.documentHidden = String(document.hidden);
      if (document.hidden) return;
      if (root.classList.contains('is-motion-paused') && !preference.matches) return;
      const rect = diagram.getBoundingClientRect();
      const progress = preference.matches ? 1 : clamp((window.innerHeight * .9 - rect.top) / Math.min(rect.height, window.innerHeight * .65));
      diagram.style.setProperty('--signal-progress', String(progress));
      const introRect = intro.getBoundingClientRect();
      intro.style.setProperty('--intro-progress', String(preference.matches ? 1 : clamp((window.innerHeight - introRect.top) / (window.innerHeight * .75))));
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) (entry.target as HTMLElement).dataset.motionActive = String(entry.isIntersecting);
      schedule();
    });
    observer.observe(diagram);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', update);
    preference.addEventListener('change', schedule);
    update();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', update); preference.removeEventListener('change', schedule);
    };
  }, []);
}
