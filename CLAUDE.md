# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo is a single static HTML file: `astrion-v4.html`. It is the marketing site for ASTRION S.A.S., a Colombian engineering firm offering two service divisions — solar/electrical energy and technology/IT infrastructure. Content and copy are in Spanish.

There is no build system, package manager, framework, or test suite. Everything (HTML, CSS, JS, and two base64-encoded PNG logos) lives inline in this one file, plus a handful of images loaded from a Cloudinary CDN.

## Working with this file

- **Preview**: just open `astrion-v4.html` directly in a browser. No dev server or build step exists or is needed.
- **The file has very long lines**: the `<img>` tags for the nav/footer logos (around lines 266–267, 531) embed base64 PNG data URIs tens of thousands of characters long. When reading the file with tools that have a token/line budget, strip these first, e.g.:
  ```
  sed -e 's/data:image\/[a-zA-Z+]*;base64,[A-Za-z0-9+\/=]*/[BASE64_DATA]/g' astrion-v4.html
  ```
  or use `Grep`/targeted `Read` with `offset`/`limit` rather than reading the whole file at once.
- There's no linter or formatter configured; match the existing minified-inline-CSS / compact-JS style already in the file rather than reformatting.

## Structure of `astrion-v4.html`

Single-page document with four parts, in order:

1. **`<style>` block (head)** — all CSS, using custom properties defined once on `:root` (colors, `--maxw`, `--pad`, `--rail`, `--ease`, font stacks). Reuse these variables instead of hardcoding values. Design language: pure white background, one ink color, a single blue "ion" accent (`--ion`), no decorative icons/cards, a monospace label layer (`.m`) for section indices/eyebrows, and a sticky indexed "rail" grid (`.sec__grid` = `--rail` column + content column) used for every major section.
2. **`<header class="nav">` + mobile `<nav class="mnav">`** — fixed nav that swaps to a light/dark logo and styling depending on whether it's scrolled over a dark section (`.over-dark`, toggled by JS via `IntersectionObserver`-adjacent scroll math, not actual `IntersectionObserver`).
3. **`<main id="inicio">`** — the page content, as numbered sections each with `id` anchors matching the nav links:
   - `.hero` — full-bleed split hero image with "División 01/02" labels overlaid; has a separate mobile-only split-image fallback (`.fig__split`) since the wide hero image doesn't crop well on narrow screens.
   - `#firma` ("La firma", 01) — dark section, positioning/intro copy.
   - `#capacidades` ("Capacidades", 02) — the two service divisions (`#energia`, `#tecnologia`), each an `<article class="cap">` with a service list (`.svc`).
   - `#metodo` ("Método", 03) — 4-step process grid (`.steps`).
   - `#sectores` ("Sectores", 04) — industries served, plain list grid.
   - `#contacto` ("Contacto", 05) — contact channels (WhatsApp/email) + the lead form (`#contactForm`).
   Every section follows the same `sec__grid` = sticky rail (index number + section name) beside the content pattern; keep new sections consistent with it.
4. **`<footer class="footer">`** and a final **`<script>`** block (end of body) containing all JS:
   - Nav scroll state (`.scrolled`, `.over-dark`) via `navState()`.
   - Mobile menu toggle (`#burger` / `#mnav`).
   - Scroll-reveal animations: any element with class `.rv` is observed and gets `.in` added on intersection (see `.js .rv` / `.js .rv.in` CSS transitions). Add `.rv` to new elements that should animate in on scroll.
   - Contact form handler: this is a **demo-only** submit handler — it does not POST anywhere, it just validates name/email client-side and builds a `mailto:` link to `admin@astrion.com.co`. If wiring up real form submission (e.g., to a backend or Formspree), replace this handler rather than assuming it already sends data anywhere.

## Content/design conventions to preserve

- Section eyebrow labels use the two-digit index pattern (`01`, `02`, ...) matching both the nav anchors and the `.sec__rail .idx` markup — keep these in sync if sections are reordered.
- Copy is in Spanish; keep new copy consistent in tone and language unless told otherwise.
- Service/sector list items use short mono-styled codes (`E.01`, `T.02`, `S.03`) before the label — follow this numbering convention when adding list entries.
- Respect `prefers-reduced-motion` (already handled globally near the end of the CSS) when adding new animations.
