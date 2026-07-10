# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo is the marketing site for ASTRION S.A.S., a Colombian engineering firm offering two service divisions — solar/electrical energy and technology/IT infrastructure. Spanish is the default/primary language; an English version exists as an alternate, reachable via a language switcher in the nav.

There is no build system, package manager, framework, or test suite. It's a static site: two HTML entry points (one per language) sharing one CSS file and one JS file, plus local image assets and a handful of images loaded from a Cloudinary CDN.

## File structure

```
index.html                      — Spanish home (default); links assets/css/styles.css and assets/js/main.js
en/index.html                    — English home, same structure/ids, translated copy; links ../assets/...
trabaja-con-nosotros/index.html — Spanish careers page; links ../assets/...
en/careers/index.html            — English careers page; links ../../assets/...
assets/css/styles.css           — all CSS, shared by every page
assets/js/main.js               — all JS, shared by every page (nav scroll state, mobile menu, scroll-reveal, sectors carousel, contact form)
assets/img/                     — local PNGs (favicon, nav/footer logos)
```

Every page is a standalone HTML file — no templating/build step. `main.js` and `styles.css` are the only things shared; if you add a new page, wire it up the same way (own `<header class="nav">`/`<nav class="mnav">`/`<footer>`, correct relative depth to `assets/`, `<script src=".../assets/js/main.js">` at the end of body). `main.js` is written defensively for this: it no-ops gracefully if a page has no `.hero` or no `#contactForm` (e.g. the careers page has a `.hero` but no contact form) — don't remove those `if(hero)`/`if(form)` guards.

### Two-language setup (`index.html` + `en/index.html`)

- The two pages are **independent, hand-maintained copies** of the same markup — there's no templating/build step. When you change structure, copy, or add a section in one, mirror the change in the other (translated). This is a deliberate tradeoff for a single-page static site with no build tooling; don't introduce a client-side i18n string-swap system unless the number of languages grows.
- Both pages share `assets/css/styles.css` and `assets/js/main.js` unchanged — `en/index.html` just references them via `../assets/...` (one directory up) instead of `assets/...`.
- **IDs, `name` attributes, and hash anchors must stay identical across both pages** (`#firma`, `#capacidades`, `#metodo`, `#sectores`, `#contacto`, `#energia`, `#tecnologia`, `#inicio`, and form field `name`s like `nombre`/`telefono`/`ciudad`/`servicio`/`mensaje`) — `main.js` is shared and queries these by ID/name, and the language switcher links append the current `location.hash` so switching language keeps you on the same section. Only the *visible* text (labels, placeholders, headings) is translated; internal ids/names stay in Spanish even on the English page.
- `<html lang="es">` vs `<html lang="en">` drives the contact-form JS copy (validation message, mailto subject/labels, confirmation note) — see the `isEN` branch in `main.js`. If you add more user-facing strings to the form's JS, branch them the same way instead of hardcoding Spanish.
- The language switcher is `.nav__lang` (desktop, inside `.nav__links`) and `.mnav__lang` (mobile, first item in `.mnav`), both marked with the shared class `js-lang-switch` that `main.js` uses to append the current hash to the link's `href` on load.

### Careers page (`trabaja-con-nosotros/index.html` + `en/careers/index.html`)

- Standing "always hiring" page, not a dated job board — copy frames openings as permanent (`Vacantes permanentes` / `Permanent openings`), so don't add posting dates or expiry copy.
- Has its own hero, structurally identical to the homepage's: `<section class="hero hero--careers">` reuses `.hero__fig`/`.hero__side`/`.fig__split`/`.hero__copy`/`.hero__foot`/`.hero__spec`/`.hero__actions` as-is, just with a different image (the "Únete" team photo) and copy. The `.hero--careers` modifier only exists to override the mobile `.fig__split .half` background-image and crop position (`background-position`) and the desktop `object-position` — since those are hardcoded per-image in `styles.css`, any new page reusing `.hero` with a different picture needs its own modifier class the same way; don't reuse the bare `.fig__split`/`.half--e`/`.half--t` selectors unscoped or it'll pull in whichever hero image happens to be declared last.
- After the hero, 3-part shape on both language versions: `#intro` (`.sec--deep`, rail `01`, "Why ASTRION" — reuses the `.firma__body`/`.firma__cols`/`.facts` pattern from the homepage's "La firma" section, now just the culture/benefits blurb since the main headline moved into the hero), `#vacantes` (`.sec--gray`, rail `02`, two `.jobs-group` blocks — "Energía"/"Energy" and "Tecnología"/"Technology" — each a `.job-list` of `.job` rows), `#postulate` (`.sec--line`, rail `03`, reuses the homepage's `.chan` contact-channels component pointed at `empleos@astrion.com.co`).
- `.job` reuses the `.svc li` two-column row shape (mono code + content) but with room for a title, description, meta tags (`.job__meta`), and a `.tlink` "apply" link. Each apply link is a **static, hand-encoded `mailto:` link** (subject + body prefilled per position) — not JS-generated, since these are fixed listings rather than a dynamic form.
- Because this page lives one level deep (two for the English version), all `href`s back to the homepage's sections use `../index.html#firma` etc. (not bare `#firma`) — a bare hash anchor would just scroll within this page and do nothing.
- If you add/remove a position, keep the count and division split mirrored between the Spanish and English versions, and regenerate the `mailto:` encoding for both (subject/body text differs by language; see the existing links for the encoding pattern — spaces are `%20`, the em dash is `%E2%80%94`).

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
   `.sec`, `.cap`, and `.hero` all carry `scroll-margin-top:110px` (matches the `.sec__rail` sticky `top` offset) so that jumping to an anchor — especially a cross-page link like `../index.html#firma` from the careers page — doesn't land the section's top edge underneath the fixed `.nav`. If you add a new anchor target that isn't a `.sec`/`.cap`/`.hero` (or add pages with the fixed nav at a different height), give it the same `scroll-margin-top` or anchor links to it will look like they land in the wrong place.
4. **`<footer class="footer">`** (in `index.html`) and **`assets/js/main.js`**:
   - Nav scroll state (`.scrolled`, `.on-hero`, `.over-dark`) via `navState()` — see nav notes above.
   - Mobile menu toggle (`#burger` / `#mnav`).
   - Scroll-reveal animations: any element with class `.rv` is observed and gets `.in` added on intersection (see `.js .rv` / `.js .rv.in` CSS transitions). Add `.rv` to new elements that should animate in on scroll.
   - Sectors carousel clone-for-loop logic (see above).
   - Contact form handler: this is a **demo-only** submit handler — it does not POST anywhere, it just validates name/email client-side and builds a `mailto:` link to `info@astrion.com.co`. If wiring up real form submission (e.g., to a backend or Formspree), replace this handler rather than assuming it already sends data anywhere.

## Content/design conventions to preserve

- Section eyebrow labels use the two-digit index pattern (`01`, `02`, ...) matching both the nav anchors and the `.sec__rail .idx` markup — keep these in sync if sections are reordered.
- Spanish (`index.html`) is the source of truth for copy tone/voice; `en/index.html` is a translation of it. When adding copy, write the Spanish first, keep tone consistent, then mirror an English translation into `en/index.html`.
- Service list items (`.svc`) use short mono-styled codes (`E.01`, `T.02`) before the label — follow this numbering convention when adding list entries there. The sectors carousel items don't use these codes, just the industry name.
- Respect `prefers-reduced-motion` (already handled globally near the end of `styles.css`) when adding new animations.
