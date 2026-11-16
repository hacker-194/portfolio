"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Boxes } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { FRONTIER_PILLARS, LEARNING } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

/**
 * Study.
 *
 * One section for the ongoing learning, because three separate sections used to
 * say the same thing: the reading list, the direction pillars and a generic
 * pipeline diagram. The citations here are other people's work, so the section
 * claims no authorship, and nothing in it is presented as shipped.
 */
export function Research() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <section
      id="research"
      className="relative overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          eyebrow="Studying"
          title={["What I am learning."]}
          description="Papers, tools and ideas I am working through. None of it is shipped work yet."
        />

        {/* Reading list */}
        <div className="mt-14 lg:mt-18">
          <div className="flex items-center justify-between border-b border-bright/10 pb-4 text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider text-muted">
              Reading list
            </span>
            <span className="font-mono">{LEARNING.length} Publications</span>
          </div>

          <ul className="flex flex-col divide-y divide-bright/10">
            {LEARNING.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} y={12}>
                <li className="grid gap-4 py-6 transition-colors hover:bg-bright/[0.02] md:grid-cols-12 md:items-baseline">
                  <div className="md:col-span-7">
                    <h3 className="font-display text-base font-semibold leading-snug text-bright sm:text-lg">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group/link inline-flex items-baseline gap-2 transition-colors hover:text-accent"
                        >
                          {item.title}
                          <ArrowUpRight
                            className="h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent"
                            strokeWidth={2}
                          />
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    {item.source ? (
                      <p className="mt-1 text-sm text-muted">{item.source}</p>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <span className="rounded-full border border-bright/10 bg-panel px-3 py-1 font-mono text-xs text-soft">
                      {item.topic}
                    </span>
                  </div>

                  <div className="md:col-span-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-0.5 font-mono text-[0.8125rem] text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                      {item.status}
                    </span>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {item.notes.map((note) => (
                        <li
                          key={note}
                          className="rounded border border-bright/10 bg-ink px-2 py-0.5 text-xs text-muted"
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Directions */}
        <div className="mt-14 border-t border-bright/10 pt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Directions I am following
          </span>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <Boxes className="h-4 w-4 text-accent" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-display text-base font-semibold text-bright">
                    {pillar.label}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pillar.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
