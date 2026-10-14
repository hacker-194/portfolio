/**
 * The palettes, as JavaScript sees them.
 *
 * These hex values mirror the `@theme` tokens in `app/globals.css`. They are
 * repeated here on purpose and only here: SVG attributes and `canvas` gradients
 * cannot resolve a CSS custom property, so anything drawn outside of CSS
 * resolves its colour from this module rather than from a literal buried in a
 * component.
 *
 * `PALETTE` is the sheet: warm paper, charcoal ink, and oxblood for interactive
 * accents. `data` is a reserved blue-green used only on measured numbers
 * (activity, metrics). `bright` is the darkest value, because on paper primary text is
 * ink; `volt` and `ice` are the drawing inks, and they are darker still than
 * the type rather than lighter, since the paper is the light source. Nothing
 * is drawn inside the deep panels (the hero and open-source plates), so the
 * inverted rendition of these roles exists only as CSS, in the `.panel-deep`
 * scope.
 *
 * If a colour changes in `globals.css`, change it here too.
 */

export const PALETTE = {
  void: "#f4f1eb",
  ink: "#ebe7df",
  panel: "#fffdf9",
  panel2: "#f8f5ef",
  panel3: "#e7e1d7",
  edge: "#d5cec2",
  indigo: "#292521",
  accent: "#873f36",
  data: "#426d69",
  volt: "#71685d",
  ice: "#ded8cd",
  muted: "#68635b",
  soft: "#4c4740",
  bright: "#211e1a",
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
 * `"#873f36"` → `"135, 63, 54"`.
 *
 * Deriving the channels keeps alpha variants from drifting away from the hex
 * value they are supposed to match.
 */
export function tint(color: PaletteColor, alpha: number): string {
  return `rgba(${CHANNELS[color]}, ${alpha})`;
}
