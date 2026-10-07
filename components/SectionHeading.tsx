"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { MaskedLines } from "@/components/MaskedLines";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string[];
  description?: string;
  className?: string;
  titleClassName?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  align = "left",
}: SectionHeadingProps) {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
        className,
      )}
    >
      <motion.div
        className="flex w-full items-center gap-4"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE_CINEMATIC }}
      >
        <span className="label-mono text-ember/80">{index}</span>
        <span className="label-mono text-ash">{eyebrow}</span>
        <span
          className="hairline h-px flex-1 border-t bg-gradient-to-r from-white/12 to-transparent"
          aria-hidden
        />
      </motion.div>

      <h2
        className={cn(
          "display-tight max-w-4xl text-[clamp(2.1rem,5.4vw,4.4rem)] font-semibold text-bone",
          titleClassName,
        )}
      >
        <MaskedLines lines={title} stagger={0.11} />
      </h2>

      {description ? (
        <motion.p
          className={cn(
            "max-w-2xl text-[0.98rem] leading-relaxed text-ash sm:text-[1.05rem]",
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
