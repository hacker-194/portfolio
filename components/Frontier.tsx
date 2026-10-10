"use client";

import { motion } from "motion/react";
import { Boxes } from "lucide-react";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { FRONTIER_PILLARS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

export function Frontier() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <section
      id="frontier"
      className="relative overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="05"
          eyebrow="Current frontier"
          title={["Generative and", "agentic systems are", "where I'm heading."]}
          description="This isn't shipped production work. It's the direction I'm studying: language models as a reasoning core, wrapped in retrieval, tools and an execution loop."
        />

        {/* Pipeline */}
        <Reveal y={30} className="mx-auto mt-16 max-w-3xl lg:mt-20">
          <div className="glass-card hairline relative overflow-hidden rounded-2xl border p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <span className="label-mono text-volt">Intelligence pipeline</span>
              <span className="label-mono text-muted">06 stages</span>
            </div>
            <PipelineDiagram />
          </div>
        </Reveal>

        {/* Pillars */}
        <div className="shadow-lux mt-14 grid gap-px overflow-hidden rounded-2xl border border-bright/15 bg-bright/5 sm:grid-cols-2 lg:grid-cols-3">
          {FRONTIER_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.label}
              className="group relative bg-void p-7 transition-colors duration-500 hover:bg-panel2/60"
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
                  className="h-4 w-4 text-accent transition-colors duration-500 group-hover:text-volt"
                  strokeWidth={1.7}
                />
                <span className="label-mono text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-display text-base font-semibold leading-tight text-bright">
                {pillar.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {pillar.note}
              </p>
              <span
                className="accent-gradient absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                aria-hidden
              />
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-8">
          <p className="text-sm text-muted">Actively studying these</p>
        </Reveal>
      </div>
    </section>
  );
}
