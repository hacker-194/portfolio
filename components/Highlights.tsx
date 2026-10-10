"use client";

import { Reveal } from "@/components/Reveal";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { PROFILE } from "@/lib/site";

/**
 * Recruiter snapshot.
 *
 * A single scannable row of the facts a hiring reader looks for first (role,
 * degree, internship and availability), pulled from the same CV-derived data the
 * rest of the page uses. Nothing new is asserted here; this only surfaces what
 * the sections below already state.
 *
 * Presented as a raised plaque (layered surface, ice seam, deep shadow) so the
 * summary reads as a considered credential card rather than a plain list.
 */
const FACTS = [
  {
    label: "Focus",
    value: PROFILE.role,
    // The stack rather than a description, because a hiring reader scans this
    // row for keywords before they read anything else on the page.
    note: "PyTorch · Scikit-learn · FastAPI",
  },
  {
    label: "Education",
    value: EDUCATION.degree,
    note: `${EDUCATION.school.split(",")[0]} · ${EDUCATION.detail}`,
  },
  {
    label: "Experience",
    value: EXPERIENCE[0].role,
    note: `${EXPERIENCE[0].org} · ${EXPERIENCE[0].period.split("·")[0].trim()}`,
  },
  {
    label: "Availability",
    value: "Open to AI/ML roles",
    note: "Engineering & research collaboration",
  },
];

export function Highlights() {
  return (
    <section
      aria-label="Profile at a glance"
      className="relative overflow-hidden border-b border-bright/15 py-16 sm:py-20"
    >
      <div className={SECTION_CONTAINER}>
        <Reveal y={20}>
          <div className="glass-card hairline relative overflow-hidden rounded-2xl border p-7 sm:p-9">
            <span
              className="accent-rule pointer-events-none absolute inset-x-0 top-0 h-px"
              aria-hidden
            />

            <div className="relative flex flex-wrap items-baseline justify-between gap-3">
              <span className="label-mono text-volt">
                Profile · at a glance
              </span>
              <span className="label-mono text-muted">
                {PROFILE.location}
              </span>
            </div>

            <dl className="relative mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
              {FACTS.map((fact, index) => (
                <Reveal key={fact.label} delay={0.06 * index} y={16}>
                  <div className="hairline border-t pt-4">
                    <dt className="flex items-baseline gap-3">
                      <span className="font-mono text-xs tracking-[0.2em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="label-mono text-muted">
                        {fact.label}
                      </span>
                    </dt>
                    <dd className="mt-3 font-display text-base font-semibold leading-snug text-bright sm:text-lg">
                      {fact.value}
                    </dd>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                      {fact.note}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
