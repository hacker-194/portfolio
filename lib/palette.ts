/**
 * The palette, as JavaScript sees it.
 *
 * These hex values mirror the `@theme` tokens in `app/globals.css`. They are
 * repeated here on purpose and only here: SVG attributes, Three.js materials and
 * `canvas` gradients cannot resolve a CSS custom property, so anything drawn
 * outside of CSS resolves its colour from this module rather than from a literal
 * buried in a component.
 *
 * If a colour changes in `globals.css`, change it here too.
 */

export const PALETTE = {
  void: "#050403",
  obsidian: "#0a0807",
  charcoal: "#121010",
  umber: "#1a1310",
  cocoa: "#241a15",
  rust: "#7f2d11",
  burnt: "#c25b19",
  ember: "#fd7c02",
  flare: "#fba915",
  gold: "#fdd967",
  ash: "#9c8f86",
  mist: "#cfc6bd",
  bone: "#f7f2ec",
} as const;

export type PaletteColor = keyof typeof PALETTE;

/**
 * `"#fd7c02"` → `"253, 124, 2"`.
 *
 * Deriving the channels keeps alpha variants from drifting away from the hex
 * value they are supposed to match.
 */
function channels(hex: string): string {
  const value = Number.parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

const CHANNELS = Object.fromEntries(
  Object.entries(PALETTE).map(([name, hex]) => [name, channels(hex)]),
) as Record<PaletteColor, string>;

/**
 * `rgba()` string for a palette colour.
 *
 * Valid everywhere a colour string is accepted — inline styles, SVG
 * attributes, `boxShadow` and canvas `addColorStop`.
 */
export function tint(color: PaletteColor, alpha: number): string {
  return `rgba(${CHANNELS[color]}, ${alpha})`;
}

type RadialGlowOptions = {
  /** Radial shape, size and position, e.g. `"circle at 50% 50%"`. */
  geometry?: string;
  /** Distance at which the glow has fully faded out, in percent. */
  stop?: number;
};

/** One `radial-gradient` layer that fades a palette colour to nothing. */
export function radialGlow(
  color: PaletteColor,
  alpha: number,
  { geometry = "circle", stop = 66 }: RadialGlowOptions = {},
): string {
  return `radial-gradient(${geometry}, ${tint(color, alpha)} 0%, transparent ${stop}%)`;
}

/** Joins gradient layers into a single `background` value. */
export function gradientLayers(...layers: string[]): string {
  return layers.join(", ");
}
