# BMS rendered journey

## Main experience

The main website uses an original 24-second rendered film. It is exported from the authored Three.js/R3F scene, not assembled from stock footage or a slideshow. Desktop and portrait versions share the same camera timeline. Scroll progress controls the paused video's `currentTime`, and GSAP supplies a 0.65-second scrub. Headers, story copy, annotations and navigation remain real HTML. The final dashboard is interactive HTML.

The retained source geometry supplies all stages: populated PCB, sense wires and ribbon, pack cells and tray, chassis and motor, car body, bus, truck, motorcycle, three-wheeler and phone. Materials, environment light, encoded vignette and data particles are baked into the desktop film. Portrait has its own camera framing.

## Files

- `src/journey/timeline.ts`: single array of chapters/keyframes, normalized 0–1.
- `src/journey/models.ts`: original geometry source.
- `src/journey/World.tsx`: retained render source, with deterministic frame invalidation.
- `scripts/render-journey-film.mjs`: renders exactly 576 frames at 24 fps, then encodes H.264 with faststart and a 12-frame keyframe interval for seeking.
- `public/video/bms-journey.mp4`: landscape film.
- `public/video/bms-journey-mobile.mp4`: portrait film.
- `src/journey/JourneyFilm.tsx`: scroll-controlled video component.
- `public/images/journey/`: still frames extracted from the film for loading, reduced motion and media failure.

## Regenerate

```sh
npm run assets:film
npm run assets:film:mobile
```

Chrome and ffmpeg must be installed. `--proof` renders eight representative frames for scene inspection. `--force` replaces cached frames. Environment variables `FILM_WIDTH`, `FILM_HEIGHT`, `FILM_DURATION` and `FILM_FPS` override export settings. Every encoded film includes a provenance JSON file.

Rendering advances the source scene at exact timestamps and checks the rendered camera progress before capturing each frame. It does not record slow GPU playback. Frame caches live under ignored `tmp/` so an interrupted export can resume.

## Accessibility and runtime

Reduced-motion visitors receive the complete seven-stage still-frame story with the working dashboard. Media errors restore that same story and expose Retry. A still-image control is available throughout the film. No WebGL or model decoding is required by the published homepage. The video remains paused and seeks on scroll; the runtime does not depend on autoplay permission. Hidden/offscreen state suspends seeking.

The film's encoded frame rate is 24 fps. Live browser frame-rate targets from the initial real-time proposal are not guarantees about physical devices. Mobile has its own portrait file; all film assets are local. Dashboard updates are simulated and explicitly labeled.
