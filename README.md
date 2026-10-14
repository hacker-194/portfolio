# Khagendra Luitel: AI / ML Engineer Portfolio

An editorial portfolio for an AI/ML engineer: warm paper, near-black ink, and
one oxblood carrying every interactive accent. A reserved mist blue is spent
only on measured data, a high-contrast display serif sets the headings, and
every figure on the page is drawn in code. The cover is type on a masthead and
nothing else, and each section opens as a spread: title in the left column, the
standfirst in the right gutter. No gradient text and no coloured glow: the
language is a printed page, not a dark screen with lights on it.
Every claim on the site is transcribed from the CV, and every repository link is
read live from GitHub.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Component motion | Motion for React (`motion/react`) |
| Scroll-driven motion | GSAP + ScrollTrigger |
| Scrolling | Native (no scroll-hijacking layer) |
| Icons | lucide-react (+ two inlined brand glyphs) |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # includes the copy guard
npm run check    # every skill node traces back to a CV entry
npm run build    # runs the guard, type-checks, then builds
npm start        # serve the production build
npm run typecheck # types only
```

`npm run check` strips types with Node itself, so it needs Node 22.6 or newer
and no test runner.

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real
deployment origin, so canonical and Open Graph URLs resolve correctly.

`NEXT_PUBLIC_TALLY_FORM_ID` is the public ID of the contact form. Leave it
empty and the Contact section renders no form at all, keeping its email buttons.

`GITHUB_TOKEN` is optional and only raises the anonymous API rate limit: 60
requests an hour against the 24 a day this needs.

## Dependency audit

`npm install` prints no audit summary here, on purpose (see `.npmrc`). `npm audit`
reports high-severity findings in the lint toolchain only, and the fix it
suggests, `npm audit fix --force`, downgrades `eslint-config-next` to the Next 14
line and breaks lint and the build. Never run it. `npm run audit:prod` checks
what actually ships to visitors and reports 0.

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
  SkillUniverse / SkillUniverseCanvas   the capability graph: canvas figure + the text panel
  OpenSource             live repositories, read straight from GitHub
  PipelineDiagram        the intelligence pipeline rail (Frontier)
  About / Projects / ProjectCard / ProjectVisual (drawn project schematics)
  CommandPalette          ⌘K / "/" jump list over sections, projects, links
  WorkIndex               the index table that opens the Selected work section
  FactList                label and value rows, shared by the spec and the results
  ContactForm             the Tally embed, framed in this site's typography
  StudyBlock              labelled case-study block, shared by card and page
  Frontier / Research / Skills / Experience / Contact / Footer
  Highlights / BrandIcons
  Reveal / MaskedLines / SectionHeading / MagneticButton
  ScrollSync             ScrollTrigger bootstrap + the anchor-jump helper
lib/
  site.ts                identity, contact details, nav order
  data.ts                projects, skills, experience, learning (CV-derived)
  github.ts              live repositories (cached, revalidated hourly)
  hooks.ts               media query, viewport, scroll, clipboard
  palette.ts             palette channels + the `tint()` helper
  gsap.ts                reduced-motion check, ScrollTrigger setup, scroll scope
  layout.ts              shared section container class
  scroll-lock.ts          scroll lock for the menu and the palette
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

Paper and ink, with one committed hue: an oxblood, held in reserve rather than
spread across the page, so it reads as a printed accent rather than as
decoration. One mist blue is spent only on measured data (the activity strip
and the diagrams' metric bars), so when the reader sees blue it always means a
number. Every colour is a token in the `@theme` block of `app/globals.css`,
which stays the source of truth.

Two counted hues, not a shelf of pastels. `npm run check` measures the chroma
of every token in both scopes and fails if anything but `accent` and `data` is
saturated, because a dark ground carrying a handful of near-pastel accents is
exactly what generated design looks like.

The ratios below are computed, not asserted, and they are the reason the ramp
holds together: each token is measured against the page ground (`void`) and
against the most recessive surface it can sit on (`panel3`). The check computes
the same pairs and fails a build that drops one below AA.

| Token | Value | Role | On `void` | On `panel3` |
| --- | --- | --- | --- | --- |
| `bright` | `#17140f` | headings, primary text (ink) | **16.1:1** (AAA) | 14.4:1 |
| `soft` | `#46423a` | secondary text | **8.8:1** (AAA) | 7.8:1 |
| `muted` | `#665f52` | small labels | **5.6:1** (AA) | 4.9:1 |
| `accent` | `#7b2d26` | the accent: links, rules, figures | **8.2:1** (AAA) | 7.3:1 |
| `volt` | `#3f3a32` | drawing ink, mid | **9.9:1** (AAA) | 8.8:1 |
| `ice` | `#211e1a` | drawing ink, deepest | **14.6:1** (AAA) | 13.0:1 |
| `data` | `#2f5d8c` | measured data only: activity, metrics | **6.0:1** (AA) | 5.4:1 |
| `indigo` | `#e2d8c4` | gradient stop only | not text | not text |

Every token clears AA at the smallest size the site sets it at, which is what
holding the whole ramp above the floor buys: a label can take any of them, and
the tightest pair in the run (`muted` on `panel3`, 4.9:1) still clears the floor.
`.accent-gradient` is a flat fill of the accent; this world does not gradient its
rules, its buttons, or a line of its headings.

Every colour resolves from a token. Where an alpha is needed (washes, glints,
keylights, the selection, the scrollbar) the stylesheet mixes the token with
`color-mix()` rather than writing its channels out again, because a spelled-out
rgb triple is a second copy of a colour and the first thing to drift from the
one it copies. `npm run check` holds that line: it fails on a hand-written
literal, on a token that disagrees with `lib/palette.ts`, on a text token below
AA against the ground it can land on, on a third saturated hue, and on a favicon
value that has left the palette. `app/icon.svg` is the one asset that cannot reference
a token, so it is checked against the palette instead of being trusted, while
`app/opengraph-image.tsx` draws from `lib/palette.ts` like the diagrams do.

### Ink plates

The hero and the open-source section are plates of ink cut out of the sheet: the
same roles flipped, with the accent lifted a step and both the drawing inks and
the ambient greys inverted so they still read against the near-black ground.
`.panel-deep` re-declares the token names it inherits
(`void` `#141310`,
`panel3` `#2e2a25`, `accent` `#d2896b`, `volt` `#e8ded0`, `ice` `#f5f0e6`,
`brand` `#b3aca0`, `muted` `#9a948a`, `soft` `#d6d0c4`, `bright` `#f7f3ea`), so
token-based utilities flip to that rendition for the whole subtree with no
component change. Nothing drawn in JavaScript sits on a plate, so there is no
second palette in code: `lib/palette.ts` mirrors the sheet's tokens only, and a
figure printed on a plate would need its own.

## Interactivity

Three things react to the reader, and none of them needs a pointer: the
command palette, the activity strip, and the hero's capability row, which reads
the same with or without one.

Motion is kept deliberately quiet. An earlier revision also had terminal-style
decoding headings, a trailing custom cursor and a smooth-scroll layer; all three
were removed because they performed for the reader instead of serving them.

- **Command palette.** `Cmd K` (or `Ctrl K`) and `/` open a jump list over the
  sections, the projects and the outbound links, filtered as you type. Arrow
  keys move, Enter runs, Escape closes, focus stays in the input and the
  highlighted row is pointed at through `aria-activedescendant`. The dialog is
  portalled to `document.body` because the bar that hosts the trigger flips its
  colour tokens while the dark hero is under it.
- **Activity strip.** Thirteen weeks of public GitHub events as a 13 by 7 grid,
  one cell per day, with a title on each cell and a readable summary label.

## Animation ownership

- **Motion** owns component choreography: masked text reveals, section entrances,
  magnetic buttons, the mobile menu.
- **GSAP + ScrollTrigger** owns position-linked work: the pipeline rail, the
  experience timeline, the opposing parallax across each project card.
- **The browser** owns the scroll itself. There is no smooth-scroll library:
  wheel, trackpad, find-in-page and anchor links behave as the reader's system
  is set up, and ScrollTrigger reads the native position.

## Performance notes

- No WebGL ships. The hero was a Three.js figure until this revision, with a
  renderer chunk of 995 KB raw and 269 KB gzipped that the page had to fetch and
  parse on top of its own bundle, for a figure that was decoration in the
  accessibility tree. The hero is type now, and the three and React Three Fiber
  packages are no longer dependencies.
- The skill universe canvas is split into its own chunk with `next/dynamic` and
  fetched after hydration, behind a placeholder of the same size so nothing
  shifts. The text panel beside it is the full reading and never waits for it.
- `next.config.ts` sends baseline security headers (`nosniff`, `DENY` framing, a
  strict referrer policy, a locked-down permissions policy) and drops
  `X-Powered-By`. A full CSP is deliberately omitted: the inline JSON-LD and the
  framework bootstrap would need a per-request nonce, which makes pages dynamic.
- What the page does draw is drawn by hand: the skill universe is the one
  canvas figure, laid out from a seeded PRNG at module scope so the drawing is
  identical on every visit, and it stops its loop while off screen. The project
  schematics and the pipeline rail animate with CSS keyframes on nodes the
  browser already has.
- Scroll-linked motion (the pipeline rail, the experience timeline, the opposing
  parallax across each project card) runs on ScrollTrigger against the native scroll
  position, so there is no second scroll loop to keep in sync.

## Accessibility

- A skip link is the first tab stop and lands on `<main id="main">`.
- `prefers-reduced-motion` disables the scroll animations and all entrance
  animation, and jumps between sections instantly.
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

## Adding proof

Case studies take two optional fields in `lib/data.ts`, and nothing renders for
either until it exists:

- `href`: a repository or demo link. A project with a link shows it in place of
  the "not published yet" note.
- `results`: measured outcomes as `{ label, value }` rows. When present, a
  Results block appears on the card and the case study. Record only what was
  actually measured, for example one row per compared model with its R², MAE and
  RMSE.

## License

MIT. See `LICENSE`.

## Known limitations

- The rendered copy scores REVIEW rather than PASS on an external AI-detection
  panel. Over half the rendered text is data that cannot carry a contraction:
  repository names, language labels, dates, skill and course titles.
