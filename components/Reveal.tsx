"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  /** 0 → 1 opacity start. */
  from?: number;
  duration?: number;
  once?: boolean;
};

/** Fades + lifts its children into view on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  from = 0,
  duration = 0.9,
  once = true,
}: RevealProps) {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: from, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={once ? viewportOnce : { margin: "-10% 0px -10% 0px" }}
      transition={{
        duration: reduce ? 0 : duration,
        ease: EASE_CINEMATIC,
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
