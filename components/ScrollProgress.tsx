"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useStillMotion } from "@/lib/hooks";

/** Hairline progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.35,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="ember-gradient fixed left-0 top-0 z-[70] h-[2px] w-full origin-left"
    />
  );
}
