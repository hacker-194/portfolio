/**
 * The palettes, as JavaScript sees them.
 *
 * These hex values mirror the `@theme` tokens and the `.on-deep` scope in
 * `app/globals.css`. They are repeated here on purpose and only here: SVG
 * attributes and `canvas` gradients cannot resolve a CSS custom property, so
 * anything drawn outside of CSS resolves its colour from this module rather
 * than from a literal buried in a component.
 *
 * Two worlds share one set of token names:
 *
 * - `PALETTE` is the page: a near-black navy ground, near-white ink, and one
 *   muted electric blue carrying every accent. `bright` is the lightest value,
 *   because on a dark ground primary text is light.
 * - `PALETTE_DEEP` is the well the hero and the open-source section sit in: the
 *   same roles pulled almost to black, with the blue lifted a step so it still
 *   reads against a darker ground.
 *
 * If a colour changes in `globals.css`, change it here too.
 */

export const PALETTE = {
  void: "#04060c",
  ink: "#070b14",
  panel: "#0a101c",
  panel2: "#0e1524",
  panel3: "#141d2e",
  edge: "#1e2a40",
  indigo: "#16224a",
  accent: "#4d8dff",
  volt: "#86b4ff",
  ice: "#cbd8ec",
  muted: "#8792a6",
  soft: "#c2cbda",
  bright: "#f4f7fc",
} as const;

/** The deeper rendition of the same roles, for the hero and open-source wells. */
export const PALETTE_DEEP = {
  void: "#000206",
  ink: "#020409",
  panel: "#05080f",
  panel2: "#080d17",
  panel3: "#0c1320",
  edge: "#16233a",
  indigo: "#060e28",
  accent: "#6ba4ff",
  volt: "#9cc2ff",
  ice: "#dce5f2",
  muted: "#8d9ab0",
  soft: "#c6d0e0",
  bright: "#fbfcff",
} as const;

export type PaletteColor = keyof typeof PALETTE;

function channels(hex: string): string {
  const value = Number.parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function buildChannelMap(source: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(source).map(([name, hex]) => [name, channels(hex)]),
  ) as Record<PaletteColor, string>;
}

const CHANNELS = buildChannelMap(PALETTE);
const DEEP_CHANNELS = buildChannelMap(PALETTE_DEEP);

/**
 * `"#4d8dff"` → `"77, 141, 255"`.
 *
 * Deriving the channels keeps alpha variants from drifting away from the hex
 * value they are supposed to match.
 */
export function tint(color: PaletteColor, alpha: number): string {
  return `rgba(${CHANNELS[color]}, ${alpha})`;
}

/** `tint` against the dark-panel palette. */
export function tintDeep(color: PaletteColor, alpha: number): string {
  return `rgba(${DEEP_CHANNELS[color]}, ${alpha})`;
}
