"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { GraduationCap } from "lucide-react";
import { MaskedLines } from "@/components/MaskedLines";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CERTIFICATIONS, EDUCATION, INTERESTS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { radialGlow } from "@/lib/palette";
import { PROFILE } from "@/lib/site";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

const FOCUS = [
  { label: "Artificial Intelligence", note: "Modelling, architectures, evaluation" },
  { label: "Machine Learning", note: "Supervised learning, feature work" },
  { label: "Cybersecurity", note: "Threat intelligence foundations" },
  { label: "Data Science", note: "Cleaning, EDA, storytelling" },
];

export function About() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32 lg:py-40"
    >
      <div className="tech-grid tech-grid-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden />

      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="02"
          eyebrow="About"
          title={["An engineer's", "notebook, not a", "highlight reel."]}
        />

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Editorial column */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-editorial text-[clamp(1.5rem,3.4vw,2.35rem)] leading-[1.28] text-bone">
                {PROFILE.statement}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-[0.98rem] leading-relaxed text-ash sm:text-[1.05rem]">
                My work sits where data meets delivery: cleaning and interrogating
                real datasets, training and comparing models, then exposing the
                result through an interface someone can actually use. Alongside
                that I keep a security lens — understanding how systems break is
                part of knowing how to build them.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {FOCUS.map((item, index) => (
                <Reveal key={item.label} delay={0.06 * index} y={18}>
                  <div className="hairline border-t pt-5">
                    <span className="label-mono text-ember/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-bone">
                      {item.label}
                    </h3>
                    <p className="mt-1.5 text-sm text-ash">{item.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Interests */}
            <Reveal delay={0.1} className="mt-14">
              <span className="label-mono text-ash">Interests</span>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {INTERESTS.map((interest) => (
                  <li
                    key={interest}
                    className="hairline rounded-full border bg-white/[0.02] px-3.5 py-2 text-xs text-mist/80 transition-colors duration-300 hover:border-flare/40 hover:text-bone"
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
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full"
                  style={{ background: radialGlow("ember", 0.22, { stop: 68 }) }}
                  aria-hidden
                />

                <div className="relative flex items-start gap-4">
                  <span className="hairline grid h-11 w-11 shrink-0 place-items-center rounded-full border bg-white/[0.03]">
                    <GraduationCap className="h-5 w-5 text-flare" strokeWidth={1.6} />
                  </span>
                  <div>
                    <span className="label-mono text-ash">Education</span>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-bone">
                      <MaskedLines
                        lines={[EDUCATION.degree]}
                        stagger={0}
                        lineClassName="font-display"
                      />
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ash">
                      {EDUCATION.school}
                    </p>
                    <p className="mt-1 text-sm text-mist/70">{EDUCATION.detail}</p>
                  </div>
                </div>

                <div className="relative mt-8">
                  <span className="label-mono text-ash">Relevant coursework</span>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5">
                    {EDUCATION.coursework.map((course) => (
                      <span key={course} className="text-[0.8rem] text-mist/75">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Certifications — deliberately minimal */}
            <Reveal delay={0.12} y={26} className="mt-8">
              <div className="hairline border-t pt-7">
                <span className="label-mono text-ash">Certifications</span>
                <ul className="mt-5 flex flex-col">
                  {CERTIFICATIONS.map((cert, index) => (
                    <motion.li
                      key={cert.title}
                      className="group flex items-baseline justify-between gap-6 border-b border-white/[0.06] py-4 last:border-b-0"
                      initial={reduce ? false : { opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportOnce}
                      transition={{
                        duration: 0.7,
                        ease: EASE_CINEMATIC,
                        delay: index * 0.1,
                      }}
                    >
                      <span className="text-[0.95rem] leading-snug text-bone">
                        {cert.title}
                      </span>
                      <span className="label-mono shrink-0 text-right text-ash/80">
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
