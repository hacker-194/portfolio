"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion } from "motion/react";
import { Boxes } from "lucide-react";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { FRONTIER_PILLARS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { useCoarsePointer, useInViewport, useStillMotion } from "@/lib/hooks";
import { gradientLayers, radialGlow } from "@/lib/palette";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

const NeuralNetwork = dynamic(
  () => import("@/components/NeuralNetwork").then((mod) => mod.NeuralNetwork),
  {
    ssr: false,
    loading: () => <NetworkPlaceholder />,
  },
);

function NetworkPlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center">
      <span className="label-mono animate-pulse text-ash/60">
        Initialising graph…
      </span>
    </div>
  );
}

export function Frontier() {
  const stage = useRef<HTMLDivElement | null>(null);
  const { inView, seen } = useInViewport(stage, "120px");
  const coarse = useCoarsePointer();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <section
      id="frontier"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-28 lg:py-36"
    >
      {/* This section is intentionally lit differently from the project grid. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: gradientLayers(
            radialGlow("ember", 0.13, {
              geometry: "70% 60% at 74% 30%",
              stop: 60,
            }),
            radialGlow("rust", 0.2, {
              geometry: "60% 50% at 12% 76%",
              stop: 62,
            }),
          ),
        }}
        aria-hidden
      />
      <div className="tech-grid tech-grid-fade pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="04"
          eyebrow="Current frontier"
          title={["Generative and", "agentic systems are", "where I am heading."]}
          description="Not shipped production work — this is the direction I am actively studying. The pipeline below is the mental model I build against: language models as a reasoning core wrapped in retrieval, tools and an execution loop."
        />

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          {/* Pipeline */}
          <Reveal y={30} className="lg:col-span-5">
            <div className="glass-panel hairline relative overflow-hidden rounded-2xl border p-6 sm:p-8">
              <div className="mb-7 flex items-center justify-between">
                <span className="label-mono text-flare">Intelligence pipeline</span>
                <span className="label-mono text-ash/60">06 stages</span>
              </div>
              <PipelineDiagram />
            </div>
          </Reveal>

          {/* 3D network */}
          <Reveal y={30} delay={0.1} className="lg:col-span-7">
            <div
              ref={stage}
              className="relative h-[380px] overflow-hidden rounded-2xl sm:h-[460px] lg:h-[600px]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cocoa/40 via-charcoal/60 to-void" />
              <div
                className="animate-sheen pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: radialGlow("ember", 0.2) }}
                aria-hidden
              />

              {/* Mounted once and then paused off screen — never unmounted,
                  which keeps the WebGL context (and drei's DOM portals) stable. */}
              {seen && !reduce ? (
                <NeuralNetwork
                  className="absolute inset-0"
                  running={inView}
                />
              ) : (
                <NetworkPlaceholder />
              )}

              <div className="hairline pointer-events-none absolute inset-0 rounded-2xl border" aria-hidden />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 px-5 pb-5">
                <span className="label-mono text-ash/70">
                  Neural graph · live
                </span>
                <span className="label-mono hidden text-ash/50 sm:inline">
                  Drag-free · reacts to pointer
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Pillars */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
          {FRONTIER_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.label}
              className="group relative bg-void p-7 transition-colors duration-500 hover:bg-umber/60"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: 0.6,
                ease: EASE_CINEMATIC,
                delay: (index % 3) * 0.07,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <Boxes
                  className="h-4 w-4 text-ember/70 transition-colors duration-500 group-hover:text-flare"
                  strokeWidth={1.7}
                />
                <span className="label-mono text-ash/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-display text-[1.15rem] font-semibold leading-tight text-bone">
                {pillar.label}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-ash">
                {pillar.note}
              </p>
              <span
                className="ember-gradient absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ash/60">
            Status · actively learning — listed as direction, not delivered work
          </p>
        </Reveal>
      </div>
    </section>
  );
}
