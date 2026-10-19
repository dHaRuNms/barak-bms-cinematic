# Rendered BMS release verification

## Build and assets

`SITE_URL=https://dharunms.github.io/barak-bms-cinematic/ npm run build` passed. TypeScript passed. Both homepage and company page are pre-rendered. The company page includes its stylesheet in static HTML, including when JavaScript is disabled.

ffprobe confirmed:

| Film | Resolution | Duration | Frame rate | Frames | File size |
|---|---:|---:|---:|---:|---:|
| bms-journey.mp4 | 1280 × 720 | 24 s | 24 fps | 576 | 3,352,405 bytes |
| bms-journey-mobile.mp4 | 720 × 1280 | 24 s | 24 fps | 576 | 3,316,884 bytes |

All seven story fallback images are frames extracted from the original rendered landscape film. All ten authored GLB models and their reproducible source remain in the project. The main homepage uses video and requires no runtime WebGL.

## Browser checks

The final desktop/mobile run of `tests/journey.spec.ts` and `tests/site.spec.ts` finished with **23 passed and 1 intentionally skipped** desktop-only mobile-menu check. Coverage includes all scene images, reduced motion, module/cell selection, history periods, CSV download, alert acknowledgement, pause/resume, automated WCAG 2.2 AA checks, no-JavaScript content, media-error fallback, timeline boundary continuity, product disclosures and contact intent, mobile navigation, and email-draft validation.

The rendered-film capture run completed on desktop 1440×1000 and mobile 390×844. Both reported loaded video, no page errors, and no horizontal overflow. Camera/video seeking was checked at pack, fleet and phone progress positions. Evidence is stored under `.impeccable/review/journey/`.

## Boundaries

The films are original concept renders from authored geometry. They are not production CAD or a claim of photograph-equivalent automotive rendering. Telemetry is simulated and visibly labeled. Automated accessibility checks do not replace assistive-technology testing. The encoded 24 fps is not a physical-device performance certification.

## Publication

Target: new separate GitHub Pages website at https://dharunms.github.io/barak-bms-cinematic/ . Deployment publishes the reviewed `dist/` files to the existing gh-pages branch. Unrelated workspace documents are excluded. The published commit and live verification are recorded in the final response and local publication record after deployment completes.

The final mobile composition correction widened fleet framing and separated the phone screen from the HTML copy. The camera blending remains continuous. Desktop/mobile capture verification passed again after those changes.

The independent final visual verdict scored the mobile fleet framing, phone text separation, and media-boundary regression resolved (ship at the scope of those fixes). The scoped homepage design system is recorded in src/journey/DESIGN.md and src/journey/design-system.json.
