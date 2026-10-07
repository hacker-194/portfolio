"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { FlaskConical, Sparkles } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  CONSTELLATION_LINKS,
  RESEARCH_TOPICS,
  RESEARCH_WORK,
} from "@/lib/data";
import { PALETTE, radialGlow, tint } from "@/lib/palette";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";
import { SECTION_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";

const SIZE: Record<number, string> = {
  0: "border-white/12 text-mist/80",
  1: "border-flare/25 text-mist",
  2: "border-ember/50 text-bone",
};

export function Research() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const [active, setActive] = useState<string | null>(null);

  /** Topic ids connected to the hovered node, plus the node itself. */
  const highlighted = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    for (const [a, b] of CONSTELLATION_LINKS) {
      if (a === active) set.add(b);
      if (b === active) set.add(a);
    }
    return set;
  }, [active]);

  const positionOf = (id: string) => {
    const topic = RESEARCH_TOPICS.find((item) => item.id === id);
    return topic ? { x: topic.x, y: topic.y } : { x: 0, y: 0 };
  };

  return (
    <section
      id="research"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-28 lg:py-36"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="05"
          eyebrow="Research"
          title={["Questions I keep", "coming back to."]}
          description="Eight threads I read, prototype and write around. Hover or focus any node to see how they connect."
        />

        <Reveal y={30} className="mt-16 lg:mt-20">
          <div className="glass-panel hairline relative overflow-hidden rounded-2xl border">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background: radialGlow("ember", 0.12, {
                  geometry: "60% 60% at 50% 50%",
                }),
              }}
              aria-hidden
            />
            <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />

            {/* Constellation */}
            <div
              className="relative h-[430px] w-full sm:h-[480px] lg:h-[560px]"
              onPointerLeave={() => setActive(null)}
            >
              {/* Links */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                {CONSTELLATION_LINKS.map(([from, to]) => {
                  const a = positionOf(from);
                  const b = positionOf(to);
                  const isActive =
                    active !== null && (from === active || to === active);
                  const dim = highlighted !== null && !isActive;
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={isActive ? PALETTE.flare : tint("bone", 0.16)}
                      strokeWidth={isActive ? 1.4 : 1}
                      strokeDasharray={isActive ? "3 4" : undefined}
                      vectorEffect="non-scaling-stroke"
                      opacity={dim ? 0.18 : 1}
                      style={{
                        transition: "opacity 300ms ease, stroke 300ms ease",
                        animation:
                          isActive && !reduce
                            ? "dash-flow 5s linear infinite"
                            : undefined,
                      }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {RESEARCH_TOPICS.map((topic, index) => {
                const isActive = active === topic.id;
                const dim =
                  highlighted !== null && !highlighted.has(topic.id);
                return (
                  <motion.button
                    key={topic.id}
                    type="button"
                    onPointerEnter={() => setActive(topic.id)}
                    onFocus={() => setActive(topic.id)}
                    onBlur={() => setActive(null)}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-void/80 px-3.5 py-2 backdrop-blur-sm transition-all duration-300",
                      SIZE[topic.weight],
                      isActive && "border-flare bg-flare/10 text-bone",
                      dim && "opacity-35",
                    )}
                    style={{ left: `${topic.x}%`, top: `${topic.y}%` }}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                    viewport={viewportOnce}
                    transition={{
                      duration: 0.6,
                      ease: EASE_CINEMATIC,
                      delay: index * 0.06,
                    }}
                  >
                    <span
                      className={cn(
                        "pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                      style={{ background: radialGlow("ember", 0.35, { stop: 68 }) }}
                      aria-hidden
                    />
                    <span className="relative whitespace-nowrap font-display text-[0.62rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.72rem]">
                      {topic.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Ongoing research */}
        <Reveal y={28} delay={0.1} className="mt-8">
          <div className="hairline relative overflow-hidden rounded-2xl border bg-umber/40 p-7 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <span className="hairline grid h-11 w-11 shrink-0 place-items-center rounded-full border bg-white/[0.03]">
                  <FlaskConical className="h-5 w-5 text-flare" strokeWidth={1.6} />
                </span>
                <div>
                  <span className="label-mono inline-flex items-center gap-2 text-ember/80">
                    <Sparkles className="h-3 w-3" strokeWidth={2} />
                    {RESEARCH_WORK.status} · Research work
                  </span>
                  <h3 className="mt-3 max-w-3xl font-display text-[1.15rem] font-semibold leading-snug text-bone sm:text-[1.5rem]">
                    {RESEARCH_WORK.title}
                  </h3>
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-[0.95rem] leading-relaxed text-ash">
              {RESEARCH_WORK.summary}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <span className="label-mono text-ash/70">Models</span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {RESEARCH_WORK.methods.map((method) => (
                    <span
                      key={method}
                      className="hairline rounded-md border bg-white/[0.03] px-2.5 py-1.5 font-mono text-[0.68rem] tracking-wide text-mist/85"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="label-mono text-ash/70">Interpretability</span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {RESEARCH_WORK.tools.map((tool) => (
                    <span
                      key={tool}
                      className="hairline rounded-md border bg-white/[0.03] px-2.5 py-1.5 font-mono text-[0.68rem] tracking-wide text-mist/85"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
