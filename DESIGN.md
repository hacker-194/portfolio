# DESIGN.md

The durable visual decisions for this portfolio. `app/globals.css` is the
stylesheet's source of truth for the values below; `lib/palette.ts` mirrors them
for anything drawn outside CSS (SVG, canvas).

## The world

A dark instrument panel. Obsidian black ground, midnight navy for cards and
sections, soft white ink, and one ice blue carrying every interactive accent.
Ice blue is rationed rather than spread: it is the only saturated colour in the
system, and it is kept off large fills, so it reads as an instrument light rather
than as a gaming wash. A warm transitional serif (Spectral) sets the headings
against the cool ground; Inter carries running text; JetBrains Mono carries
figures, indices and labels; platinum silver carries secondary text and the
labels themselves.

The mode is **Experience** (a portfolio): the work leads and the interface
recedes. The page is composed like a lit set, not a dashboard. Light falls from
above, the figure in the hero is lit from one side, edges catch a hairline of
light, and everything else is falloff.

Two worlds share one set of token names:

| Token | Ground (`void`) | Deep well |
| --- | --- | --- |
| `void` | `#08090c` page | `#050609` |
| `ink` | `#0b0d12` band | `#08090e` |
| `panel` / `panel2` / `panel3` | `#101827` / `#141c2b` / `#192337` | `#0d141f` / `#101827` / `#16202f` |
| `edge` | `#26334a` drawn lines | `#1f2c40` |
| `accent` | `#8be9fd` ice blue | `#a6eeff` |
| `volt` / `ice` | `#b7f2fe` / `#dce4ee` | `#c6f5ff` / `#e4eaf2` |
| `bright` / `soft` / `muted` | `#f5f7fa` / `#c8d0da` / `#8d97a8` | `#fafbfd` / `#cdd5df` / `#96a0b0` |

`.panel-deep` is the well the hero and the open-source section sit in: the same
roles pulled almost to black, with the blue lifted a step so it still reads
against a darker ground. As before, the scope re-declares the token names it
inherits, so `text-bright`, `bg-void` and the rest flip for the whole subtree
without any component knowing. `.on-deep` carries only the colours.

The bar no longer flips between a light and a dark rendition as it passes over
the hero. One ground means one rendition, which removed a scroll listener and a
whole class of "flashed the wrong colour before hydration" bug.

## Contrast floor

Every text token clears WCAG AA (4.5:1) against every ground token it can sit on,
in both the base and deep ramps. The tightest pair in the run is `accent` on
`panel3` at 5.3:1, with the deep ramp's `muted` on `panel3` at 6.2:1 behind it.
This is a floor, not an aspiration: it constrains the
palette, so a colour change that drops any pair below 4.5:1 is a bug.

The one place it bites is the primary button. Soft white on the ice blue is
1.29:1 and fails, so the primary action is the inverse: a platinum pill with
obsidian text (18.6:1), turning ice blue with the same obsidian text on hover
(14.4:1). Both states clear AA.

## Type

- **Display** (`font-display`): **Spectral**, a warm editorial serif, at medium
  weight with tight leading. It is the only warm thing on the page, which is what
  keeps a cold ground from reading as a console.
- **Text** (`font-sans`): **Inter** for running copy.
- **Mono** (`font-mono`): **JetBrains Mono**, for figures, indices, pipeline
  stages and labels.

Labels (`.label-mono`) are mono, small and tracked wide. On an engineered page a
technical face on a label is information rather than costume, and it is what
makes the folio numbers, stage names and status words read as one system.

The display scale is deliberately extreme: the hero name runs to 9.25rem, a
section heading to 3.75rem and the footer wordmark to 16.5rem at their caps.
Editorial layouts read as expensive when one element is allowed to be
unreasonably large; the tracking is tightened to -0.03em to hold the serif at
those sizes rather than letting it fall apart.

Section rhythm is fixed: `py-24 sm:py-32 lg:py-40`, with the at-a-glance plaque
at `py-16 sm:py-20`. Generous space is the cheapest luxury there is.

## Surface language

- **Panels** (`glass-card` / `glass-panel`) are opaque lacquered surfaces, not
  glass: no backdrop blur anywhere in the product (the audit asserts this), no
  translucent white wash over the ground. What lifts them is a hairline of light
  along the top edge, a faint vertical sheen, a deep black shadow with a long
  blur, and a restrained blue bloom that only appears on hover.
- **The accent** (`.accent-gradient`) is a flat ice blue, never a gradient.
- **Chips** are the one shape for every named technology or skill, in
  `lib/visuals.ts`: a hairline rounded rectangle on a 5% wash, mono at 12px.
  The project card's stack, the case study's stack and the skill universe's
  connections all resolve to that one class, because they are three renderings
  of one idea and had started to drift into three near-identical variants.
- **Rules** (`.hairline`, `.accent-rule`) are faint light lines that fade at
  their ends.
- **Depth** shadows carry a real offset and a long blur. Nothing has a zero-offset
  halo.

## Cinematic furniture

Three utilities build the light, all in `globals.css`:

- `.keylight` is the blue wash behind the hero figure.
- `.vignette` seats a section by darkening its edges.
- `.grain` is one layer of fine film grain, an inline SVG turbulence rather than
  an asset, at 4.5% opacity. It is what stops gradients this wide from banding on
  a dark screen.

## The hero

`components/IntelligenceCore.tsx` draws the sculpture: a glass core with four
capability nodes around it, wired to it by hairline struts that carry a pulse. It
is Three.js through React Three Fiber and Drei, and it is the only WebGL on the
page, loaded on demand rather than with the page.

The core is an icosahedral glass shell over a metal body with a small lit heart,
turning slowly. Each node carries a metal bead, a hairline halo and a label, and
the whole layout comes from `lib/core-nodes.ts`, so the ring is data rather than
a literal buried in the scene. On a wide screen the figure sits to the right of
the copy; on a small one it sits behind it.

Three rendering decisions are worth keeping:

- **The environment is built, not fetched.** A Drei preset downloads an HDRI
  from a CDN, which would put a third-party request in front of every visit and a
  network dependency in the build. What carries the glass and the metal is a
  studio assembled from `Lightformer`s and baked once (`frames={1}`), because the
  light never moves.
- **The labels are HTML, not 3D text.** A `Text` node needs a font file, again
  fetched, and the site already ships its own type. `Html` gives the labels the
  real thing and keeps them crisp at any camera distance. Their z-index range is
  capped below the site chrome, which sits at z-80, so a label can never cover
  the navigation. They also carry `pointer-events: none`, because a label sitting
  over the canvas would otherwise intercept the hover meant for its own node.
- **Transmission glass is gated.** It is the expensive part of the scene, so it
  renders only on a desktop-class device, guessed from screen width and core
  count. Everywhere else the core is a polished metal shell against the same
  environment, which still reads as a real object.

The camera is fitted to the figure rather than parked at a fixed distance.
`r / sin(fov / 2)` is the exact distance at which a sphere of radius `r`
subtends the field of view, so the scene is framed on both axes from arithmetic
rather than from a fudge factor per breakpoint, which is what a fixed distance
would need given that the canvas box changes shape at every one.

The pointer lean and the slow turn are kept on separate groups, because they are
different motions: the turn accumulates on the inner group while the lean is set
absolutely on the outer one, so a moving pointer cannot disturb the drift and the
drift cannot fight the pointer.

The scene renders only after a WebGL probe succeeds, so a machine that cannot
draw it gets the hero without the canvas rather than an exception thrown inside
the renderer. That probe and the quality guess are read through
`useSyncExternalStore` rather than set from an effect: an effect calling
`setState` on mount would cost a second render pass of the whole hero to answer
a question whose answer never changes.

The loop stops entirely while the hero is off screen, and reduced motion holds
one still frame.

## The skill universe

`components/SkillUniverseCanvas.tsx` draws the capability set as one figure in
three dimensions, over `lib/skill-universe.ts`: twenty-six nodes in the five
domains the section already used, placed on five icosahedron vertices so every
domain sits the same 63 degrees from every other, joined by forty connections.
Python sits at the middle of the graph because that is where the libraries meet.

It is a hand-written canvas renderer, independent of the hero's WebGL, and it is
the one figure on the page a visitor can operate. Dragging turns it, releasing
lets it glide a little and settle, and it
drifts slowly on its own until it is touched or a node is selected. Selecting a
node turns the whole figure so that node faces the reader.

Node size is evidence, not a score. A radius comes from how many entries record
that skill: a case study, the internship, a course, a piece of study material, a
frontier direction. `evidenceFor` derives that from `lib/data.ts`, and the panel
lists every entry it found with the source it came from. A node therefore cannot
be drawn larger than the CV can back up, and `scripts/check-skill-universe.ts`
fails if any node names a skill nothing records.

The panel beside the figure is the same graph as text, and it is the accessible
path: to assistive tech the canvas is one figure, and every node is a real button
in the panel, in the same five domains. Choosing a skill moves focus into the
panel, because the list that was used to choose it no longer exists.

Reduced motion holds one still frame and redraws only what the visitor changes,
which is a drag, a selection or a resize, rather than animating a drift nobody
would be shown. The loop stops while the section is off screen: measured on the
same headless rasteriser at 1440 wide, p50 and p95 frame intervals are both
16.7 ms.

## Visuals

Every figure is drawn, not rendered, with the two exceptions of the hero and the
skill universe above: SVG and DOM. Each project card carries its own architecture
schematic (`ProjectVisual`: request/response, exploratory analysis, model
comparison), and the Frontier section the intelligence pipeline rail.

The schematics are abstract diagrams of the architecture the CV describes, with
no screenshots and no invented figures. Art on the deep panels draws from
`PALETTE_DEEP`; everything else resolves its colour through `tint()` from
`lib/palette.ts`, so no colour is a literal buried in a component.

Reduced motion stops the drawn animation (the flow dashes, the pulsing nodes,
the hero's signals and the universe's drift) and keeps the static figure.

## Interaction

The pointer companion, the command palette, the scramble, the magnetic buttons
and the project-card tilt all carry over from the previous system; they are
already token-driven, so they re-tinted rather than being rebuilt. The companion
still reads `.on-deep` to pick its palette, which now matters less but costs
nothing.

Reduced motion turns the companion and the hero loop off rather than slowing them
down. Sections still reveal, but without travel.

## Copy

The `copy/guard` ESLint rule bans em dashes and a list of retired
machine-flavoured phrases across `app/`, `components/` and `lib/`. Keep product
language plain and specific; no kicker labels above headings, no invented claims.

The site is positioned for engineering roles: the hero, the at-a-glance plaque
and the availability line lead with shipped systems, and the degree is stated as
a credential rather than as the identity. Nothing is inflated to do it. Because
the CV records no business outcome for these projects, the block that closes a
case study is named **Specification** and holds the interface, the inference
path, the model and the metrics, rather than a results table that would have to
be invented.
