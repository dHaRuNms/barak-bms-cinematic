# Release verification

Verified against the pre-rendered production build served on port 4173.

## Automated checks

- `npm run build`: TypeScript and Vite production build pass; HTML pre-render completes without warnings.
- `CHROME_PATH=/usr/bin/google-chrome npm run test:e2e -- --workers=1`: original content checks and new motion lifecycle checks passed (17 passed, 1 intentionally skipped); two initial deep-link failures were fixed and both passed in the targeted rerun `--grep 'direct contact'`. Across these runs, all 19 applicable checks pass. The skipped case is the mobile-menu test in the desktop project.
- Axe WCAG 2.2 AA scan: zero reported violations in desktop and mobile initial states.
- Viewports checked for overflow: 320, 390, 768, 1024, 1440 pixels.
- All four solution disclosures, product-to-contact intent, required and whitespace-only form validation, prepared mailto contents, stale-draft invalidation, mobile Escape/focus behavior, and no-JavaScript content are exercised.
- Final screenshot check: no JavaScript page errors, broken initial images, or horizontal overflow at 1440 × 1000 and 390 × 844.
- Image provenance scan: 6 raster files, zero missing provenance records.
- Impeccable design hook: no deterministic issues reported.

## Visual review

Two batched desktop/mobile screenshot rounds. An independent Impeccable reviewer assessed the first round and requested two corrections: restore mobile heading whitespace and remove redundant preheading labels. Both were corrected. The reviewer returned **ship** for the subsequent verdict pass, confirming both findings resolved. That verdict is scoped to those findings.

Evidence lives under `.impeccable/review/`, including full pages, hero views, partnership crops, reference-site screenshots, and `browser-report.json`.

## Release scope

- Existing parent application and tracked files are unchanged.
- New implementation, dependencies, generated assets, docs, captures, and build all live inside `barak-production`.
- No deployment, GitHub push, or external message submission performed.
- Email is prepared locally and must be sent by the visitor through their email app.
- Set the actual `SITE_URL` at build time for canonical and social URLs and sitemap generation.
- Security header examples are supplied; the preview server does not apply hosting-specific header files.
- Browser automation used installed Chrome on Linux. Safari/Firefox and assistive technology were not manually tested; automated accessibility results are limited to checked states.

## Live animation upgrade

The hero now renders a procedural Three.js battery assembly with continuous layer separation, orientation changes, moving studio light, pointer response, and scroll response. Supporting SVG signals follow scroll progress and animate only while visible. The generated image remains the loading poster and static fallback.

Desktop and mobile checks exercise advancing animation time, pause/resume, offscreen suspension, hidden-tab suspension, reduced-motion changes with GPU disposal, initial reduced-motion rendering without a canvas, and unavailable WebGL. Direct Contact links land immediately without constructing an offscreen scene; scrolling back to the hero then initializes it. Content tests explicitly request reduced motion so GPU rendering does not obscure interaction failures.

Rendering has a 30 fps ceiling, capped pixel density, and adaptive resolution for slower devices. Browser automation uses software WebGL; these checks verify behavior, not hardware frame-rate performance. Real-device GPU performance remains a deployment validation item.

Final motion evidence is stored in `.impeccable/review/motion/`, including live/later frame pairs, paused views, diagrams, full pages, and `report.json`.

The fresh independent Impeccable motion reviewer returned **ship**, with no material fix requests. It reviewed all ten required screenshots, the browser report, design documents, and implementation. Both frame pairs visibly advance; paused timestamps remain fixed; captures report no browser errors or horizontal overflow. Two full-page capture artifacts were corrected by scrolling instantly to the top and waiting for lazy images to decode; these were capture-script corrections, not product changes. The reviewer did not independently rerun tests or certify physical-device frame pacing.

## Image sources

The hero was created with built-in imagegen; exact prompt and manifest are in this directory. Other imagery was copied and optimized from the user's existing project:

| New asset | Original source |
|---|---|
| `public/images/circuit-detail.webp` | `../public/assets/pcb-macro-hardware.jpg` |
| `public/images/simulation-workspace.webp` | `../public/assets/software-cad-monitor.jpg` |
| `public/images/connected-mobility.webp` | `../public/assets/smart-city-fleet-map.jpg` |

All are presented as concept visualizations rather than evidence of released products.
