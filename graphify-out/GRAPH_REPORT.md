# Graph Report - portfolio-main  (2026-10-14)

## Corpus Check
- Corpus is ~30,427 words - fits in a single context window. You may not need a graph.

## Summary
- 306 nodes · 820 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Skills Universe Figure
- Layout, Fonts and Metadata
- Sections, Icons and Contact
- Tooling and Dependencies
- Home Page and Timeline
- Project Case Studies
- TypeScript Configuration
- Palette and Social Card
- PostCSS Configuration

## God Nodes (most connected - your core abstractions)
1. `cn()` - 32 edges
2. `useStillMotion()` - 28 edges
3. `Reveal()` - 22 edges
4. `SectionHeading()` - 18 edges
5. `react` - 17 edges
6. `compilerOptions` - 17 edges
7. `lucide-react` - 15 edges
8. `SECTION_CONTAINER` - 14 edges
9. `motion` - 14 edges
10. `Page()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `NotFound()` --calls--> `MagneticButton()`  [EXTRACTED]
  app/not-found.tsx → components/MagneticButton.tsx
- `OpengraphImage()` --calls--> `tint()`  [EXTRACTED]
  app/opengraph-image.tsx → lib/palette.ts
- `Page()` --calls--> `Contact()`  [EXTRACTED]
  app/page.tsx → components/Contact.tsx
- `Page()` --calls--> `Hero()`  [EXTRACTED]
  app/page.tsx → components/Hero.tsx
- `About()` --calls--> `useStillMotion()`  [EXTRACTED]
  components/About.tsx → lib/hooks.ts

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "Skills Universe Figure"
Cohesion: 0.00
Nodes (55): DetailProps, IndexProps, plural(), SkillDetail(), SkillIndex(), SkillUniverse(), SkillUniverseCanvas, DOMAINS (+47 more)

### Community 1 - "Layout, Fonts and Metadata"
Cohesion: 0.00
Nodes (39): cormorant, jetbrains, metadata, montserrat, PERSON_SCHEMA, RootLayout(), viewport, Command (+31 more)

### Community 2 - "Sections, Icons and Contact"
Cohesion: 0.00
Nodes (32): metadata, NotFound(), FOCUS, GithubMark(), LinkedinMark(), Channel, CHANNELS, Contact() (+24 more)

### Community 3 - "Tooling and Dependencies"
Cohesion: 0.00
Nodes (43): copyGuard, eslintConfig, RETIRED, dependencies, gsap, lucide-react, motion, next (+35 more)

### Community 4 - "Home Page and Timeline"
Cohesion: 0.00
Nodes (34): Page(), STACK, About(), ENTRIES, Experience(), ICONS, LABELS, TimelineEntry (+26 more)

### Community 5 - "Project Case Studies"
Cohesion: 0.00
Nodes (14): CaseStudyPage(), PageProps, Fact, FactList(), ProjectCard(), ProjectVisual(), StudyBlock(), StudyBlockProps (+6 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.00
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 7 - "Palette and Social Card"
Cohesion: 0.00
Nodes (9): alt, contentType, OpengraphImage(), size, buildChannelMap(), channels(), PALETTE, PaletteColor (+1 more)

## Knowledge Gaps
- **6 isolated node(s):** `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss` (+1 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 127 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Layout, Fonts and Metadata` to `Skills Universe Figure`, `Sections, Icons and Contact`, `Tooling and Dependencies`, `Home Page and Timeline`, `Project Case Studies`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `@tailwindcss/postcss`, `@types/node`, `@types/react` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Skills Universe Figure` be split into smaller, more focused modules?**
  _Cohesion score 0.060451977401129946 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Layout, Fonts and Metadata` to `Skills Universe Figure`, `Sections, Icons and Contact`, `Tooling and Dependencies`, `Project Case Studies`, `Palette and Social Card`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `Layout, Fonts and Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.07922077922077922 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Layout, Fonts and Metadata` to `Sections, Icons and Contact`, `Tooling and Dependencies`, `Home Page and Timeline`, `Project Case Studies`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `Sections, Icons and Contact` be split into smaller, more focused modules?**
  _Cohesion score 0.11378353376503238 - nodes in this community are weakly interconnected._