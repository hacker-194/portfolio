"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index?: string;
  eyebrow?: string;
  title: string[];
  description?: string;
  className?: string;
  titleClassName?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  align = "left",
}: SectionHeadingProps) {
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
      {eyebrow ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
          className="flex items-center gap-3"
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            <span className="h-px w-7 bg-accent/70" aria-hidden />
            {eyebrow}
          </span>
        </motion.div>
      ) : null}

      <div
        className={cn(
          "grid gap-x-12 gap-y-4",
          centered ? "max-w-3xl" : "lg:grid-cols-12",
        )}
      >
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
          className={cn(
            "text-[clamp(2rem,3.8vw,3.25rem)] font-semibold leading-[1.15] tracking-tight text-bright",
            !centered && "lg:col-span-7",
            titleClassName,
          )}
        >
          {title.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h2>

        {description ? (
          <motion.p
            className={cn(
              "text-base leading-relaxed text-muted",
              centered
                ? "mx-auto max-w-2xl"
                : "lg:col-span-5 lg:col-start-8 lg:pt-2",
            )}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE_CINEMATIC, delay: 0.1 }}
          >
            {description}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
