---
name: Barak Microelectronics
description: Cinematic engineering for intelligent energy, electronics, and mobility.
colors:
  bg: "#101110"
  surface: "#181a18"
  text: "#f1f0ea"
  muted: "#aaa9a0"
  accent: "#e8b376"
  line: "#363832"
  ink: "#171b17"
  accent-hover: "#f7cc96"
  dark-hover: "#333b30"
  audience-bg: "#d8dcd0"
  audience-text: "#222b20"
  audience-muted: "#4d564a"
  field-line: "#595d50"
  placeholder: "#9b9d91"
  status-text: "#edcba3"
  status-line: "#9b8064"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(64px, 6.25vw, 96px)"
    fontWeight: 400
    lineHeight: 1.065
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(36px, 3.5vw, 56px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-.04em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-.025em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
  lead:
    fontFamily: "Manrope, sans-serif"
    fontSize: "20px"
    lineHeight: 1.6
    letterSpacing: "-.015em"
  button:
    fontFamily: "Manrope, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
rounded:
  square: "0"
  control: "4px"
  circle: "50%"
spacing:
  gutter: "clamp(24px, 4.5vw, 80px)"
  section: "110px"
  section-compact: "85px"
  section-mobile: "70px"
  form-gap: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.square}"
    padding: "15px 21px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.square}"
    padding: "15px 21px"
  button-dark-hover:
    backgroundColor: "{colors.dark-hover}"
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    padding: "0"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.square}"
    padding: "13px 0"
  motion-control:
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "11px 15px"
  status-label:
    textColor: "{colors.status-text}"
    rounded: "{rounded.square}"
    padding: "6px 10px"
---

# Design System: Barak Microelectronics

## Overview

> Scope: this design system describes the preserved amber company page at `company.html`. The cinematic homepage and dashboard use [the BMS journey design system](src/journey/DESIGN.md).

**Creative North Star: "Cinematic engineering"**

Cinematic engineering pairs blackened surfaces, copper light, and warm white Manrope typography. The user-confirmed PSI and ON.energy references inform the large-scale composition and authored engineering imagery; the implemented components remain spare and precise.

Generous spacing and thin rules organize the content. Tonal contrast and image shading establish depth, while amber connects engineering illustrations, selected states, and calls to action. Concept imagery is visibly identified as illustration.

**Key Characteristics:**
- Large, lightly weighted sans-serif statements.
- Dark, flat surfaces with warm amber accents.
- Open layouts, thin rules, and square controls.
- Engineering concept imagery with explicit captions.

## Colors

The palette brings warm copper and bone-white type to charcoal surfaces, with a pale mineral-green section providing a deliberate tonal change.

### Primary
- **Copper amber (`accent`)** connects hero emphasis, primary actions, diagram highlights, and expanded solution headings. Its lighter hover variant marks interaction.

### Secondary
- **Mineral green (`audience-bg`)** is the homepage audience section's light ground, paired with its dedicated dark text and muted copy. This is a surface treatment, not a second action color.

### Neutral
- **Blackened ground (`bg`)** anchors the document.
- **Raised charcoal (`surface`)** separates the portfolio section and select options through tone.
- **Warm white (`text`)** carries headings and primary copy; **warm gray (`muted`)** supports body copy.
- **Moss charcoal (`ink`)** supplies dark text and the dark CTA on amber.
- **Quiet gray (`line`)** defines rules and disclosure boundaries. Fields and status labels use their own extracted stroke colors.

## Typography

**Display Font:** Manrope, with sans-serif fallback.  
**Body Font:** Manrope, with sans-serif fallback.  
There is no separate mono face. The regular and semibold TTF assets are locally hosted; the semibold face is declared for weights 500–800.

Lightly weighted, tightly tracked headings carry the visual scale. Body copy uses generous line height, with short labels remaining proportional sans-serif. Frontmatter records base desktop roles; component-specific sizes are intentionally varied.

- **Display:** hero statement, with amber on the final phrase. At widths up to 1100px it uses `clamp(64px, 7.3vw, 84px)`; at 760px it uses `clamp(42px, 8.9vw, 67px)` and a 1.08 line height; at 380px it becomes 40px.
- **Headline:** section statements. Mobile defaults to `clamp(32px, 6.4vw, 46px)` with -.035em tracking. The introduction and partnership statement use larger dedicated clamps.
- **Title:** base subheadings; solution titles use 23px desktop and 22px mobile.
- **Body:** base paragraphs; dense portfolio content uses 13px and 1.85 line height. Large introductory statements use the lead role.
- **Label:** form labels; navigation and buttons are 13px desktop. Status text is 10px. Mobile input text is 16px while placeholders are 12px.

## Layout

The centered content container has a 1600px maximum width, including responsive side gutters. Open two-column sections use percentage gaps rather than repeated boxed cards. Standard section padding follows the extracted desktop, compact, and mobile steps. Thin horizontal rules mark changes in content.

At 1100px and below, spacing and headline sizes tighten while the major columns remain. At 760px and below, the principal sections become single columns, gutters become 24px, and the portfolio image follows the disclosure list in normal flow. Its aspect ratio changes from 1/1.12 to 1.35, and its desktop sticky positioning is removed. The audience rows retain their dimensions on hover at mobile sizes.

At 380px and below, gutters become 20px, the header contact link is hidden, hero actions stack, and form rows become one column. Form rows otherwise retain two fields per row, including most mobile widths. At 1600px and above, header width is capped at 1440px and the hero art is inset 5% from the left.

Desktop hero height is `min(1060px, 100svh)` with a 900px minimum, reduced to an 850px minimum at the compact breakpoint. Mobile uses auto height with an 870px minimum (890px at the smallest breakpoint); the film occupies a 440px-high upper region beginning at 88px, with copy below. The fallback poster keeps its own crop. These minima can extend beyond a short viewport.

## Elevation & Depth

There are no component box shadows. Section tones, borders, image gradients, and composition create depth. The hero shows a locally rendered film of a physically lit, procedural battery assembly beneath dark readability overlays. Its lighting and shadows are baked into the film on both device sizes. The generated hardware artwork remains the initial, paused-before-loading, and media-error poster. The portfolio image has a dark lower gradient beneath its caption. UI controls stay flat.

The homepage plays a silent, looping native video, with a 12-second, 1080×960, 24fps H.264 export specification. Housing, cells, circuit board, and cooling cover move through an authored sequence with changing orientation and studio light. The video fades in over 600ms when media data is ready; the poster fades out over 1.2 seconds. This is an illustrative film, without runtime WebGL, pointer response, or scroll-controlled battery separation. Its encoded frame rate is not a physical-device performance guarantee.

The hero-baseline control visibly reads “Play animation,” “Pause animation,” or “Retry animation” on desktop and mobile. Its pressed state indicates motion enabled. It controls film playback and supporting page motion. Reduced-motion visitors start paused with the poster and completed diagram; they can explicitly play the film, while reduced-motion CSS keeps supporting animation disabled. Autoplay denial returns the control to Play. Media failure restores the poster and offers Retry, which remounts the media element.

The video uses muted, loop, playsInline, and preload=none. Its source is assigned only when playback is requested, the hero is visible, and the document is not hidden. Initial hash navigation lands instantly, so direct Contact links defer media loading until the visitor returns to the hero with playback enabled. Offscreen, paused, and hidden-tab states pause playback. Cleanup pauses the video, removes its source, and removes observers/listeners.

The diagram draws its amber signal paths with scroll progress and runs a 4-second linear traveling highlight only while in view, unpaused, and in a visible tab. The introduction's muted phrase also brightens with scroll progress; text never depends on animation to appear. Portfolio imagery retains its 650ms brightness reveal. Button colors transition over 200ms; link arrows move 2px upward and right over 300ms using `cubic-bezier(.16,1,.3,1)`. Reduced-motion CSS disables transitions and animations and uses immediate scrolling.

## Shapes

Buttons, fields, disclosure rows, and status labels use square geometry. The labeled motion control has 4px corners; circles are reserved for the scroll control and small status dots. One-pixel rules structure the page; the diagram's battery glyphs have small 3px corners. Inline SVG linework supplies the custom B mark, signal paths, and controls.

## Components

### Buttons

Flat rectangular actions pair short text with an upward-right arrow. The primary variant uses amber and dark ink; the dark variant reverses this against the partnership band. Desktop minimum height is 52px, mobile 50px. Hover changes fill and offsets the arrow. Text links use no enclosing surface and turn amber on hover.

Interactive elements use a 2px accent focus outline with 6px offset. On the pale audience section, links use a dark green outline; the amber partnership section uses dark ink. This describes implemented focus styles, not a blanket accessibility certification.

### Motion control

A bordered control with icon and visible text uses a 44px minimum height, 11px 15px padding, and 4px corners. Labels communicate Play, Pause, and Retry states without relying on the icon. Text is 12px desktop and 11px mobile. The control remains available under reduced motion for explicit film playback.

### Navigation

The header is absolutely positioned above the hero, not fixed during scrolling. A bottom rule separates its wordmark, desktop anchors, and bordered contact link. At the mobile breakpoint a labeled menu button controls a hidden/revealed anchor list with `aria-expanded` and `aria-controls`. Selecting a link closes it; Escape closes it and restores focus to the toggle. This is an in-page disclosure navigation, not a modal dialog.

### Disclosure lists

The portfolio uses native `details` and `summary`, a shared group name, and React state to select the corresponding illustration. It starts with the battery solution open. Opening a row changes the heading to amber and swaps plus/minus icons. The selected image remains when a row closes. Mission, vision, and principles use native disclosures with a rotating plus; the first principle starts open. No animated height expansion is implemented.

### Status labels

Small, square outlined badges with a dot identify development status. They communicate product maturity and must remain attached to the applicable product content.

### Inputs / Fields

Visible labels sit above transparent fields with a bottom border. Hover changes the rule to amber; keyboard focus uses the shared outline. Textarea height starts at 110px and can be resized vertically. Native select options use the charcoal surface. Required fields and custom validation use browser validity feedback; there is no custom inline error component.

The contact form prepares a `mailto:` draft, then displays explicit open/copy actions. It focuses the draft link when ready and announces the ready message through a status role. Clipboard failure reveals selectable text. Editing the form invalidates the prepared draft. No submission success state or remote delivery is implemented.

### Human-control diagram

Seven battery-like inputs converge through SVG paths toward an outlined applied-intelligence block. Amber paths progress with scrolling; a pale traveling highlight runs only while the diagram is in view and motion is enabled. Reduced motion shows completed paths without pulses. An arrow leads to the human decision label below. The diagram has one descriptive image role and accessible label; decorative linework is hidden from assistive technology. Keep the visual relationship between physical signals, interpretation, and accountable people clear.

## Do's and Don'ts

### Do:
- **Do** preserve strong text contrast with image shading.
- **Do** use native disclosure semantics for expandable content.
- **Do** retain visible concept and development labels.
- **Do** make human accountability explicit in AI diagrams.
- **Do** carry keyboard focus and reduced-motion behavior into new components.

### Don't:
- **Don't** present concept imagery as released product photography.
- **Don't** invent metrics, certifications, customer proof, or availability.
- **Don't** describe preparing an email draft as sending a message.
- **Don't** substitute rounded, elevated card grids for the implemented open layouts.
