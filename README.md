# Khagendra Luitel — AI / ML Engineer Portfolio

A cinematic, interaction-led portfolio built around a single supplied hero
artwork. Every claim on the site is transcribed from the CV — no invented
projects, metrics, employers or repository links.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Component motion | Motion for React (`motion/react`) |
| Scroll-driven motion | GSAP + ScrollTrigger |
| 3D | three.js + @react-three/fiber + @react-three/drei |
| Smooth scroll | Lenis |
| Icons | lucide-react (+ two inlined brand glyphs) |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-checks + lints)
npm start        # serve the production build
npx eslint .     # lint only
npx tsc --noEmit # types only
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real
deployment origin so canonical/Open Graph URLs resolve correctly.

## Architecture

```
app/
  layout.tsx             fonts, metadata, JSON-LD, global chrome
  page.tsx               section composition only
  icon.svg               monogram favicon
  opengraph-image.tsx    generated social card
components/
  Navbar                 floating bar + full-screen mobile menu
  Hero / NarutoHero      hero copy, layered artwork, parallax
  Embers                 canvas ember field (2D, sprite-batched)
  NeuralNetwork          R3F intelligence graph (lazy, client-only)
  PipelineDiagram        GSAP-scrubbed INPUT → OUTPUT pipeline
  About / Projects / ProjectCard / ProjectVisual
  Frontier / Research / Skills / Experience / Discipline
  Contact / Footer / Preloader
  Reveal / MaskedLines / SectionHeading / MagneticButton / Marquee
  SmoothScroll           Lenis + ScrollTrigger bootstrap
  ScrollProgress / CursorGlow / BrandIcons
lib/
  site.ts                identity + contact details
  data.ts                projects, skills, experience, research (CV-derived)
  hooks.ts               media query, viewport, scroll, clipboard
  load.tsx               intro sequence context + scroll lock
  motion.ts              shared easings, springs, variants
  palette.ts             palette channels + tint/gradient helpers (JS side)
  gsap.ts                reduced-motion check, ScrollTrigger setup, scroll scope
  layout.ts              shared section container class
public/
  naruto/naruto-portrait.webp   hero artwork (derived from the supplied image)
  khagendra-luitel-cv.pdf       CV
```

### Shared modules

Three modules exist so that a value with more than one consumer is defined once:

- **`lib/palette.ts`** holds the palette as JavaScript sees it. SVG attributes,
  Three.js materials and `canvas` gradients cannot resolve a CSS custom property,
  so every warm colour drawn outside of CSS resolves from here rather than from a
  literal in a component. `app/globals.css` remains the stylesheet's source of
  truth; the two lists mirror each other and are noted as such.
- **`lib/gsap.ts`** owns the reduced-motion check that guards effects, the
  one-time ScrollTrigger registration, and `useGsapScope` — the scoped-timeline
  wrapper every scroll animation uses. Note that `gsap` itself must still be
  imported by any module that calls it inside a scope callback.
- **`lib/layout.ts`** holds the section container class. It is written out as one
  complete literal so Tailwind's source scanner can still see each utility.

### Animation ownership

- **Motion** owns component-level choreography: masked text reveals, section
  entrances, the intro curtain, magnetic buttons, the mobile menu.
- **GSAP + ScrollTrigger** owns position-linked work: the pipeline rail, the
  experience timeline, the discipline section parallax, project card drift.
- **Lenis** owns the scroll itself. A single rAF loop runs through GSAP's
  ticker, and every Lenis scroll event refreshes ScrollTrigger.

### Performance notes

- The artwork is composited from one source file. `next/image` produces exactly
  two optimised variants (hero at high quality, section motif at low quality)
  and the motif is lazy-loaded.
- The 3D canvas is dynamically imported with `ssr: false`, mounted only once the
  section has been seen, then paused via `frameloop="never"` when off screen. It
  is never unmounted, which keeps the WebGL context stable.
- The ember field is 2D canvas with three pre-rendered sprites and additive
  blending — no per-frame allocation, and the loop stops when off screen or when
  the tab is hidden.
- Particle counts, DPR caps, antialiasing and the custom cursor all step down on
  coarse-pointer devices.

## Accessibility

- `prefers-reduced-motion` disables Lenis, the intro curtain, the custom cursor,
  the ember fields, the 3D graph and all entrance animation.
- Reduced motion is applied through a hydration-safe flag (`useStillMotion`) so
  the server HTML and the first client render always agree.
- All interactive elements are real buttons/links with visible focus rings, and
  the research constellation is keyboard navigable.

## Content policy

Repository links are intentionally absent because the projects are not published
yet; each card states that plainly instead of linking somewhere misleading.
