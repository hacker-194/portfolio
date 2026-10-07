"use client";

import type { Transition, Variants } from "motion/react";

/** Signature easing used across the whole site. */
export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;
export const EASE_SWIFT = [0.4, 0, 0.2, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 0.7,
};

export const springSnap: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 26,
  mass: 0.5,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_CINEMATIC },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_CINEMATIC } },
};

/** Standard viewport config so sections reveal consistently. */
export const viewportOnce = { once: true, margin: "-12% 0px -12% 0px" } as const;
