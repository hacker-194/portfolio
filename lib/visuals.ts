import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Which schematic each project draws, and which ink labels it.
 *
 * Lives here rather than in either component because the project card and the
 * case-study page are two renderings of the same material: if the map stayed
 * inside the card, the page would either duplicate it or silently disagree with
 * it.
 */

export type VisualVariant = "api" | "analysis" | "models";

export const VISUAL: Record<string, VisualVariant> = {
  "insurance-api": "api",
  "hr-analytics": "analysis",
  "invoice-intelligence": "models",
};

export const ACCENT_CLASS: Record<Project["accent"], string> = {
  accent: "text-accent",
  volt: "text-volt",
  ice: "text-ice",
};

/**
 * The chip: one shape for every technology and skill the page names.
 *
 * The project card's stack, the case study's stack and the universe's
 * connection chips are three renderings of one idea. They used to be three
 * near-identical class lists, which is how a system grows thirteen button
 * styles without anyone deciding to. Written out in full rather than assembled,
 * so Tailwind still sees every name as a literal.
 */
export const CHIP =
  "inline-flex items-center rounded-[2px] border border-bright/15 bg-bright/5 px-2.5 py-1.5 font-mono text-xs tracking-wide text-soft";

/** A chip that can be pressed. Same shape, with a pointer and focus state. */
export const CHIP_BUTTON = cn(
  CHIP,
  "transition-colors duration-300 hover:border-accent/45 hover:text-bright",
);

/**
 * The same chip at reading size, for the list a reader works through rather
 * than scans: the skills in the universe's index. The container is what says
 * "pressable", so the face can stay display type.
 */
export const CHIP_BUTTON_LARGE =
  "inline-flex items-center rounded-[2px] border border-bright/15 bg-bright/5 px-3 py-1.5 font-display text-base font-medium tracking-tight text-soft transition-colors duration-300 hover:border-accent/45 hover:text-bright sm:text-lg";
