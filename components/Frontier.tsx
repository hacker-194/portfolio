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
          eyebrow="AI Architecture"
          title={["Generative and agentic", "system design."]}
          description="Investigating language models as reasoning cores, augmented with vector retrieval, external tools, and autonomous execution loops."
        />

        {/* Pipeline */}
        <Reveal y={24} className="mx-auto mt-14 max-w-3xl lg:mt-18">
          <div className="rounded-2xl border border-bright/10 bg-panel/60 p-6 backdrop-blur-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Intelligence Pipeline</span>
              <span className="text-xs font-mono text-muted">6 Core Stages</span>
            </div>
            <PipelineDiagram />
          </div>
        </Reveal>

        {/* Pillars */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FRONTIER_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.label}
              className="group relative rounded-xl border border-bright/10 bg-panel/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-panel2"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: 0.5,
                ease: EASE_CINEMATIC,
                delay: (index % 3) * 0.05,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/25 bg-accent/10">
                  <Boxes
                    className="h-4 w-4 text-accent"
                    strokeWidth={1.8}
                  />
                </span>
                <h3 className="font-display text-base font-semibold text-bright">
                  {pillar.label}
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                {pillar.note}
              </p>
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
