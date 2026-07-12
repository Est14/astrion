# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This repo is the marketing site for ASTRION S.A.S., a Colombian engineering firm offering three service divisions — Div. 01 "Energía"/"Energy" (solar/electrical energy), Div. 02 "Desarrollo" (ES) / "Development" (EN) (custom software, AI/data analytics, process automation, enterprise integrations), and Div. 03 "Soporte TI e infraestructura" (ES) / "IT Support & Infrastructure" (EN) (help desk, equipment/infrastructure maintenance, networks, structured cabling, CCTV, equipment supply, SLA contracts — for businesses in Colombia). In Spanish copy always use "IA" (not "AI"); "software" stays untranslated in both languages. **Never use em dashes (—) in site copy** (the owner associates them with AI-generated text): use a colon, a period, commas, or parentheses instead; this applies to visible text, meta descriptions, JSON-LD, and mailto subjects. Spanish is the default/primary language; an English version exists as an alternate, reachable via a language switcher in the nav.

**Strategic split (business decision):** the corporate site targets the Colombian market only and must NOT promote warranties, RMAs, after-sales/postventa, international manufacturers, or Latin-America-wide operations. The "Astrion Warranty Platform" B2B line (hardware warranty/RMA operations for international manufacturers) lives exclusively on a standalone English-only landing at `/en/warranty/`, shared by direct link in cold outreach — it is deliberately NOT in the main nav; the only internal link to it is a discreet footer link ("Warranty Platform (EN)" / "Warranty Platform") in the homepage footers' Empresa/Company column.

There is no build system, package manager, framework, or test suite. It's a static site: two HTML entry points (one per language) sharing one CSS file and one JS file, plus local image assets and a handful of images loaded from a Cloudinary CDN.

## File structure

```
index.html                      — Spanish home (default); links assets/css/styles.css and assets/js/main.js
en/index.html                    — English home, same structure/ids, translated copy; links ../assets/...
trabaja-con-nosotros/index.html — Spanish careers page; links ../assets/...
en/careers/index.html            — English careers page; links ../../assets/...
energia/index.html              — Spanish division page (Div. 01); EN twin: en/energy/index.html
software-ia/index.html          — Spanish division page (Div. 02); EN twin: en/software-ai/index.html
soporte/index.html              — Spanish division page (Div. 03); EN twin: en/support/index.html
la-firma/index.html             — Spanish firm-story page (founders, why the firm exists, principles); EN twin: en/the-firm/index.html
en/warranty/index.html           — English-only standalone warranty-platform B2B landing; links ../../assets/...
garantias/index.html            — redirect stub only (meta refresh + JS fallback) → /en/warranty/; real 301 lives in _redirects
_redirects                      — hosting-level 301 (/garantias/* → /en/warranty/), Netlify/Cloudflare Pages format; Apache/nginx equivalents in its comments
assets/css/styles.css           — all CSS, shared by every page
assets/js/main.js               — all JS, shared by every page (nav scroll state, mobile menu, scroll-reveal, sectors carousel, contact form)
assets/img/                     — local PNGs (favicon, nav/footer logos)
```

Every page is a standalone HTML file — no templating/build step. `main.js` and `styles.css` are the only things shared; if you add a new page, wire it up the same way (own `<header class="nav">`/`<nav class="mnav">`/`<footer>`, correct relative depth to `assets/`, `<script src=".../assets/js/main.js">` at the end of body). `main.js` is written defensively for this: it no-ops gracefully if a page has no `.hero` or no `#contactForm` (e.g. the careers page has a `.hero` but no contact form) — don't remove those `if(hero)`/`if(form)` guards.

### Two-language setup (`index.html` + `en/index.html`)

- The two pages are **independent, hand-maintained copies** of the same markup — there's no templating/build step. When you change structure, copy, or add a section in one, mirror the change in the other (translated). This is a deliberate tradeoff for a single-page static site with no build tooling; don't introduce a client-side i18n string-swap system unless the number of languages grows.
- Both pages share `assets/css/styles.css` and `assets/js/main.js` unchanged — `en/index.html` just references them via `../assets/...` (one directory up) instead of `assets/...`.
- **IDs, `name` attributes, and hash anchors must stay identical across both pages** (`#firma`, `#capacidades`, `#metodo`, `#sectores`, `#contacto`, `#energia`, `#tecnologia`, `#soporte`, `#inicio`, and form field `name`s like `nombre`/`telefono`/`ciudad`/`servicio`/`mensaje`) — `main.js` is shared and queries these by ID/name, and the language switcher links append the current `location.hash` so switching language keeps you on the same section. Only the *visible* text (labels, placeholders, headings) is translated; internal ids/names stay in Spanish even on the English page.
- `<html lang="es">` vs `<html lang="en">` drives the contact-form JS copy (validation message, mailto subject/labels, confirmation note) — see the `isEN` branch in `main.js`. If you add more user-facing strings to the form's JS, branch them the same way instead of hardcoding Spanish.
- The language switcher is `.nav__lang` (desktop, inside `.nav__links`) and `.mnav__lang` (mobile, first item in `.mnav`), both marked with the shared class `js-lang-switch` that `main.js` uses to append the current hash to the link's `href` on load.

### Careers page (`trabaja-con-nosotros/index.html` + `en/careers/index.html`)

- Standing "always hiring" page, not a dated job board — copy frames openings as permanent (`Vacantes permanentes` / `Permanent openings`), so don't add posting dates or expiry copy.
- Has its own hero, structurally identical to the homepage's: `<section class="hero hero--careers">` reuses `.hero__fig`/`.hero__side`/`.fig__split`/`.hero__copy`/`.hero__foot`/`.hero__spec`/`.hero__actions` as-is, just with a different image (the "Únete" team photo, `unete_jgvjad.png`) and copy. Like the division pages, its label is a single bottom-centered `.hero__side--w` ("Carreras — Únetenos" / "Careers — Join us") and the mobile `.fig__split` is a **single** `.half` whose image/crop comes from the `.hero--careers` modifier. Since hero images are hardcoded per-page in `styles.css`, any new page reusing `.hero` with a different picture needs its own modifier class the same way — don't reuse the bare `.fig__split`/`.half` selectors unscoped or it'll pull in whichever hero image happens to be declared last.
- After the hero, 3-part shape on both language versions: `#intro` (`.sec--deep`, rail `01`, "Why ASTRION" — reuses the `.firma__body`/`.firma__cols`/`.facts` pattern from the homepage's "La firma" section, now just the culture/benefits blurb since the main headline moved into the hero), `#vacantes` (`.sec--gray`, rail `02`, two `.jobs-group` blocks — "Energía"/"Energy" and "Tecnología"/"Technology" — each a `.job-list` of `.job` rows), `#postulate` (`.sec--line`, rail `03`, reuses the homepage's `.chan` contact-channels component pointed at `empleos@astrion.com.co`).
- `.job` reuses the `.svc li` two-column row shape (mono code + content) but with room for a title, description, meta tags (`.job__meta`), and a `.tlink` "apply" link. Each apply link is a **static, hand-encoded `mailto:` link** (subject + body prefilled per position) — not JS-generated, since these are fixed listings rather than a dynamic form.
- Because this page lives one level deep (two for the English version), all `href`s back to the homepage's sections use `../index.html#firma` etc. (not bare `#firma`) — a bare hash anchor would just scroll within this page and do nothing.
- If you add/remove a position, keep the count and division split mirrored between the Spanish and English versions, and regenerate the `mailto:` encoding for both (subject/body text differs by language; see the existing links for the encoding pattern — spaces are `%20`, the em dash is `%E2%80%94`).

### Warranty-platform landing (`en/warranty/index.html`, English-only)

- Standalone B2B cold-outreach landing for "Astrion Warranty Platform", aimed at after-sales managers of Asian hardware manufacturers. **English only** — the former Spanish twin was retired: `garantias/index.html` is now just a redirect stub (meta refresh + JS, `noindex`, canonical → EN) and `_redirects` holds the hosting-level 301. Do NOT re-create a Spanish version or add this page to the corporate nav.
- Deliberately NOT wired like the corporate pages: minimal conversion header (logo → home, on-page anchors How it works / Pilot program / FAQ, single "Book a call" CTA; no lang switcher, no hreflang tags), and its own 4-block footer (`.footer__top--four` variant). It still includes `#burger`/`#mnav` because shared `main.js` requires them.
- Section ids are English (no Spanish twin to sync with): `#problem` (01, `.sec--deep`, two labeled columns reusing `.firma__cols`), `#value` (02, `.sec--gray`, `.steps.steps--three`), `#how-it-works` (03, `.sec--soft`, 6-step `.steps.steps--flow`), `#pilot` (04, `.sec--deep` CTA band), `#faq` (05, `.faq` accordion), `#trust` (06, `.sec--line`, `.facts` + `.chan`).
- `.steps--three` / `.steps--flow` are grid variants of the homepage `.steps` (3 columns; `--flow` adds border rules for 6 items at each breakpoint). `.faq` is a native `<details>/<summary>` accordion (keyboard-accessible, no JS).
- Scope honesty: operations run in Colombia only today — keep the "Stay compliant in Colombia" value block and the volume-driven-expansion FAQ answer consistent with that; don't claim active coverage in other countries.
- The hero currently reuses the homepage panorama; a TODO comment above the hero documents the expected dedicated asset (≈2.29:1, ≥1901×829) and everything to update when it lands (img src, preload, og:image, and a page-scoped `.half--w` background override in CSS).
- Head carries per-page SEO: canonical, full Open Graph, and two JSON-LD blocks (`Organization` with the NIT as `identifier`, and `FAQPage` — keep the JSON-LD answers in sync with the visible FAQ copy).
- CTAs carry `data-cta="hero|pilot|footer"`; an inline script at the end of body fires a `warranty_cta_click` event (with `position`) through `gtag`/`dataLayer` **only if** an analytics provider is ever added — the site currently has none.
- Unresolved placeholders that must be replaced before campaigns run: `[CALENDLY_URL]`, `[ADDRESS_LINE]`, `[CONTACT_EMAIL]`, `[WHATSAPP_URL]`.

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
   - `.hero` — full-bleed hero image (`Hero2_esslp8.png`, a single three-scene panorama: solar rooftop on the left, hardware-diagnostics bench in the center, software/AI screens on the right), shown **clean, with no overlay labels** — the image's blue light-flow connects the three scenes and the divisions live in the nav instead (see below). The `.hero__side` label CSS still exists because the careers hero and the warranty landing use it. The mobile-only fallback (`.fig__split`) stacks three unlabeled panels, each a different `background-position` crop of the same panorama (`.half--e` left / `.half--t` right / `.half--w` center). Each capacidades division has its own dedicated image (set in `styles.css`): `.cap--e` `energia_r29mxp.png`, `.cap--t` `software_zmzqjd.png`, `.cap--w` `soporte_ta7wxd.png`.
   - Corporate nav links are the three divisions + Sectores/Industries + Carreras/Careers (+ lang switcher + "Contáctanos"/"Contact us" CTA). The division links go to the **division pages** (`/energia/`, `/software-ia/`, `/soporte/` — EN: `/en/energy/`, `/en/software-ai/`, `/en/support/`), NOT to the homepage's `#energia`/`#tecnologia`/`#soporte` anchors — those sections still exist on the homepage (Capacidades stays) and are linked from the footer and the Método cross-sell tlink. "La firma" and "Método" are reachable by scrolling and via the footer's Empresa/Company column, not the nav. In the mobile `.mnav`, division links carry `Div. 01/02/03` mono tags instead of the old section indices.
   - **Nav self-link rule:** on every page other than the homepage, the nav (desktop + `.mnav`) drops the entry for the page you're on and starts with "Inicio"/"Home" (→ the homepage) as the first item. The homepage itself has no "Inicio" entry (the logo covers it). E.g. the Energía page's nav reads Inicio · Software & IA · Soporte · Sectores · Carreras; the careers page's reads Inicio · the three divisions · Sectores.

### Division pages (`energia/`, `software-ia/`, `soporte/` + EN twins `en/energy/`, `en/software-ai/`, `en/support/`)

- One page per division, hand-maintained ES/EN twins per site convention (shared Spanish section ids: `#division` 01 `.sec--deep`, `#servicios` 02 `.sec--gray` with `.job-list` service rows, `#contacto` 03 `.sec--line` with `.chan`). The nav CTA on these pages points to the page's own `#contacto` section; the "Ir al formulario" tlink goes to the homepage form.
- Each hero reuses the shared `.hero` structure with a per-page modifier (`.hero--energia`, `.hero--software`, `.hero--soporte`) that sets the division image on the **single** `.half` in `.fig__split` (see the mobile media block in `styles.css`). The "División 0X" label is **bottom-centered** via `.hero__side--w` (not left-aligned `--e`). Division hero images are the same ones used by the homepage `.cap__img` blocks (`energia_r29mxp.png`, `software_zmzqjd.png`, `soporte_ta7wxd.png`).
- Service codes/descriptions must stay in sync with the homepage Capacidades `.svc` lists (E.01–E.04, D.01–D.04, S.01–S.07 (the home shows at most 6 services per division; the division page holds the full list)) — if a service is added/renamed, update the homepage article AND the division page in both languages.

### Firm-story page (`la-firma/` + `en/the-firm/`)

- "For the curious" page: the homepage `#firma` section keeps only ONE short lead paragraph + the `.facts` table + a tlink to this page (the audience doesn't read; long copy lives here, not on the home). Shared ids: `#historia` (01, `.sec--deep`, origin story + founders facts), `#problema` (02, `.sec--gray`, the two "why ASTRION exists" paragraphs that used to live on the homepage), `#principios` (03, `.sec--line`, principles facts).
- Founders (owner-provided): Luis Martínez and José Martínez, cousins from Córdoba, passionate about energy, technology, science and AI. Don't invent dates, degrees or milestones beyond this.
- Hero reuses the homepage panorama via `.hero--firma` (centered `.hero__side--w` label, single mobile `.half`).
   - `#firma` ("La firma", 01) — dark section (`.sec--deep`), positioning/intro copy.
   - `#capacidades` ("Capacidades", 02) — the three service divisions (`#energia`, `#tecnologia`, `#soporte`), each an `<article class="cap">` with a service list (`.svc`).
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
   - Contact form handler: POSTs to FormSubmit (`https://formsubmit.co/ajax/info@astrion.com.co`), a free no-backend relay. IMPORTANT: the first-ever submission triggers an activation email to that inbox; until someone clicks "Activate", FormSubmit does not deliver messages. On fetch failure it falls back to the old `mailto:` behavior. Success/error strings are branched by `isEN` like the rest of the form copy.

## Content/design conventions to preserve

- Section eyebrow labels use the two-digit index pattern (`01`, `02`, ...) matching both the nav anchors and the `.sec__rail .idx` markup — keep these in sync if sections are reordered.
- Spanish (`index.html`) is the source of truth for copy tone/voice; `en/index.html` is a translation of it. When adding copy, write the Spanish first, keep tone consistent, then mirror an English translation into `en/index.html`.
- Service list items (`.svc`) use short mono-styled codes (`E.01`, `T.02`, `W.01`) before the label — follow this numbering convention when adding list entries there. The sectors carousel items don't use these codes, just the industry name.
- Respect `prefers-reduced-motion` (already handled globally near the end of `styles.css`) when adding new animations.
