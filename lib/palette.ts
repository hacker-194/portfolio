/**
 * The palettes, as JavaScript sees them.
 *
 * These hex values mirror the `@theme` tokens in `app/globals.css`. They are
 * repeated here on purpose and only here: SVG attributes and `canvas` gradients
 * cannot resolve a CSS custom property, so anything drawn outside of CSS
 * resolves its colour from this module rather than from a literal buried in a
 * component.
 *
 * `PALETTE` is the sheet: warm paper, charcoal ink, and one muted slate accent.
 * The remaining colors are quiet neutrals used for diagrams and secondary data.
 *
 * If a colour changes in `globals.css`, change it here too.
 */

export const PALETTE = {
  void: "#f6f5f1",
  ink: "#eeede8",
  panel: "#fffefa",
  panel2: "#f1f0eb",
  panel3: "#e7e6df",
  edge: "#d7d8d2",
  indigo: "#262621",
  accent: "#344a57",
  data: "#344a57",
  volt: "#625f58",
  ice: "#d9d5cb",
  muted: "#62625e",
  soft: "#45443e",
  bright: "#211f1a",
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
 * `"#344a57"` → `"52, 74, 87"`.
 *
 * Deriving the channels keeps alpha variants from drifting away from the hex
 * value they are supposed to match.
 */
export function tint(color: PaletteColor, alpha: number): string {
  return `rgba(${CHANNELS[color]}, ${alpha})`;
}
