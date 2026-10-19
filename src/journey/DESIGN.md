---
name: Barak BMS journey
description: A rendered battery intelligence story and interactive simulated telemetry.
colors:
  signal: "#9cf6d0"
  ground: "#070c0d"
  text: "#e9f1ed"
  muted: "#9dafab"
  rule: "#2b3b3b"
  surface: "#101b1c"
  dashboard: "#0e181a"
  widget: "#111e20"
  warning: "#e4b587"
  action: "#a3f1d1"
  action-ink: "#10231b"
  action-hover: "#c5ffe4"
  focus: "#a7f8d9"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(42px,5.7vw,88px)"
    fontWeight: 400
    lineHeight: 1.09
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(40px,4.4vw,70px)"
    fontWeight: 400
    lineHeight: 1.09
    letterSpacing: "-.04em"
  dashboard-headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(35px,4.3vw,64px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.04em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "11px"
  metric:
    fontFamily: "Manrope, sans-serif"
    fontSize: "44px"
    fontWeight: 400
    letterSpacing: "-.03em"
rounded:
  square: "0"
  tab: "3px"
  module: "4px"
  grid: "7px"
  dashboard: "12px"
  circle: "50%"
spacing:
  header-gutter: "4.5%"
  story-gutter: "7.1%"
  dashboard-gutter: "6%"
  widget: "24px"
  dashboard-inset: "30px"
  module-gap: "8px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.square}"
    padding: "17px 22px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    padding: "9px 12px"
  dashboard:
    backgroundColor: "{colors.dashboard}"
    textColor: "{colors.text}"
    rounded: "{rounded.dashboard}"
  widget:
    backgroundColor: "{colors.widget}"
    padding: "{spacing.widget}"
  cell-select:
    backgroundColor: "#172a25"
    textColor: "#e4f5eb"
    padding: "10px"
    height: "42px"
  period-selected:
    backgroundColor: "#30483e"
    textColor: "{colors.signal}"
    rounded: "{rounded.tab}"
    padding: "4px 7px"
---

# Design System: Barak BMS journey

## Overview

**Creative North Star: "Intelligence, from cell to system"**

Scope: the homepage and dashboard implemented by this directory. The preserved amber company page at `company.html` follows [the root design system](../../DESIGN.md).

Matte black space, green circuit-board materials, cyan rim light and restrained mint signals carry one battery system from its board to a fleet and a usable dashboard. Large HTML statements share the composition with an original rendered concept film; the interface becomes denser as the visitor reaches telemetry.

**Key Characteristics:**
- Large regular-weight Manrope statements and quiet navigation.
- Mint signals over black and cool charcoal surfaces.
- A reversible seven-stage film followed by working HTML telemetry.
- Visible concept, development and simulated-data labels.

## Colors

The primary mint signal links chapter progress, selected controls, charts and healthy states. Cyan belongs mainly to the rendered lighting. Warm warning accents distinguish the demonstrated thermal and cell conditions.

- **Primary:** `signal` identifies progress and selection; `action` and its hover variant fill the closing and dashboard calls to action.
- **Neutral:** `ground` frames the story. `dashboard`, `widget` and `surface` provide cool tonal layers. `text` carries headings and metrics; `muted` carries supporting labels; `rule` divides structure.
- **Status:** `warning` marks the demo imbalance. Status also has text labels; color never carries the condition alone.

## Typography

Local Manrope regular and semibold TTFs provide the entire interface; the semibold face covers weights 500–800. Display text is regular, tightly tracked and balanced across short lines. Dashboard values use tabular numerals; labels remain proportional sans-serif.

The frontmatter records desktop story roles. At 1100px and below the hero is 65px. At 760px and below it becomes 49px, later chapter headings become 38px and story body becomes 12px. Still-story headings are 43px on mobile. The dashboard introduction becomes 35px. Compact widget labels are 9–11px; keep their copy short and preserve readable contrast.

## Layout

The cinematic story spans 800vh with a sticky 100svh stage. Desktop stage minimum height is 650px. Copy sits at 7.1% left, 30% top and 38% width; the film fills the stage beneath directional readability gradients. Seven chapter buttons span the lower edge, with baseline controls above them. The header has percentage gutters and a fine bottom rule.

At 760px and below, the stage has a 630px minimum. Copy moves to 16% from the top with 7% side gutters; the portrait film container starts at 19% and occupies 76% height. During the phone chapter, its vertical translation smoothly increases to 24% of the container height; a transparent-to-opaque top mask separates imagery from the HTML copy. The source portrait camera smoothly widens through the fleet transition to retain vehicle silhouettes. Keep this framing continuous when revising the film. Chapter names collapse to the current name while all seven numbered controls remain available.

The dashboard has a 1330px maximum width, a three-column grid and one-pixel structural gutters. The charge widget spans two rows; history and cell detail span the remaining two columns. At 1100px, widget padding tightens to 20px. At 760px, the grid uses two columns: history, temperatures, cells and alerts each span both; four module buttons share a row. Header controls wrap and the dashboard footer stacks.

The still experience places all seven scenes in normal document flow before the same interactive dashboard. Each scene retains HTML copy, meaningful image alternatives and access to the dashboard.

## Elevation & Depth

Film lighting, material shading and vignette are baked into the original landscape and portrait exports. HTML gradients protect reading areas without obscuring the complete hardware story. The dashboard combines tonal layers, thin cool borders and one broad ambient shadow (`0 35px 90px #0005`). Individual widgets remain flat and contiguous.

## Shapes

Story actions and outlined utility controls are square. The dashboard shell has a softened outer corner; its inner grid, period tabs and module controls use progressively smaller radii from the frontmatter. Rings and small status dots provide the circular vocabulary. Keep illustration geometry and data structures visually distinct from controls.

## Components

- **Rendered journey:** original 24-second landscape and portrait films share a normalized timeline. GSAP applies a 0.65-second scrub; native seeking advances a paused video. Runtime HTML requires no WebGL. Film frames cover loading, reduced motion and media failure; the visitor can select Still images and retry the rendered journey. Offscreen or hidden state suspends seeking.
- **Story controls:** chapter buttons expose the current step. Next-chapter control, dashboard anchors and expandable board callouts use real HTML. Copy transitions use a short 0.3-second fade/translation. A visible-on-focus skip link reaches the dashboard.
- **Dashboard:** persistent “Simulated telemetry” identification accompanies a real local demo. Charge, health, electrical values, history, module temperatures, cell voltages and fault log use the same muted-label/large-value hierarchy.
- **Inspection controls:** history periods and module buttons expose pressed state; a labeled native cell selector provides keyboard access to all 24 cells per module. Selected cell bars and an imbalance accent mirror the text readout. The history graph provides an accessible summary and pointer sample readout.
- **Simulation controls:** Pause/Resume gates periodic local updates while the dashboard is in view. Reduced motion suppresses timed updates and count animation. CSV export contains the selected module and labels its rows simulated. Acknowledgement changes local status text while retaining the warning condition.
- **Calls to action:** mint-filled links reach the dashboard or `company.html#contact`. The preserved contact flow prepares an email draft. Links, buttons and selectable controls use the extracted mint focus outline, offset 5px (3px on the cell selector).

## Do's and Don'ts

- Do preserve the complete still-frame story and usable dashboard when motion or media is unavailable.
- Do maintain legible HTML copy and continuous portrait fleet/phone framing.
- Do retain concept, in-development, illustrative-capacity and simulated-data labels.
- Do give selectable states text, semantic state and visible keyboard focus.
- Don't present rendered concepts as production CAD or actual product photography.
- Don't imply live vehicle connectivity, automatic contact delivery or certified device frame rates.
- Don't apply the amber company palette to the cinematic homepage.
