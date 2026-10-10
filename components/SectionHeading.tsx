"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { MaskedLines } from "@/components/MaskedLines";
import { Scramble } from "@/components/Scramble";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  /** Kept for callers that still pass a section name; no longer printed. */
  eyebrow?: string;
  title: string[];
  description?: string;
  className?: string;
  titleClassName?: string;
  align?: "left" | "center";
  /**
   * Run the heading through the terminal decode.
   *
   * Off for the sections that carry credentials (About, Experience): there the
   * heading is a statement of fact rather than an entrance, so it sits still and
   * reads immediately instead of performing for a moment first.
   */
  decode?: boolean;
};

export function SectionHeading({
  index,
  title,
  description,
  className,
  titleClassName,
  align = "left",
  decode = true,
}: SectionHeadingProps) {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered && "items-center text-center",
        className,
      )}
    >
      {/* Folio rule: the section's place in the running order, set against a
          hairline rather than announced by a label above the heading. */}
      <motion.div
        className="flex w-full items-center gap-4"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE_CINEMATIC }}
      >
        <span className="font-mono text-sm tabular-nums text-muted">
          {index}
        </span>
        <span
          className="hairline h-px flex-1 border-t"
          aria-hidden
        />
      </motion.div>

      <h2
        className={cn(
          "display-tight max-w-4xl text-[clamp(1.9rem,4.4vw,3.4rem)] font-medium text-bright",
          titleClassName,
        )}
      >
        <MaskedLines
          lines={title}
          stagger={0.11}
          renderLine={(line, lineIndex) =>
            decode ? (
              <Scramble text={line} delay={240 + lineIndex * 110} />
            ) : (
              line
            )
          }
        />
      </h2>

      {description ? (
        <motion.p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-soft sm:text-base",
            centered && "mx-auto",
          )}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_CINEMATIC, delay: 0.18 }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
