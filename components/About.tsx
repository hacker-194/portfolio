"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { GraduationCap } from "lucide-react";
import { MaskedLines } from "@/components/MaskedLines";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CERTIFICATIONS, EDUCATION, INTERESTS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { PROFILE } from "@/lib/site";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

/**
 * What this page is hired for, in the order it can prove it: modelling, then
 * the deep-learning tooling, then getting a model out of a notebook, then the
 * frontier being studied. The security and data-analysis background is stated
 * in the paragraph below and in the certifications, not given equal billing
 * here, so the section reads as one specialism rather than four interests.
 */
const FOCUS = [
  { label: "Machine Learning", note: "Supervised learning, feature engineering, evaluation" },
  { label: "Deep Learning", note: "PyTorch, training loops, architectures" },
  { label: "Model Serving", note: "FastAPI, REST endpoints, inference paths" },
  { label: "LLM & Agentic Systems", note: "Active study: transformers, retrieval, tool use" },
];

export function About() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="02"
          eyebrow="About"
          title={["The work I do,", "and how I do it."]}
          decode={false}
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Editorial column */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-editorial text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.28] text-bright">
                {PROFILE.statement}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-base">
                It&apos;s mostly unglamorous work: cleaning datasets, exploring
                them until the signals show up, training and comparing models,
                then getting the result in front of someone through an
                interface that works. I came in through data analysis, and I
                keep a security lens on the modelling, since knowing how systems
                break is part of knowing how to build them.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {FOCUS.map((item, index) => (
                <Reveal key={item.label} delay={0.06 * index} y={18}>
                  <div className="hairline border-t pt-5">
                    <span className="label-mono text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-bright">
                      {item.label}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted">{item.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Interests */}
            <Reveal delay={0.1} className="mt-14">
              <span className="label-mono text-muted">Interests</span>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {INTERESTS.map((interest) => (
                  <li
                    key={interest}
                    className="hairline rounded-full border bg-bright/5 px-3.5 py-2 text-xs text-soft transition-colors duration-300 hover:border-volt/40 hover:text-bright"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Credentials column */}
          <div className="lg:col-span-5">
            <Reveal y={30}>
              <div className="glass-panel hairline relative overflow-hidden rounded-2xl border p-7 sm:p-9">
                <div className="relative flex items-start gap-4">
                  <span className="hairline grid h-11 w-11 shrink-0 place-items-center rounded-full border bg-bright/5">
                    <GraduationCap className="h-5 w-5 text-volt" strokeWidth={1.6} />
                  </span>
                  <div>
                    <span className="label-mono text-muted">Education</span>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-bright">
                      <MaskedLines
                        lines={[EDUCATION.degree]}
                        stagger={0}
                        lineClassName="font-display"
                      />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {EDUCATION.school}
                    </p>
                    <p className="mt-1 text-sm text-soft">{EDUCATION.detail}</p>
                  </div>
                </div>

                <div className="relative mt-8">
                  <span className="label-mono text-muted">Relevant coursework</span>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
                    {EDUCATION.coursework.map((course) => (
                      <span key={course} className="text-sm text-soft">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Certifications: deliberately minimal */}
            <Reveal delay={0.12} y={26} className="mt-8">
              <div className="hairline border-t pt-7">
                <span className="label-mono text-muted">Certifications</span>
                <ul className="mt-5 flex flex-col">
                  {CERTIFICATIONS.map((cert, index) => (
                    <motion.li
                      key={cert.title}
                      className="group flex items-baseline justify-between gap-6 border-b border-bright/15 py-4 last:border-b-0"
                      initial={reduce ? false : { opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportOnce}
                      transition={{
                        duration: 0.7,
                        ease: EASE_CINEMATIC,
                        delay: index * 0.1,
                      }}
                    >
                      <span className="text-base leading-snug text-bright">
                        {cert.title}
                      </span>
                      <span className="label-mono shrink-0 text-right text-muted">
                        {cert.issuer}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
