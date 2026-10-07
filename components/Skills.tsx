"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SKILL_GROUPS } from "@/lib/data";
import { radialGlow, tint } from "@/lib/palette";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";
import { SECTION_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Diameters of the three orbit rings, as a percentage of the stage. */
const RING_DIAMETERS = [100, 74, 48];

const RING_TEXT = [
  "PYTORCH · SCIKIT-LEARN · XGBOOST · NUMPY · PANDAS · ",
  "GENERATIVE AI · AGENTIC AI · LLMS · RAG · ",
  "FASTAPI · PYTHON · POSTGRESQL · GIT · LINUX · N8N · ",
];

/**
 * No progress bars, no invented proficiency numbers.
 *
 * The capability set is presented as an orbiting system: three rotating text
 * rings around a fixed core, with an interactive group index on the right that
 * expands into animated typography.
 */
export function Skills() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const [activeGroup, setActiveGroup] = useState(SKILL_GROUPS[0].id);

  return (
    <section
      id="skills"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-28 lg:py-36"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="06"
          eyebrow="Skills"
          title={["A capability set,", "not a scoreboard."]}
          description="No percentage bars — I would only be guessing. This is what I actually reach for, grouped the way I work."
        />

        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Orbital system */}
          <Reveal y={30} className="lg:col-span-6">
            <div className="group relative mx-auto aspect-square w-full max-w-[30rem]">
              {/* Halo */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: radialGlow("ember", 0.22, {
                    geometry: "circle at 50% 50%",
                    stop: 58,
                  }),
                }}
                aria-hidden
              />

              {/* Rings — the outer element centres, the inner one rotates, so the
                  rotation animation never clobbers the centring transform. */}
              {RING_DIAMETERS.map((size, index) => (
                <div
                  key={size}
                  className="absolute left-1/2 top-1/2 aspect-square"
                  style={{ width: `${size}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className="h-full w-full"
                    style={
                      reduce
                        ? undefined
                        : {
                            animationName: "orbit-spin",
                            animationDuration: `${52 + index * 18}s`,
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                            animationDirection:
                              index === 1 ? "reverse" : "normal",
                          }
                    }
                  >
                    <svg viewBox="0 0 200 200" className="h-full w-full">
                      <defs>
                        <path
                          id={`ring-path-${index}`}
                          d="M 100,100 m -84,0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0"
                          fill="none"
                        />
                      </defs>
                      <circle
                        cx="100"
                        cy="100"
                        r="84"
                        fill="none"
                        stroke={tint("bone", 0.08)}
                        strokeWidth="0.6"
                      />
                      <text
                        className="fill-mist/55 transition-colors duration-500 group-hover:fill-flare/70"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "8.4px",
                          letterSpacing: "1.6px",
                        }}
                      >
                        <textPath href={`#ring-path-${index}`} startOffset="0%">
                          {RING_TEXT[index]}
                        </textPath>
                      </text>
                    </svg>
                  </div>
                </div>
              ))}

              {/* Core */}
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
                <span className="font-display text-4xl font-bold tracking-tight text-bone sm:text-5xl">
                  KL
                  <span className="text-ember">.</span>
                </span>
                <span className="label-mono max-w-[7rem] text-ash/80">
                  AI / ML Engineering
                </span>
              </div>

              {/* Tick marks */}
              <div className="pointer-events-none absolute inset-0 rounded-full border border-white/[0.05]" aria-hidden />
              <div className="pointer-events-none absolute inset-[13%] rounded-full border border-white/[0.04]" aria-hidden />
              <div className="pointer-events-none absolute inset-[26%] rounded-full border border-white/[0.04]" aria-hidden />
            </div>
          </Reveal>

          {/* Group index */}
          <div className="lg:col-span-6">
            <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-white/[0.07]">
              {SKILL_GROUPS.map((group, index) => {
                const isActive = activeGroup === group.id;
                return (
                  <motion.div
                    key={group.id}
                    className={cn(
                      "relative bg-void p-6 transition-colors duration-500 sm:p-7",
                      isActive ? "bg-umber/70" : "hover:bg-charcoal/60",
                    )}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{
                      duration: 0.6,
                      ease: EASE_CINEMATIC,
                      delay: index * 0.07,
                    }}
                    onPointerEnter={() => setActiveGroup(group.id)}
                    onFocus={() => setActiveGroup(group.id)}
                  >
                    <span
                      className={cn(
                        "ember-gradient absolute inset-y-0 left-0 w-px origin-top transition-transform duration-500",
                        isActive ? "scale-y-100" : "scale-y-0",
                      )}
                      aria-hidden
                    />

                    <button
                      type="button"
                      onClick={() => setActiveGroup(group.id)}
                      className="flex w-full items-baseline justify-between gap-5 text-left"
                      aria-expanded={isActive}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="label-mono text-ember/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "font-display text-[1.35rem] font-semibold tracking-tight transition-colors duration-500 sm:text-[1.6rem]",
                            isActive ? "text-bone" : "text-mist/60",
                          )}
                        >
                          {group.title}
                        </span>
                      </span>
                      <span className="label-mono shrink-0 text-right text-ash/60">
                        {group.learning ? "learning" : group.caption}
                      </span>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isActive ? "auto" : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-x-6 gap-y-3 pt-5">
                        {group.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skill}
                            className="font-display text-[1.05rem] font-medium tracking-tight text-mist sm:text-[1.25rem]"
                            initial={false}
                            animate={
                              isActive
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 10 }
                            }
                            transition={{
                              duration: 0.5,
                              ease: EASE_CINEMATIC,
                              delay: isActive ? 0.06 + skillIndex * 0.045 : 0,
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <Reveal delay={0.1} className="mt-6">
              <p className="font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.14em] text-ash/55">
                GenAI · Agentic AI · RAG are marked as learning because that is
                exactly where they sit today.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
