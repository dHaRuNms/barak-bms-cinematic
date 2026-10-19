import { useEffect, useRef, type MutableRefObject } from 'react';

export const journeyFilmUrl = (mobile: boolean) => `${import.meta.env.BASE_URL}video/${mobile ? 'bms-journey-mobile' : 'bms-journey'}.mp4`;

/** Deterministically rendered original film; scroll seeks a paused video rather than running WebGL. */
export default function JourneyFilm({ progress, mobile, paused, onReady, onError, onLoadProgress }: {
  progress: MutableRefObject<number>; mobile: boolean; paused: boolean;
  onReady: () => void; onError: () => void; onLoadProgress: (value: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const enabled = useRef(!paused);
  useEffect(() => { enabled.current = !paused; }, [paused]);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let raf = 0, disposed = false;
    const sync = () => {
      if (!disposed && enabled.current && !document.hidden && video.readyState >= 2 && Number.isFinite(video.duration)) {
        const target = Math.min(Math.max(0, video.duration - 1 / 24), Math.max(0, progress.current) * video.duration);
        if (!video.seeking && Math.abs(video.currentTime - target) >= 1 / 48) video.currentTime = target;
      }
      if (!disposed) raf = requestAnimationFrame(sync);
    };
    const loaded = () => { onLoadProgress(100); onReady(); };
    const buffer = () => {
      if (Number.isFinite(video.duration) && video.buffered.length) onLoadProgress(Math.min(99, Math.round(video.buffered.end(video.buffered.length - 1) / video.duration * 100)));
    };
    video.addEventListener('loadeddata', loaded);
    video.addEventListener('progress', buffer);
    video.addEventListener('error', onError);
    video.load(); raf = requestAnimationFrame(sync);
    return () => {
      disposed = true; cancelAnimationFrame(raf); video.pause();
      video.removeEventListener('loadeddata', loaded); video.removeEventListener('progress', buffer); video.removeEventListener('error', onError);
    };
  }, [mobile, onReady, onError, onLoadProgress, progress]);
  return <video ref={ref} className="journey-film" src={journeyFilmUrl(mobile)} muted playsInline preload="auto" aria-hidden="true" disablePictureInPicture controlsList="nodownload"/>;
}
