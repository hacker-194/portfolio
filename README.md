# Khagendra Luitel: AI / ML Engineer Portfolio

An editorial portfolio for an AI/ML engineer: a dark instrument panel,
near-black navy with one muted electric blue carrying every accent, a warm serif
setting the headings, and every figure drawn in code with no 3D dependency.
Every claim on the site is transcribed from the CV, and every repository link is
read live from GitHub.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Component motion | Motion for React (`motion/react`) |
| Scroll-driven motion | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| Icons | lucide-react (+ two inlined brand glyphs) |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # includes the copy guard
npm run check    # every skill node traces back to a CV entry
npm run build    # runs the guard, type-checks, then builds
npm start        # serve the production build
npx tsc --noEmit # types only
```

`npm run check` strips types with Node itself, so it needs Node 22.6 or newer
and no test runner.

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real
deployment origin, so canonical and Open Graph URLs resolve correctly.

`NEXT_PUBLIC_TALLY_FORM_ID` is the public ID of the contact form. Leave it
empty and the Contact section renders no form at all, keeping its email buttons.

`GITHUB_TOKEN` is optional and only raises the anonymous API rate limit: 60
requests an hour against the 24 a day this needs.

## Live data

The Open Source section reads public repositories once at build time, then on an
hourly server revalidation. A repository added to GitHub appears on its own, with
no redeploy. If the API is unreachable the section renders its own empty state
rather than failing the page.

It opens on the four most recently updated repositories, with a control to reveal
the rest.

Underneath sits a thirteen-week activity strip, bucketed per day from the public
events endpoint. It needs no token, it only ever shows public events, and when
the API does not answer the section shows no strip at all rather than an empty
grid that would read as inactivity.

## Architecture

```
app/
  layout.tsx             fonts, metadata, JSON-LD, global chrome
  page.tsx               section composition only
  not-found.tsx          the 404, in the same editorial style
  sitemap.ts             home + one entry per case study
  robots.ts              allow all, points at the sitemap
  icon.svg               monogram favicon
  opengraph-image.tsx    generated social card
  projects/[slug]/page.tsx   one case study per project, prerendered
components/
  Navbar                 minimal bar + full-screen mobile menu
  Hero / AtomCore        hero copy + the nucleus and its three orbits
  SkillUniverse          the capability graph: canvas figure + the text panel
  OpenSource             live repositories, read straight from GitHub
  PipelineDiagram        the intelligence pipeline rail (Frontier)
  About / Projects / ProjectCard / ProjectVisual (drawn project schematics)
  CommandPalette          ⌘K / "/" jump list over sections, projects, links
  WorkIndex               the index table that opens the Selected work section
  CursorCompanion         trailing ring, labels the hovered action (desktop only)
  Scramble                terminal-style decode for headings and the hero role
  ContactForm             the Tally embed, framed in this site's typography
  StudyBlock              labelled case-study block, shared by card and page
  Frontier / Research / Skills / Experience / Contact / Footer
  Highlights / BrandIcons
  Reveal / MaskedLines / SectionHeading / MagneticButton
  SmoothScroll           Lenis + ScrollTrigger bootstrap
lib/
  site.ts                identity, contact details, nav order
  data.ts                projects, skills, experience, learning (CV-derived)
  github.ts              live repositories (cached, revalidated hourly)
  hooks.ts               media query, viewport, scroll, clipboard
  palette.ts             palette channels + the `tint()` helper
  gsap.ts                reduced-motion check, ScrollTrigger setup, scroll scope
  layout.ts              shared section container class
  load.tsx                scroll lock for the menu and the palette
  motion.ts              shared easing + viewport-once defaults
  utils.ts               `cn()` class joiner + `clamp()`
  visuals.ts              schematic + accent maps shared by card and page
  skill-universe.ts       the capability graph and its CV evidence lookup
scripts/
  check-skill-universe.ts  fails if a skill node names something no CV entry records
public/
  khagendra-luitel-cv.pdf
```

`lib/palette.ts` exists because SVG attributes and canvas calls cannot resolve a
CSS custom property, so every colour drawn outside CSS resolves from there. `app/globals.css` remains the stylesheet's source of truth.

## Palette

A near-black navy ground with one committed ink: a muted electric blue, held
below neon so it reads as an instrument light rather than a gaming accent. Every
colour is a token in the `@theme` block of `app/globals.css`, which stays the
source of truth.

One warm value completes the system. `ember` is a muted brass, drawn only as a
hairline rule on the two surfaces that open and close the reading (the
at-a-glance plaque and the Contact section). It is never used for type, so the
blue stays the only ink and the brass reads as a lit metal edge rather than a
competing second accent.

The ratios below are computed, not asserted, and they are the reason the ramp
holds together: each token is measured against the page ground (`void`) and
against the most raised surface it can sit on (`panel3`).

| Token | Value | Role | On `void` | On `panel3` |
| --- | --- | --- | --- | --- |
| `bright` | `#f4f7fc` | primary text | **18.9:1** (AAA) | 15.7:1 |
| `soft` | `#c2cbda` | secondary text | **12.4:1** (AAA) | 10.3:1 |
| `muted` | `#8792a6` | small labels | **6.5:1** (AA) | 5.4:1 |
| `accent` | `#4d8dff` | the accent: links, rules, figures | **6.3:1** (AA) | 5.3:1 |
| `volt` | `#86b4ff` | paler blue, secondary accent | **9.6:1** (AAA) | 8.0:1 |
| `ice` | `#cbd8ec` | platinum, art highlight | **14.1:1** (AAA) | 11.7:1 |
| `ember` | `#cfa15f` | the one warm rule | **8.6:1** (AAA) | 7.2:1 |
| `indigo` | `#16224a` | gradient stop only | not text | not text |

Every token clears AA at the smallest size the site sets it at, which is what
holding the whole ramp above the floor buys: a label can take any of them, and
the tightest pair in the run (`accent` on `panel3`, 5.28:1) still has room.
`.accent-gradient` is a flat fill of the blue; this world does not gradient its
rules or buttons.

### Deep panels

The hero and the open-source section sit in a well: the same roles pulled almost
to black, with the blue lifted a step so it still reads against a darker ground.
`.on-deep` and `.panel-deep` re-declare the token names they inherit (`void`
`#000206`,
`panel3` `#0c1320`, `accent` `#6ba4ff`, `volt` `#9cc2ff`, `ice` `#dce5f2`,
`ember` `#e2b877`, `muted` `#8d9ab0`, `soft` `#c6d0e0`, `bright` `#fbfcff`), so token-based
utilities flip to that rendition for the whole subtree with no component change.
Art inside those panels resolves from `PALETTE_DEEP` in `lib/palette.ts`.

## Interactivity

Four things react to the reader, none of them needing a pointer to be useful.

- **Command palette.** `Cmd K` (or `Ctrl K`) and `/` open a jump list over the
  sections, the projects and the outbound links, filtered as you type. Arrow
  keys move, Enter runs, Escape closes, focus stays in the input and the
  highlighted row is pointed at through `aria-activedescendant`. The dialog is
  portalled to `document.body` because the bar that hosts the trigger flips its
  colour tokens while the dark hero is under it.
- **Hero pointer lamp.** The network topology lights up under the cursor. One
  throttled listener moves a radial SVG mask across a brighter copy of the same
  drawing, so a frame costs two attribute writes and never re-renders a node.
- **Scramble headings.** Section headings and the hero role decode from random
  glyphs when they scroll into view. The real string ships in the document and
  sits in a visually hidden node, so assistive tech never reads a half-decoded
  line and reduced motion gets the plain text.
- **Activity strip.** Thirteen weeks of public GitHub events as a 13 by 7 grid,
  one cell per day, with a title on each cell and a readable summary label.

## Animation ownership

- **Motion** owns component choreography: masked text reveals, section entrances,
  magnetic buttons, the mobile menu.
- **GSAP + ScrollTrigger** owns position-linked work: the pipeline rail, the
  experience timeline, the opposing parallax across each project card.
- **Lenis** owns the scroll itself, driven by GSAP's ticker so there is only one
  rAF loop.

## Performance notes

- One figure renders in three dimensions, through a small canvas renderer with
  no 3D dependency: the skill universe in the skills section. The hero's atom is
  SVG and plain DOM, and so is every other figure: its orbit rings are static
  ellipse geometry and only the three carriers on them move, while the project
  schematics and the pipeline rail animate with CSS keyframes on nodes the
  browser already has.
- The canvas figure is laid out from a seeded PRNG at module scope, and both it
  and the atom stop their animation loop while off screen, so the drawing is
  identical on every visit and costs nothing to scroll past.
- Scroll-linked motion (the pipeline rail, the experience timeline, the opposing
  parallax across each project card) runs through GSAP's ticker, so Lenis and
  ScrollTrigger share one rAF loop rather than racing.

## Accessibility

- `prefers-reduced-motion` disables Lenis, the intro sequence and all entrance
  animation.
- Reduced motion is applied through a hydration-safe flag (`useStillMotion`) so
  the server HTML and the first client render always agree.
- All interactive elements are real buttons and links with visible focus rings.
  The project card's stack flip is a button, not a hover-only effect, so it stays
  reachable by keyboard and on touch.
- The Open Source list is the whole reading: every repository is a real link
  carrying its language and date, so the section has no visual-only path.
- The pointer companion is decoration, and it behaves like it: it installs only
  for a fine pointer with motion allowed, hides itself over text fields and dead
  buttons so the platform's own I-beam and `not-allowed` still work, and adds
  its labels through `data-cursor` on elements that are already links or
  buttons. Switch it off and the site is unchanged.

## Writing

The copy is first person and avoids the phrasing that makes a page read as
machine-written. Two rules are enforced by `npm run lint`, and therefore by
`npm run build`:

- **No em dash** anywhere in source, comments included. It is the most mechanical
  of the signals. Use a comma, a colon or a full stop.
- **No retired phrasing.** The list lives in `eslint.config.mjs` and covers
  strings, template literals and JSX text. Comments are exempt, so you can still
  explain why a phrase was retired. It holds two things: copy retired from
  earlier drafts, and the stock vocabulary that gives generated prose away
  (delve, leverage, seamless, and the rest), which was swept for across the
  source before being added as a ratchet.

Add a phrase to that list when copy is retired, rather than removing it from the
list. Retired phrasing in a route the page sweep never visits, such as the social
card, is exactly what the source-level check catches.

## Content policy

The three project cards carry no repository link, because those projects are not
published yet and each card says so rather than linking somewhere misleading. The
Open Source section is the opposite case: every link there comes from the GitHub
API, so it cannot point at a repository that does not exist. Nothing is
hard-coded, and nothing is invented to fill space.

## License

MIT. See `LICENSE`.

## Known limitations

- The rendered copy scores REVIEW rather than PASS on an external AI-detection
  panel. Over half the rendered text is data that cannot carry a contraction:
  repository names, language labels, dates, skill and course titles.
