# Barak — cinematic BMS journey

Complete React + TypeScript + Vite website. The homepage follows a BMS from circuit board, sense wires and battery pack through a vehicle and fleet to a phone and interactive dashboard. The existing company site is preserved at `company.html`.

## Run

Requires Node.js 20.19+ or 22+ and npm.

```sh
cd /home/dharun/Hermes_Agent/barak-production
npm ci
npm run dev
```

Open **http://localhost:4173/**. To serve the production build:

```sh
npm run build
npm run preview
```

The deployable site is in `dist/`. All runtime assets are local. No API key is needed. GitHub Pages deployment uses only the built website files.

## Included

- Seven-stage, approximately 800vh rendered-film story. React Three Fiber/drei provide the original render source; GSAP ScrollTrigger controls video seeking. Position, look-at rotation, FOV and object assembly share a continuous, reversible timeline.
- Ten original Meshopt-compressed GLBs; detailed PCB; drawn sense wires and ribbon; cell energy animation; chassis/body reveal; five vehicle classes; data particles and phone.
- PBR materials, procedural studio environment, rim lighting and encoded vignette. Desktop and portrait films are rendered at exact timestamps, then encoded as H.264 with frequent keyframes for responsive seeking. No runtime WebGL is needed.
- Seven WebP frames extracted from the original rendered film. Earlier generated concept artwork remains archived locally. Complete still-image, reduced-motion, no-JavaScript and WebGL-failure experiences.
- Real HTML dashboard: simulated SoC/SoH, voltage/current/power, temperatures, cell imbalance, history, range, cycles and alerts. Module/cell selection, history ranges, pause, local acknowledgement and CSV export work.
- Responsive overlays, keyboard controls, locally hosted fonts, pre-rendered HTML and preserved company content/contact flow.
- Request-demo opens the existing contact page. Its form prepares an email draft for the visitor to review and send; no automatic delivery is claimed.

## Edit

```text
src/journey/Journey.tsx    Page, loading, chapters and fallback
src/journey/World.tsx      R3F scene, lighting, animation and quality controls
src/journey/models.ts     Original geometry source for all ten GLBs
src/journey/timeline.ts   Single chapter/keyframe configuration
src/journey/Dashboard.tsx Interactive simulated telemetry
src/journey/journey.css   Responsive cinematic/dashboard styling
src/CompanyApp.tsx        Preserved company page and contact
public/models/           GLBs and compression manifest
public/images/journey/   Seven WebPs and provenance JSON
scripts/                 Model generation, compression, prerender and review
```

Regenerate models and render films:

```sh
npm run assets:models
npm run assets:film
npm run assets:film:mobile
node scripts/extract-journey-stills.mjs
npm run build
```

Verify against a running preview:

```sh
npx playwright install chromium
npm run test:e2e
# Or use installed Chrome:
CHROME_PATH=/usr/bin/google-chrome npm run test:e2e -- --workers=1
```

## Documentation

- [Detailed requirements and complete asset inventory](docs/requirements.md)
- [Timeline, scene and performance notes](docs/journey.md)
- [Image-generation prompts](docs/journey-image-prompts.md)
- [Verification evidence](docs/journey-verification.md)

No additional creative assets are needed to run the delivered site. Hardware and vehicles are original concept designs, not production CAD; telemetry is simulated. Exact hardware appearance, live telemetry and physical-device frame-rate certification are optional production integrations described in the requirements document.

## Deploy

Upload `dist/` contents to a static host, including both HTML files. Existing `deploy/nginx.conf` and `public/_headers` provide starter headers. Use the actual public domain to include canonical/social/sitemap metadata:

```sh
SITE_URL=https://your-domain.example/ npm run build
```

Relative assets support subpath hosting. Studio environment lighting and model decoders are local. Font licensing is in `public/fonts/OFL.txt`.

Technical references: [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/installation), [drei Environment](https://drei.docs.pmnd.rs/staging/environment), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
