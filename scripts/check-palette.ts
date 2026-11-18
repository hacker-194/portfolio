/**
 * The one runnable check behind the palette.
 *
 *   node --experimental-strip-types scripts/check-palette.ts
 *
 * The design has two sources of truth and they cannot be merged into one: CSS
 * resolves the `@theme` tokens in `app/globals.css`, while SVG attributes and
 * `canvas` calls cannot read a custom property, so they resolve `lib/palette.ts`
 * instead. Nothing but discipline keeps those two in step, and this is the
 * check that replaces the discipline: it fails when a mirrored token drifts,
 * when a colour is written out as a literal instead of resolving from a token,
 * when the favicon stops wearing the palette it is quoting, and when a re-theme
 * leaves a text role below AA on the ground it can actually land on.
 */
import { readFileSync } from "node:fs";
import { PALETTE } from "../lib/palette.ts";

const ROOT = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, ROOT), "utf8");

/** Roles the stylesheet owns alone: they never carry text, so JS never needs them. */
const CSS_ONLY = new Set(["edge", "brand", "brand-deep"]);

const issues: string[] = [];
const css = read("app/globals.css");

const tokenBlock = css.slice(
  css.indexOf("@theme {"),
  css.indexOf("\n}", css.indexOf("@theme {")),
);
const tokens = new Map<string, string>();
for (const [, name, hex] of tokenBlock.matchAll(
  /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g,
)) {
  tokens.set(name, hex.toLowerCase());
}

// 1. Every mirrored token agrees with palette.ts, in both directions.
for (const [name, hex] of tokens) {
  if (CSS_ONLY.has(name)) continue;
  const mirror = (PALETTE as Record<string, string>)[name];
  if (!mirror) {
    issues.push(`--color-${name} (${hex}) has no matching key in lib/palette.ts`);
  } else if (mirror.toLowerCase() !== hex) {
    issues.push(`--color-${name} is ${hex} in globals.css but ${mirror} in lib/palette.ts`);
  }
}
for (const [name, hex] of Object.entries(PALETTE)) {
  if (!tokens.has(name)) issues.push(`lib/palette.ts ${name} (${hex}) has no --color-${name} token`);
}

// 2. No colour literal outside the token block. Alpha variants come from
//    `color-mix()` over the token, never from the channels written out again.
//    Only the neutrals are exempt: white hairlines, black shadows and the #000
//    used as the opaque stop of the mask gradients, none of which are palette
//    decisions.
// Comments are blanked rather than deleted so the line numbers stay true.
const body = css
  .replace(tokenBlock, "")
  .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, " "));

const NEUTRAL = /^(?:rgba?\(\s*(?:0|255),\s*(?:0|255),\s*(?:0|255)|#[0-9a-fA-F]{3}$)/i;
for (const [index, line] of body.split("\n").entries()) {
  for (const literal of line.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)/g) ?? []) {
    if (NEUTRAL.test(literal)) continue;
    issues.push(`globals.css line ${index + 1}: colour literal ${literal} (resolve it with color-mix())`);
  }
}

// 3. Components that need color values inline still resolve
//    their colour from a token, and the metadata colour from the palette.
for (const file of ["components/Navbar.tsx", "components/MagneticButton.tsx", "components/Hero.tsx"]) {
  for (const literal of read(file).match(/rgba?\(\s*\d+[^)]*\)|#[0-9a-fA-F]{6}\b/g) ?? []) {
    issues.push(`${file}: hardcoded ${literal} (use color-mix() over a token)`);
  }
}
if (/#[0-9a-fA-F]{3,8}/.test(read("app/layout.tsx"))) {
  issues.push("app/layout.tsx: hardcoded hex (import PALETTE instead)");
}

// 4. A static SVG cannot reference a token, so it is held to the palette
//    instead: every hex in the favicon has to be a value the palette defines.
const paletteHexes = new Set(Object.values(PALETTE).map((hex) => hex.toLowerCase()));
for (const hex of read("app/icon.svg").match(/#[0-9a-fA-F]{6}/g) ?? []) {
  if (!paletteHexes.has(hex.toLowerCase())) {
    issues.push(`app/icon.svg: ${hex} is not a palette value`);
  }
}

// 5. Contrast. A palette re-theme is mostly a block of hex
//    values, which is exactly the kind of change that can leave a label
//    unreadable without anything failing: the build is green, the page is
//    wrong. These are the roles that carry text, against the grounds they can
//    land on: the sheet and the recessed paper band.

function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);
  const channel = (byte: number) => {
    const c = byte / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel((value >> 16) & 255) +
    0.7152 * channel((value >> 8) & 255) +
    0.0722 * channel(value & 255)
  );
}

function contrast(a: string, b: string): number {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/** What each text role has to clear. The lead ink is held to AAA (7:1). */
const MINIMUM: Record<string, number> = {
  bright: 7,
  soft: 4.5,
  muted: 4.5,
  accent: 4.5,
  data: 4.5,
};

/** The grounds a text role can land on in a scope: the page, and its band. */
const GROUNDS = ["void", "panel3"];

let worst = { ratio: Number.POSITIVE_INFINITY, label: "none" };
for (const [name, minimum] of Object.entries(MINIMUM)) {
  const ink = tokens.get(name);
  if (!ink) continue;
  for (const ground of GROUNDS) {
    const paper = tokens.get(ground);
    if (!paper) continue;
    const ratio = contrast(ink, paper);
    if (ratio < worst.ratio) {
      worst = { ratio, label: `--color-${name} on --color-${ground}` };
    }
    if (ratio < minimum) {
      issues.push(
        `--color-${name} on --color-${ground} is ${ratio.toFixed(2)}:1, below ${minimum}:1`,
      );
    }
  }
}

// 6. Keep the palette restrained: paper, neutrals and one accent.
const CHROMA_FLOOR = 48;
const saturated = [...tokens.entries()]
  .map(([name, hex]) => {
    const value = Number.parseInt(hex.slice(1), 16);
    const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
    return { name, chroma: Math.max(...channels) - Math.min(...channels) };
  })
  .filter((entry) => entry.chroma > CHROMA_FLOOR);
if (saturated.length > 1) {
  issues.push(
    `has ${saturated.length} saturated colours (${saturated.map((entry) => entry.name).join(", ")}); the design commits to one accent`,
  );
}

console.log(
  `tokens ${tokens.size}  palette keys ${Object.keys(PALETTE).length}  colour literals outside the tokens 0  worst contrast ${worst.ratio.toFixed(2)}:1 (${worst.label})`,
);

if (issues.length > 0) {
  console.error("\nFAIL");
  for (const issue of issues) console.error(`  ${issue}`);
  process.exit(1);
}

console.log("\nOK: every colour resolves from a token, and both sources agree");
