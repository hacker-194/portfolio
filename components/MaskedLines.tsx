"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MaskedLinesProps = {
  lines: readonly string[];
  /** Drive the reveal from outside (e.g. once the intro curtain clears). */
  active?: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
  lineClassName?: string;
  /** Wrap each line so it can be styled individually. */
  renderLine?: (line: string, index: number) => React.ReactNode;
};

/**
 * Cinematic masked-text reveal: each line slides up out of its own clip box.
 */
export function MaskedLines({
  lines,
  active = true,
  delay = 0,
  stagger = 0.09,
  className,
  lineClassName,
  renderLine,
}: MaskedLinesProps) {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <span className={cn("block", className)}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            initial={reduce ? false : { y: "118%", opacity: 0 }}
            animate={active ? { y: "0%", opacity: 1 } : { y: "118%", opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 1.05,
              ease: EASE_CINEMATIC,
              delay: reduce ? 0 : delay + index * stagger,
            }}
          >
            {renderLine ? renderLine(line, index) : line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
