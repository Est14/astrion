# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo is the marketing site for ASTRION S.A.S., a Colombian engineering firm offering two service divisions — solar/electrical energy and technology/IT infrastructure. Content and copy are in Spanish.

There is no build system, package manager, framework, or test suite. It's a static site: one HTML entry point, one CSS file, one JS file, plus local image assets and a handful of images loaded from a Cloudinary CDN.

## File structure

```
index.html            — markup only; links assets/css/styles.css and assets/js/main.js
assets/css/styles.css — all CSS
assets/js/main.js     — all JS (nav scroll state, mobile menu, scroll-reveal, sectors carousel, contact form)
assets/img/           — local PNGs (favicon, nav/footer logos)
```

- **Preview**: open `index.html` directly in a browser — no dev server or build step needed. Because it now loads `assets/css/styles.css` via `<link>` and `assets/js/main.js` via `<script src>` (not inline), opening the file with `file://` works fine in modern browsers (no CORS issue for local same-folder relative paths); if anything ever fails to load under `file://`, serve the folder with any static server as a fallback.
- There's no linter or formatter configured; match the existing minified-inline-CSS / compact-JS style already in these files rather than reformatting.
- The tiny inline `<script>document.documentElement.classList.add('js')</script>` in `<head>` (before the stylesheet link) must stay inline and stay first — it has to run before first paint so the `.js .rv` reveal-animation CSS applies correctly. Don't move it into `main.js`.
- Logos live in `assets/img/`: `logo-ink.png` (dark variant, used in `.nav__logo .l-ink`), `logo-light.png` (light variant, used for `.nav__logo .l-light` and the footer brand mark — same file, reused), `favicon.png`.

## Structure of `index.html` / `assets/css/styles.css`

1. **`assets/css/styles.css`** — all CSS, using custom properties defined once on `:root` (colors, `--maxw`, `--pad`, `--rail`, `--ease`, font stacks). Reuse these variables instead of hardcoding values. Design language: pure white background, one ink color, a single copper/orange "ion" accent (`--ion`), no decorative icons/cards, a monospace label layer (`.m`) for section indices/eyebrows, and a sticky indexed "rail" grid (`.sec__grid` = `--rail` column + content column) used for every major section.
2. **`<header class="nav">` + mobile `<nav class="mnav">`** (in `index.html`) — fixed nav with two states only, driven by `navState()` in `main.js`:
   - `.nav.on-hero` (transparent, light logo/text/ghost CTA) — applies **only** at the very top of the page, before any scroll (`scrollY <= 20`) while the hero is in view.
   - `.nav.over-dark` (solid dark translucent bg, matching the "La firma" section look) — applies once scrolled past the hero (even while still visually over the hero image) and whenever the scroll-line intersects a `.sec--deep` section or the footer.
   - Default `.nav.scrolled` (white translucent bg, dark ink text) — applies once scrolled over any other (light) section.
   Don't reintroduce a bounding-box-only "on-hero for the whole hero height" check — that was the bug that let the hero's own large heading text show through the transparent nav while scrolling; `on-hero` must turn off as soon as `scrolled` is true.
3. **`<main id="inicio">`** — the page content, as numbered sections each with `id` anchors matching the nav links:
   - `.hero` — full-bleed split hero image with "División 01/02" labels overlaid; has a separate mobile-only split-image fallback (`.fig__split`) since the wide hero image doesn't crop well on narrow screens.
   - `#firma` ("La firma", 01) — dark section (`.sec--deep`), positioning/intro copy.
   - `#capacidades` ("Capacidades", 02) — the two service divisions (`#energia`, `#tecnologia`), each an `<article class="cap">` with a service list (`.svc`).
   - `#metodo` ("Método", 03) — 4-step process grid (`.steps`).
   - `#sectores` ("Sectores", 04) — auto-scrolling image carousel (`.sectors-carousel` > `.sectors-viewport` > `.sectors-track#sectorsTrack`), one `.sector-item` per industry with a background image; caption is small by default (`.sector-item__tag`) and grows to a large centered label on hover. `main.js` clones the track's children once on load (marking clones `aria-hidden`) so the CSS `translateX(-50%)` keyframe loops seamlessly — if you add/remove industries, edit the source items in `index.html` only, the clone step handles duplication.
   - `#contacto` ("Contacto", 05) — contact channels (WhatsApp/email) + the lead form (`#contactForm`).
   Every section follows the same `sec__grid` = sticky rail (index number + section name) beside the content pattern; keep new sections consistent with it.
4. **`<footer class="footer">`** (in `index.html`) and **`assets/js/main.js`**:
   - Nav scroll state (`.scrolled`, `.on-hero`, `.over-dark`) via `navState()` — see nav notes above.
   - Mobile menu toggle (`#burger` / `#mnav`).
   - Scroll-reveal animations: any element with class `.rv` is observed and gets `.in` added on intersection (see `.js .rv` / `.js .rv.in` CSS transitions). Add `.rv` to new elements that should animate in on scroll.
   - Sectors carousel clone-for-loop logic (see above).
   - Contact form handler: this is a **demo-only** submit handler — it does not POST anywhere, it just validates name/email client-side and builds a `mailto:` link to `info@astrion.com.co`. If wiring up real form submission (e.g., to a backend or Formspree), replace this handler rather than assuming it already sends data anywhere.

## Content/design conventions to preserve

- Section eyebrow labels use the two-digit index pattern (`01`, `02`, ...) matching both the nav anchors and the `.sec__rail .idx` markup — keep these in sync if sections are reordered.
- Copy is in Spanish; keep new copy consistent in tone and language unless told otherwise.
- Service list items (`.svc`) use short mono-styled codes (`E.01`, `T.02`) before the label — follow this numbering convention when adding list entries there. The sectors carousel items don't use these codes, just the industry name.
- Respect `prefers-reduced-motion` (already handled globally near the end of `styles.css`) when adding new animations.
