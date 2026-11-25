## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
# Classica: project brief for Claude Code

E-commerce landing page for a fictional fashion/streetwear brand, "Classica".
It is a **self-initiated portfolio case study**, not client work. Goal: prove growth/CRO
engineering skill (build, track, test, improve) for a "Web Developer, Growth & Conversion
Optimization" role. Visual target: `reference/design-screenshot.webp`. Match it closely.

## Current focus
**Phase 2: finish the remaining landing-page sections, static only.** No motion on new sections yet
(motion is Phase 3). No other pages yet (see Roadmap). Work one section at a time.

## Stack and rules
- **Astro (static output), vanilla JS, no UI framework.** No React/Vue/Tailwind.
- **GSAP 3.12.5 + ScrollTrigger** via `npm i gsap` (`import gsap from "gsap"`,
  `import { ScrollTrigger } from "gsap/ScrollTrigger"`, then `gsap.registerPlugin(ScrollTrigger)`).
- **Hosting: Netlify free tier.** Build command `npm run build`, publish dir `dist`. Linux is
  case-sensitive, so file names and import casing must match exactly.
- Images live in `public/images/` and are referenced as `/images/name.webp` (root-absolute).
  Use WebP, set `width`/`height`, `loading="lazy"` below the fold.
- CSS goes through **imports in frontmatter** (`import "../styles/global.css"`). Never
  `<link href="/src/...">`: it works in `npm run dev` but breaks in `npm run build`.
- Verify with `npm run build && npm run preview`, not just `dev`. The command is `npm run build`
  (plain `npm build` does nothing).

## Working style (the owner is learning Astro)
- Explain a new Astro concept in 1-2 sentences when first used; give concrete next steps.
- Keep things **inline and simple first**. Extract to components only when asked or when the same
  markup+styles appear 2+ times (the two badges and `.btn` are next candidates).
- Don't add features, sections or dependencies that weren't requested.
- `reference/classica-hero-marquee.html` is a working standalone preview of Nav, Hero, Marquee and
  BestOutfit (markup, CSS, JS). Port from it. It is the source of truth for behavior.

## Design tokens (`src/styles/tokens.css`, `:root` only)
```css
:root {
  --color-bg: #F3F0E9;        /* warm cream: page background */
  --color-bg-sage: #DCDCC9;   /* Best Outfit card */
  --color-ink: #121212;       /* headlines, nav, dark panels, footer */
  --color-ink-soft: #2B2B2B;
  --color-accent: #EF5A28;    /* the ONLY loud color: CTAs, badges, stripe */
  --color-accent-dk: #C94A1F; /* hover/pressed; white text on it = 4.67:1 */
  --color-white: #FFFFFF;
  --color-card-bg: #EDE9DF;   /* image/card placeholder + panels */

  --font-display: "Anton", "Archivo Black", Impact, sans-serif;  /* headlines, UPPERCASE */
  --font-body: "Inter", system-ui, sans-serif;                   /* 400 / 500 / 600 */

  --radius-card: 20px;
  --radius-pill: 999px;
  --section-pad-y: clamp(2rem, 5vw, 4rem);
  --container-max: 1280px;
  --gap-grid: 1.5rem;
  --header-h: 4.5rem;
  --ease-menu: cubic-bezier(.76, 0, .24, 1);
  --badge-size: clamp(5rem, 11vw, 8rem);
}
```
`global.css` holds: reset, `body`, `.container` (`width: min(100% - 2rem, var(--container-max))`),
`.btn` / `.btn--primary` / `.btn__icon`, `:focus-visible`, `.skip-link`, `.is-scroll-locked`,
and the motion-safety rules below. Component-specific CSS goes in that component's scoped `<style>`.
Don't add a second accent color.

## Naming
BEM: `block__element--modifier` (`hero__title-line`, `marquee__band--dark`, `badge--light`).
State classes use `is-*` (`is-open`, `is-scrolled`, `is-menu-open`). Placement lives with the parent
section (e.g. `.hero__badge`), look lives with the block (`.badge`).

## Fluid type (important)
Big display lines scale with their **container** using container query units, not viewport units:
```css
.parent { container-type: inline-size; --title-ratio: 6.3; --title-size: clamp(2.75rem, 12vw, 9.5rem); }
@supports (font-size: 1cqi) { .parent { --title-size: calc(100cqi / var(--title-ratio)); } }
```
Measured Anton widths (em): "ESSENTIAL STYLE" 6.26 (use 6.3), "OUTFIT" 2.45 (use 2.5), "CLASSICA" 3.47 (use 3.5).
If the font changes, re-measure and update the ratios. Lines use `white-space: nowrap` inside an
`overflow: hidden` mask (the mask is also the slide-up reveal). Self-host + preload Anton to avoid layout shift.

## Accessibility rules (non-negotiable)
- Text on `--color-accent`: use **ink**, not white (white is 3.4:1, fails AA). White only on `--color-accent-dk`.
- Interactive targets at least 44px tall. Visible `:focus-visible` on everything.
- Decorative things get `aria-hidden="true"` (outline watermark, badge ring, asterisks, button arrows).
- Descriptive `alt` on every real photo. **Replace placeholder alt text when swapping photos.**
- Navigation = `<a>`, actions = `<button>`. One `h1` per page.
- Marquee: duplicate list is `aria-hidden`, keyboard-reachable pause button, pauses on hover.
- Mobile menu: toggle uses `aria-expanded` + `aria-controls` (static label "Menu"); closed menu is
  `inert`/`visibility:hidden`; while open, `main`/`footer` are `inert`, body scroll locked,
  Escape closes and returns focus to the toggle; closes if resized to desktop (`min-width: 60rem`).
- All motion respects `prefers-reduced-motion` (CSS gate + `gsap.matchMedia()`).
- SVG `id`s must be unique per page (each badge has its own text-path id).

## Motion system
**Deferred:** new sections are built static (no `data-anim`, no GSAP) until Phase 3. The four already-ported
sections (Nav, Hero, Marquee, BestOutfit) keep the motion from the reference file.
- Pattern: `[data-anim]` elements are `visibility:hidden` only when `html.has-js` AND reduced-motion is
  not requested. GSAP reveals them with `autoAlpha`. An inline script in `<head>`
  (`is:inline`) adds `has-js`; if GSAP fails to load, remove `has-js` so nothing stays hidden.
- All animation lives inside `gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", ...)`.
- **Hero:** one timeline: intro fade-up, title lines slide up from masks (stagger .12), photo clip-path wipe,
  badge pops in (scale + rotate, `back.out`), bottom card/statement/button fade up.
- **Badge ring:** spins forever via a scoped CSS keyframe (14s linear). Don't also spin it with GSAP.
  Entrance animation targets the **wrapper** (`.hero__badge`), never the ring.
- **Marquee:** infinite `xPercent: -50` loop (30s, linear) over two identical lists; eases to a stop on
  hover; pause toggle button visible only on keyboard focus.
- **Best Outfit:** ScrollTrigger reveal once (`start: "top 70%"`); photos drift in opposite directions
  (`yPercent` ±6, scrub) on desktop only.
- Planned: category pills fill-wipe on hover; featured product image zoom (~5%) on hover; heart/bag icon
  scale-pop; Join play button slow pulse; section headers fade-up on scroll.
- Check Core Web Vitals after adding motion. If the h1 reveal hurts LCP, make it transform-only.

## Components and status
| Component | Status |
|---|---|
| Nav, now `Header.astro` (`site-header`, `site-nav`, `menu-toggle`, `mobile-menu`) | done: rendered by `BaseLayout.astro`; `.skip-link` + `.is-scroll-locked` moved to global.css (scoped versions never applied) |
| Hero (`hero__top`: grid + `container-type`; photo + badge; `hero__bottom`: 2-photo card + outline watermark) | done in preview |
| MarqueeStripe | done: `variant` prop, `"dark"` under the hero, `"light"` above the footer (base blends into footer ink). Band class is now `marquee__band--text`. No JS yet: loop + pause toggle come in Phase 3 |
| BestOutfit (12-col grid, tilted photos, outlined "OUTFIT", light badge link) | done in preview |
| Badge (dark = `role="img"` with 30% OFF; light = link with arrow) | done: `Badge.astro` with `id`, `label`, `variant`, `href`, `value`, `caption`, `ringText` props (text via props, not slots). Styles live in the component; parents position a wrapper (`.hero__badge`, `.best-outfit__badge`), which also carries `data-anim` |
| Button | done: `Button.astro` (`href`, `variant="primary"`, label via slot, extra attributes like `data-anim` pass through). Look stays in global.css (`.btn`, `.btn--primary`, `.btn__icon`). Used in Hero, Header mobile menu, JoinSection |
| Header + Footer as shared layout pieces (`Header.astro`, `Footer.astro` rendered by `BaseLayout.astro`, which also adds the skip link and `<main id="main">`) | done (Phase 2) |
| CategoryPanel: black rounded box, orange "Classic Neutrals" card, tall center photo, outlined category pills | done, static (`id="collection"`). Photos from Unsplash in `public/images/category-*.webp` (credits in `CREDITS.md`). Shared `.stripes` class in global.css |
| FeaturedProducts + ProductCard: 3-card grid (1 large "Hoodies", 2 small), price pills, heart + bag buttons | done, static (`id="product"`). Collection schema in `src/content.config.ts`, 4 entries in `src/content/products/` with Unsplash photos (`CREDITS.md`). ProductCard props: `product`, `size`. Heart/bag buttons have no JS yet |
| JoinSection: banner with outline "JOIN" + solid "WITH US", play button, "Shop now" pill | done, static (`id="join"`). Unsplash photo `public/images/join-banner.webp` (credits in `CREDITS.md`); shade gradient tuned for >= 7:1 text contrast on it, re-check if the photo changes. Play button has no video/JS yet |
| MarqueeStripe again + Footer (dark, link columns, social pills) | done, static |

Planned structure: `src/{components,content/products,layouts/BaseLayout.astro,pages/index.astro,scripts,styles}`.
Page order: Nav, Hero, Marquee, BestOutfit, CategoryPanel, FeaturedProducts, JoinSection, Marquee, Footer.

## Gotchas already hit (don't repeat)
- `<img width height>` attributes beat `aspect-ratio`: add `height: auto` (or position the image absolutely in a sized box).
- `backdrop-filter`/`transform` on `.site-header` would trap the fixed mobile menu: the header background is a
  `::before` layer instead. Header uses `position: fixed` with no transform.
- Scoped `<style>` can't style a child component's root: wrap it and position the wrapper.
- Don't use `localStorage` for anything cross-viewer; no secrets in client JS.

## Roadmap (work in this order; don't start a phase until the previous one's "done when" is true)
One branch per phase, commit after every section, and update the status table above at the end of each session.

0. **Foundation**: Astro project, tokens + global CSS imported in BaseLayout, repo on GitHub, connected to Netlify.
   *Done when:* a near-empty page with the right fonts/colors is live on a Netlify URL.
1. **Port the finished sections** (Nav, Hero, Marquee, BestOutfit, inline) from `reference/classica-hero-marquee.html`.
   *Done when:* `npm run preview` matches the reference at 1440 / 768 / 390 px.
2. **Remaining landing sections, static** (CategoryPanel, FeaturedProducts + ProductCard, JoinSection, second
   Marquee, Footer), plus Header/Footer extracted into the layout, and `Badge` / `Button` extracted into components.
   *Done when:* the full page matches the design top to bottom with static styling.
3. **Motion + a11y pass**: GSAP for the new sections, reduced-motion check, keyboard-only walkthrough, mobile pass.
   *Done when:* Tab/Escape work everywhere and nothing stays hidden if GSAP fails to load.
4. **Performance + launch**: image optimization, self-hosted/preloaded Anton, Lighthouse (mobile) green on Core
   Web Vitals, meta/OG/favicon, final Netlify deploy.
   *Done when:* the public URL works on a phone and Lighthouse screenshots exist for the case study.
5. **Growth layer** (what makes this a case study; free-tier only, honestly labelled self-initiated):
   GA4 + GTM events (add-to-cart click, scroll depth, form start/complete) and a simple funnel; Microsoft Clarity;
   a hand-rolled cookie-based A/B test on the hero CTA (variant sent to GA4); waitlist form to a Netlify Function
   to a free CRM (HubSpot Free or Airtable) with error handling and a Slack webhook.
   Report real sample sizes only. Never invent numbers; use `[PLACEHOLDER]`.
6. **Case study + positioning** (posts start in Phase 2): problem, build, what was measured, what's next.
7. **Other pages** (collection, product detail, cart, etc.): **not started, and no designs are in the repo yet.**
   Don't invent them. When designs arrive, add them under `reference/pages/` and plan routes + shared components first.
   Reuse Header, Footer, ProductCard, Badge and Button; products come from the same content collection.

## Design references
- `reference/design-screenshot.webp`: the full-page overview.
- `reference/sections/NN-name.png`: one crop per section at the highest resolution available
  (e.g. `04-category-panel.png`). Read the crop for details (spacing, type size, radii), the full page for order.
- After each section: screenshot `npm run preview` at 1440 / 768 / 390 and compare with its crop. Fix differences
  before moving on. Placeholder images are fine, but keep the same crops/aspect ratios as the design.

## Definition of done for any section
Matches the screenshot at 1440 / 768 / 390 px; no horizontal scroll; keyboard-usable; reduced-motion
respected; passes `npm run build` and looks right in `npm run preview`.
