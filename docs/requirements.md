# BMS website — requirements and complete asset inventory

## Requirements to run this deliverable

- Node.js 20.19+ or 22+ and npm.
- A modern browser with H.264 support enables the rendered-film journey. No runtime WebGL is required. Seven frames extracted from the film cover reduced motion, media failure and no-JavaScript viewing.
- Internet access for the initial `npm ci`. All runtime assets are local; no API key, subscription, model download or CDN is needed.
- `npm run dev` or `npm run preview` uses port 4173.
- Chrome / Playwright Chromium is needed only to run browser tests.
- ffmpeg is needed only to re-encode the included PNG source images.
- Blender is not required. The original Three.js scene is rendered offline as 576 frames and encoded into 24-second desktop and portrait H.264 films.

No additional creative assets are required. Every requested stage has authored assets and working code. Barak branding and simulated telemetry were explicitly confirmed by the user.

## Assets supplied

| Stage | Files / implementation | Included detail |
|---|---|---|
| PCB | `pcb.glb`, `board.webp`, canvas silkscreen | Green solder mask, MCU pins, monitoring ICs, MOSFETs, resistors, shunt, capacitors, connectors, gold pads, traces, pulsing LEDs |
| Connection | `connection.webp`, procedural harness | Twelve sense wires, flat ribbon cable, reversible draw-on and four interactive HTML annotations |
| Battery pack | `pack.glb`, `pack.webp` | Aluminium tray, 24 cell modules, busbars, mounted PCB, sequential instanced energy indicators |
| Vehicle | `chassis.glb`, `car-body.glb`, `car.glb`, `vehicle.webp` | Wheels, axles, motor, frame, body with wheel openings, metallic paint, glazing, lights, energy connection |
| Fleet | `bus.glb`, `truck.glb`, `bike.glb`, `rickshaw.glb`, `fleet.webp` | All five vehicle classes including the primary car, distance LOD, battery indicators and illustrative capacities |
| Phone | `phone.glb`, `phone.webp`, canvas screen | Metal frame, detailed screen, animated rotation/scale, instanced fleet-to-phone data particles |
| Dashboard | `dashboard.webp`, `Dashboard.tsx` | Real HTML SoC, SoH, voltage/current/power, module temperature, cell voltage/imbalance, history, range, alerts and cycle count |

Ten GLBs are generated from `src/journey/models.ts` and optimized using Meshopt. Seven shipping WebPs are extracted directly from the rendered film with frame provenance. Earlier generated concept images and prompts are archived in `docs/assets/` and `docs/journey-image-prompts.md` and are not the homepage visual. Runtime canvas textures provide the PCB silkscreen and phone screen. Lighting uses an original procedural studio environment; no external HDRI is needed.

## Working dashboard controls

- Count-up on entry, simulated voltage/current/power updates and pause/resume.
- Four selectable modules, 24 selectable cells per module, module 1 imbalance highlight.
- 24h / 7d / 30d history data and pointer inspection.
- CSV export for the selected module.
- Local alert acknowledgement that does not imply the condition is resolved.
- Request-demo CTA into the preserved company contact page, which prepares an email draft for the visitor to review and send.

## Optional requirements for production hardware integration

These are **not blockers for running the delivered website**:

1. **Approved product facts:** product revision, chemistry, cell counts, balancing method, electrical/thermal limits, availability and substantiated certifications. The demo does not invent validation claims.
2. **Exact hardware identity, if wanted:** PCB STEP/glTF or KiCad export, dimensions, connector mapping, sense-wire routing, pack/module mechanical drawings and mounting position. These replace supplied concept assets; there are no empty asset slots.
3. **Live telemetry contract:** HTTPS/WebSocket endpoint, authentication, vehicle/module/cell IDs, units, sample frequency, timestamps, stale/offline behavior, fault schema and retention. Secrets belong on a server, never in client Vite variables.
4. **Fleet facts:** approved vehicle types, real capacities, and trademark/model permissions if replacing the original unbranded fleet.
5. **Contact delivery:** retain the email draft, or supply a CRM/form endpoint, routing and spam protection if automatic delivery is desired.
6. **Deployment:** real domain, static host, HTTPS, Brotli/gzip, cache policy and `SITE_URL` for canonical/social/sitemap metadata. The user requested publishing to the existing GitHub Pages site.
7. **Analytics/privacy, if desired:** provider, consent policy, retention and approved privacy text. No analytics are installed.
8. **Performance acceptance devices:** actual desktop and mid-range mobile devices and browser versions for 60 fps / 30+ fps certification. Headless browser verification is not physical-device frame-rate certification.

## Replacement / optimization contract

Y-up coordinates; common world space. All camera and assembly timings are in `src/journey/timeline.ts`. Keep model filenames or update `url()` in `World.tsx`. Preserve separate chassis/body geometry for the reveal. Export glTF metallic/roughness PBR, merge static materials and use Meshopt compression. Future texture maps should use WebP/KTX2; current models do not require large bitmap textures. Keep every static fallback image.

Retest framing, scale, transparency, shadows, occlusion, mobile typography, keyboard access, load weight and contact behavior after changing geometry or data.

## Visual/data boundaries

The generated still artwork is photorealistic concept imagery. The real-time GLBs are optimized procedural concept models, not production CAD or a claim of photograph-equivalent automotive rendering. The two asset sets interpret the same concept rather than matching part-for-part. All telemetry and capacities are simulated, labeled, and disconnected from real hardware. Every stage and its fallback is supplied.
