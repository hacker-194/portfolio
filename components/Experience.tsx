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
  stack?: string[];
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
    stack: item.stack,
  })),
];

export function Experience() {
  const root = useRef<HTMLDivElement | null>(null);

  /**
   * The rail tracks the reader's position, so it carries information and stays.
   * The entries themselves sit still: a reader goes through this section line by
   * line, and a timeline that shifts under them as they read is noise.
   */
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
  });

  return (
    <section
      id="experience"
      className="relative overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          eyebrow="Career & Education"
          title={["Experience, leadership,", "and academic foundation."]}
          description="Internship experience, organizational leadership, and formal Computer Science coursework."
        />

        <div ref={root} className="relative mt-14 lg:mt-18">
          {/* Rail */}
          <div className="absolute left-[1.4rem] top-0 bottom-0 w-px bg-bright/10" aria-hidden />
          <div
            data-timeline-rail
            className="absolute left-[1.4rem] top-0 bottom-0 w-px origin-top bg-accent"
            aria-hidden
          />

          <ol className="relative flex flex-col gap-12 sm:gap-16">
            {ENTRIES.map((entry, index) => {
              const Icon = ICONS[entry.kind];
              return (
                <li key={entry.id} className="relative pl-14 sm:pl-20">
                  {/* Node */}
                  <span className="absolute left-0 top-1 grid h-[2.8rem] w-[2.8rem] place-items-center rounded-xl border border-bright/15 bg-panel shadow-md">
                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.8} />
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "rounded-full border px-3 py-0.5 text-xs font-medium tracking-wide uppercase",
                          entry.kind === "leadership"
                            ? "border-data/30 bg-data/10 text-data"
                            : entry.kind === "education"
                              ? "border-bright/15 bg-bright/5 text-muted"
                              : "border-accent/30 bg-accent/10 text-accent",
                        )}
                      >
                        {LABELS[entry.kind]}
                      </span>
                      <span className="text-xs font-mono text-muted">{entry.period}</span>
                    </div>

                    <h3 className="mt-3 font-display text-xl sm:text-2xl font-bold tracking-tight text-bright">
                      {entry.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent">{entry.org}</p>

                    <ul className="mt-4 flex flex-col gap-2.5">
                      {entry.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-relaxed text-muted"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60"
                            aria-hidden
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {entry.stack?.length ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {entry.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-md border border-bright/10 bg-panel px-2.5 py-1 font-mono text-xs text-soft"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  {index < ENTRIES.length - 1 ? (
                    <span
                      className="pointer-events-none absolute left-[calc(1.4rem-0.5px)] top-[3.4rem] h-4 w-px bg-accent/40"
                      aria-hidden
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-16">
          <div className="hairline flex flex-wrap items-center justify-between gap-4 border-t pt-7">
            <p className="max-w-xl text-sm leading-relaxed text-muted">
            I&apos;ve kept all of this as it appears on my CV.
            </p>
            <span className="label-mono text-muted">
              {String(ENTRIES.length).padStart(2, "0")} entries
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
