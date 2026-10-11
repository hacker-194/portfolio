# DESIGN.md

The durable visual decisions for this portfolio. `app/globals.css` is the
stylesheet's source of truth for the values below; `lib/palette.ts` mirrors them
for anything drawn outside CSS (SVG, canvas).

## The world

A dark instrument panel. Near-black navy ground, near-white ink, and one muted
electric blue carrying every accent, held below neon so it reads as an instrument
light rather than a gaming one. A warm transitional serif (Spectral) sets the
headings against the cold ground; Inter carries running text; JetBrains Mono
carries figures, indices and labels.

One warm value completes the system: `ember`, a muted brass, drawn only as a
hairline rule on the two surfaces that open and close the reading (the
at-a-glance plaque and the Contact section). It is never used for type, so the
blue stays the only ink and the brass reads as a lit metal edge rather than a
competing second accent.

The mode is **Experience** (a portfolio): the work leads and the interface
recedes. The page is composed like a lit set, not a dashboard. Light falls from
above, the figure in the hero is lit from one side, edges catch a hairline of
light, and everything else is falloff.

Two worlds share one set of token names:

| Token | Ground (`void`) | Deep well |
| --- | --- | --- |
| `void` | `#04060c` page | `#000206` |
| `ink` | `#070b14` band | `#020409` |
| `panel` / `panel2` / `panel3` | `#0a101c` / `#0e1524` / `#141d2e` | `#05080f` / `#080d17` / `#0c1320` |
| `edge` | `#1e2a40` drawn lines | `#16233a` |
| `accent` | `#4d8dff` electric blue | `#6ba4ff` |
| `volt` / `ice` | `#86b4ff` / `#cbd8ec` | `#9cc2ff` / `#dce5f2` |
| `ember` | `#cfa15f` brass rule | `#e2b877` |
| `bright` / `soft` / `muted` | `#f4f7fc` / `#c2cbda` / `#8792a6` | `#fbfcff` / `#c6d0e0` / `#8d9ab0` |

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
`panel3` at 5.28:1, with `muted` on the same surface a hair behind at 5.38:1.
This is a floor, not an aspiration: it constrains the
palette, so a colour change that drops any pair below 4.5:1 is a bug.

The one place it bites is the primary button. Near-white on the electric blue is
2.98:1 and fails, so the primary action is the inverse: a near-white pill with
near-black text (18.9:1), turning electric blue with the same near-black text on
hover (6.3:1). Both states clear AA.

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
- **The accent** (`.accent-gradient`) is a flat electric blue, never a gradient.
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

`components/AtomCore.tsx` draws the sculpture: a nucleus with three orbits
turning around it, each orbit carrying one word for the frontier being studied
(LLM, Transformers, RAG).

It replaced a neural-network mesh that used to fill the hero. The atom says the
same thing more plainly: one core, three paths around it, and the vocabulary of
the work riding those paths. Each orbit is a faint ellipse with a lit arc
trailing a bead, so the ring reads as turning even while its carrier is dimmed
round the back. On a wide screen the figure sits to the right of the copy; on a
small one it centres behind it.

The nucleus is a ball of 57 nucleons, packed on a jittered cubic lattice and
sorted back to front. A lattice rather than random placement, because random
sequential packing jams near 38% and leaves the ball visibly gappy: the spheres
have to touch for it to read as matter rather than as scattered dots, and the
jitter is what stops the lattice reading as a grid. Each sphere is translucent,
so where two of them interpenetrate the fill doubles into a darker junction that
reads as the contact shadow between packed matter. One `objectBoundingBox`
gradient per tone, lit from the upper left, shades every nucleon in the ball, and
depth is carried by size and opacity rather than by a second light.

It is SVG and DOM, not canvas. The rings are static ellipse geometry, so the
only thing that changes each frame is where each carrier sits on its ring, which
keeps every label real HTML text: it takes the site's own type, and it stays
upright the whole way round, which text riding a 3D transform would not.

The depth cue is the turn's own phase rather than an intersection test. That is
enough for a single figure with nothing behind it to occlude, and it means there
is still no 3D dependency in `package.json` and no need for one.

The loop stops entirely while the hero is off screen, and reduced motion holds
one still frame.

## The skill universe

`components/SkillUniverseCanvas.tsx` draws the capability set as one figure in
three dimensions, over `lib/skill-universe.ts`: twenty-six nodes in the five
domains the section already used, placed on five icosahedron vertices so every
domain sits the same 63 degrees from every other, joined by forty connections.
Python sits at the middle of the graph because that is where the libraries meet.

It is the hero's renderer, and it is the one figure on the page a visitor can
operate. Dragging turns it, releasing lets it glide a little and settle, and it
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
