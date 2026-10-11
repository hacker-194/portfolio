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
 * - `PALETTE` is the page: obsidian black under deep navy, platinum white ink,
 *   and one electric cyan carrying every interactive accent. `bright` is the
 *   lightest value, because on a dark ground primary text is light.
 * - `PALETTE_DEEP` is the well the hero and the open-source section sit in: the
 *   same roles pulled almost to black, with the blue lifted a step so it still
 *   reads against a darker ground.
 *
 * If a colour changes in `globals.css`, change it here too.
 */

export const PALETTE = {
  void: "#0b0d10",
  ink: "#0e1219",
  panel: "#111827",
  panel2: "#151d2e",
  panel3: "#1a2438",
  edge: "#24314a",
  indigo: "#0f1b2b",
  accent: "#64ffda",
  volt: "#9bf5e4",
  ice: "#dce6e4",
  muted: "#8993a4",
  soft: "#c9d0dc",
  bright: "#f5f5f0",
} as const;

/** The deeper rendition of the same roles, for the hero and open-source wells. */
export const PALETTE_DEEP = {
  void: "#05070a",
  ink: "#080b11",
  panel: "#0e131c",
  panel2: "#111a26",
  panel3: "#17222f",
  edge: "#1f2c42",
  indigo: "#08111f",
  accent: "#7cffe2",
  volt: "#b4fff0",
  ice: "#e4edea",
  muted: "#94a0b1",
  soft: "#cbd2de",
  bright: "#fcfcf9",
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
 * `"#64ffda"` → `"100, 255, 218"`.
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
