"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Briefcase, GraduationCap, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useGsapScope } from "@/lib/gsap";
import { SECTION_CONTAINER } from "@/lib/layout";
import { cn } from "@/lib/utils";

type TimelineEntry = {
  id: string;
  kind: "education" | "experience" | "leadership";
  period: string;
  role: string;
  org: string;
  points: string[];
};

const ICONS = {
  education: GraduationCap,
  experience: Briefcase,
  leadership: Users,
} as const;

const LABELS = {
  education: "Education",
  experience: "Experience",
  leadership: "Leadership",
} as const;

const ENTRIES: TimelineEntry[] = [
  {
    id: "education",
    kind: "education",
    period: "Expected 2026",
    role: EDUCATION.degree,
    org: EDUCATION.school,
    points: [EDUCATION.detail, `Coursework: ${EDUCATION.coursework.slice(0, 4).join(", ")}`],
  },
  ...EXPERIENCE.map((item) => ({
    id: item.id,
    kind: item.kind,
    period: item.period,
    role: item.role,
    org: item.org,
    points: item.points,
  })),
];

export function Experience() {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapScope(root, (scope) => {
    gsap.fromTo(
      "[data-timeline-rail]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: scope,
          start: "top 72%",
          end: "bottom 60%",
          scrub: 0.5,
        },
      },
    );

    gsap.utils.toArray<HTMLElement>("[data-timeline-card]").forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 86%" },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-timeline-node]").forEach((dot) => {
      gsap.fromTo(
        dot,
        { scale: 0.4, opacity: 0.3 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: dot, start: "top 88%" },
        },
      );
    });
  });

  return (
    <section
      id="experience"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-28 lg:py-36"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="07"
          eyebrow="Experience & leadership"
          title={["Where the theory", "met real datasets", "and real teams."]}
        />

        <div ref={root} className="relative mt-16 lg:mt-20">
          {/* Rail */}
          <div className="absolute left-[1.4rem] top-0 bottom-0 w-px bg-white/[0.07]" aria-hidden />
          <div
            data-timeline-rail
            className="ember-gradient absolute left-[1.4rem] top-0 bottom-0 w-px origin-top"
            aria-hidden
          />

          <ol className="relative flex flex-col gap-12 sm:gap-16">
            {ENTRIES.map((entry, index) => {
              const Icon = ICONS[entry.kind];
              return (
                <li key={entry.id} className="relative pl-14 sm:pl-20">
                  {/* Node */}
                  <span
                    data-timeline-node
                    className="absolute left-0 top-1 grid h-[2.8rem] w-[2.8rem] place-items-center rounded-full border border-flare/30 bg-void"
                  >
                    <span
                      className="absolute inset-[5px] rounded-full bg-umber/80"
                      aria-hidden
                    />
                    <Icon className="relative h-4 w-4 text-flare" strokeWidth={1.7} />
                  </span>

                  <div data-timeline-card>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span
                        className={cn(
                          "label-mono rounded-full border px-2.5 py-1",
                          entry.kind === "leadership"
                            ? "border-gold/25 text-gold/80"
                            : entry.kind === "education"
                              ? "border-white/12 text-ash/80"
                              : "border-ember/35 text-ember/90",
                        )}
                      >
                        {LABELS[entry.kind]}
                      </span>
                      <span className="label-mono text-ash/70">{entry.period}</span>
                    </div>

                    <h3 className="mt-4 font-display text-[clamp(1.35rem,2.6vw,2rem)] font-semibold leading-tight tracking-tight text-bone">
                      {entry.role}
                    </h3>
                    <p className="mt-2 text-[0.95rem] text-mist/80">{entry.org}</p>

                    <ul className="mt-5 flex flex-col gap-3">
                      {entry.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3.5 text-[0.92rem] leading-relaxed text-ash"
                        >
                          <span
                            className="mt-[0.6rem] h-px w-4 shrink-0 bg-ember/50"
                            aria-hidden
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {index < ENTRIES.length - 1 ? (
                    <span
                      className="pointer-events-none absolute left-[1.4rem] top-[3.4rem] -translate-x-1/2 font-mono text-[0.7rem] text-ember/40"
                      aria-hidden
                    >
                      │
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-16">
          <div className="hairline flex flex-wrap items-center justify-between gap-4 border-t pt-7">
            <p className="max-w-xl text-sm leading-relaxed text-ash">
              Everything above is verifiable — the internship, the leadership role
              and the degree are exactly as they appear on my CV.
            </p>
            <span className="label-mono text-ash/55">
              {String(ENTRIES.length).padStart(2, "0")} entries
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
