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
  { label: "Training models", note: "Getting real signal from messy data" },
  { label: "Making them work", note: "PyTorch, debugging loss curves, knowing when you're done" },
  { label: "Shipping them", note: "APIs, endpoints, making sure they don't break in production" },
  { label: "The new stuff", note: "Transformers, LLMs - learning what's next" },
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
          eyebrow="Engineering Philosophy"
          title={["How I approach", "machine learning engineering."]}
          description="My focus is on models that solve concrete problems, evaluate honestly, and run reliably in production environments."
        />

        <div className="mt-14 grid gap-12 lg:mt-18 lg:grid-cols-12 lg:gap-16">
          {/* Narrative column */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-bright">
                {PROFILE.statement}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Most machine learning value is unlocked through disciplined fundamentals: cleaning and validating datasets, engineering features with domain context, establishing reliable baselines, and deploying via well-tested APIs. My background in cybersecurity also instills a strong security and robustness mindset: understanding failure modes makes systems significantly more resilient.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {FOCUS.map((item, index) => (
                <Reveal key={item.label} delay={0.05 * index} y={14}>
                  <div className="rounded-xl border border-bright/10 bg-panel/40 p-5 transition-all duration-300 hover:border-accent/40 hover:bg-panel2">
                    <h3 className="font-display text-base font-semibold text-bright">
                      {item.label}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Interests */}
            <Reveal delay={0.1} className="mt-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Areas of Interest</span>
              <ul className="mt-3 flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <li
                    key={interest}
                    className="rounded-full border border-bright/10 bg-panel px-3.5 py-1 text-xs text-soft transition-colors hover:border-accent/30 hover:text-bright"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Credentials column */}
          <div className="lg:col-span-5">
            <Reveal y={24}>
              <div className="rounded-2xl border border-bright/10 bg-panel/50 p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10">
                    <GraduationCap className="h-5 w-5 text-accent" strokeWidth={1.8} />
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Education</span>
                    <h3 className="mt-1 font-display text-lg font-bold text-bright">
                      {EDUCATION.degree}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {EDUCATION.school}
                    </p>
                    <p className="mt-0.5 text-xs text-accent">{EDUCATION.detail}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-bright/10 pt-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Relevant Coursework</span>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {EDUCATION.coursework.map((course) => (
                      <span key={course} className="rounded-md border border-bright/10 bg-ink px-2.5 py-1 text-xs text-soft">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Certifications */}
            <Reveal delay={0.12} y={20} className="mt-6">
              <div className="rounded-2xl border border-bright/10 bg-panel/50 p-6 backdrop-blur-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Certifications</span>
                <ul className="mt-4 flex flex-col divide-y divide-bright/10">
                  {CERTIFICATIONS.map((cert) => (
                    <li
                      key={cert.title}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm font-medium text-bright">
                        {cert.title}
                      </span>
                      <span className="text-xs font-mono text-muted text-right">
                        {cert.issuer}
                      </span>
                    </li>
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
