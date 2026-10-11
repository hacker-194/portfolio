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
 * - `PALETTE` is the page: obsidian black under midnight navy, soft white ink,
 *   and one ice blue carrying every interactive accent. `bright` is the
 *   lightest value, because on a dark ground primary text is light.
 * - `PALETTE_DEEP` is the well the hero and the open-source section sit in: the
 *   same roles pulled almost to black, with the blue lifted a step so it still
 *   reads against a darker ground.
 *
 * If a colour changes in `globals.css`, change it here too.
 */

export const PALETTE = {
  void: "#08090c",
  ink: "#0b0d12",
  panel: "#101827",
  panel2: "#141c2b",
  panel3: "#192337",
  edge: "#26334a",
  indigo: "#0d1a2e",
  accent: "#8be9fd",
  volt: "#b7f2fe",
  ice: "#dce4ee",
  muted: "#8d97a8",
  soft: "#c8d0da",
  bright: "#f5f7fa",
} as const;

/** The deeper rendition of the same roles, for the hero and open-source wells. */
export const PALETTE_DEEP = {
  void: "#050609",
  ink: "#08090e",
  panel: "#0d141f",
  panel2: "#101827",
  panel3: "#16202f",
  edge: "#1f2c40",
  indigo: "#081426",
  accent: "#a6eeff",
  volt: "#c6f5ff",
  ice: "#e4eaf2",
  muted: "#96a0b0",
  soft: "#cdd5df",
  bright: "#fafbfd",
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

/**
 * `"#8be9fd"` → `"139, 233, 253"`.
 *
 * Deriving the channels keeps alpha variants from drifting away from the hex
 * value they are supposed to match.
 */
export function tint(color: PaletteColor, alpha: number): string {
  return `rgba(${CHANNELS[color]}, ${alpha})`;
}
