# Khagendra Luitel: AI / ML Engineer Portfolio

An editorial portfolio for an AI/ML engineer: a dark instrument panel, obsidian
black under midnight navy with one ice blue carrying every interactive accent, a
warm serif setting the headings against it, and every figure on the page drawn
in code. The hero is type and nothing else.
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
  Hero                   hero copy + the capability row and its panels
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
  core-nodes.ts           the four hero capabilities, read by the row and the panel
  skill-universe.ts       the capability graph and its CV evidence lookup
scripts/
  check-skill-universe.ts  fails if a skill node names something no CV entry records
public/
  khagendra-luitel-cv.pdf
```

`lib/palette.ts` exists because SVG attributes and canvas calls cannot resolve a
CSS custom property, so every colour drawn outside CSS resolves from there. `app/globals.css` remains the stylesheet's source of truth.

## Palette

Obsidian black under midnight navy, with one committed ink: an ice blue, held in
reserve rather than spread across the page, so it reads as an instrument light
rather than as decoration. Every colour is a token in the `@theme` block of
`app/globals.css`, which stays the source of truth.

The ratios below are computed, not asserted, and they are the reason the ramp
holds together: each token is measured against the page ground (`void`) and
against the most raised surface it can sit on (`panel3`).

| Token | Value | Role | On `void` | On `panel3` |
| --- | --- | --- | --- | --- |
| `bright` | `#f5f7fa` | headings, primary text | **18.6:1** (AAA) | 14.6:1 |
| `soft` | `#c8d0da` | secondary text | **12.8:1** (AAA) | 10.1:1 |
| `muted` | `#8d97a8` | small labels | **6.8:1** (AA) | 5.3:1 |
| `accent` | `#8be9fd` | the accent: links, rules, figures | **14.4:1** (AAA) | 11.4:1 |
| `volt` | `#b7f2fe` | paler tint, secondary accent | **16.3:1** (AAA) | 12.8:1 |
| `ice` | `#dce4ee` | cool platinum, art highlight | **15.5:1** (AAA) | 12.3:1 |
| `indigo` | `#0d1a2e` | gradient stop only | not text | not text |

Every token clears AA at the smallest size the site sets it at, which is what
holding the whole ramp above the floor buys: a label can take any of them, and
the tightest pair in the run (`muted` on `panel3`, 5.3:1) still clears the floor.
`.accent-gradient` is a flat fill of the ice blue; this world does not gradient
its rules or buttons.

### Deep panels

The hero and the open-source section sit in a well: the same roles pulled almost
to black, with the accent lifted a step so it still reads against a darker
ground. `.on-deep` and `.panel-deep` re-declare the token names they inherit
(`void` `#050609`,
`panel3` `#16202f`, `accent` `#a6eeff`, `volt` `#c6f5ff`, `ice` `#e4eaf2`,
`muted` `#96a0b0`, `soft` `#cdd5df`, `bright` `#fafbfd`), so token-based
utilities flip to that rendition for the whole subtree with no component change.
Art inside those panels resolves from `PALETTE_DEEP` in `lib/palette.ts`.

## Interactivity

Three things react to the reader, none of them needing a pointer to be useful.
The hero's capability row is a fourth, and it reads the same either way.

- **Command palette.** `Cmd K` (or `Ctrl K`) and `/` open a jump list over the
  sections, the projects and the outbound links, filtered as you type. Arrow
  keys move, Enter runs, Escape closes, focus stays in the input and the
  highlighted row is pointed at through `aria-activedescendant`. The dialog is
  portalled to `document.body` because the bar that hosts the trigger flips its
  colour tokens while the dark hero is under it.
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

- No WebGL ships. The hero was a Three.js figure until this revision, with a
  renderer chunk of 995 KB raw and 269 KB gzipped that the page had to fetch and
  parse on top of its own bundle, for a figure that was decoration in the
  accessibility tree. The hero is type now, and the three and React Three Fiber
  packages are no longer dependencies.
- What the page does draw is drawn by hand: the skill universe is the one
  canvas figure, laid out from a seeded PRNG at module scope so the drawing is
  identical on every visit, and it stops its loop while off screen. The project
  schematics and the pipeline rail animate with CSS keyframes on nodes the
  browser already has.
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
- The hero's four capabilities are real buttons in an index row beneath the
  copy, same four and same order as `lib/core-nodes.ts`, and each one fills a
  panel announced through `aria-live`. They were built as the readable twin of
  the 3D figure that used to stand beside them, and they carry the row on their
  own now that it is gone.
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
