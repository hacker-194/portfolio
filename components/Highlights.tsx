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
    label: "Status",
    value: "Looking for work",
    note: "ML roles with real data",
  },
];

export function Highlights() {
  return (
    <section
      id="highlights"
      aria-label="Profile at a glance"
      className="relative overflow-hidden border-t border-bright/10 py-16 sm:py-20"
    >
      <div className={SECTION_CONTAINER}>
        <Reveal y={20}>
          <div className="rounded-2xl border border-bright/10 bg-panel/40 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bright/10 pb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Profile Overview
              </span>
              <span className="text-xs text-muted">
                {PROFILE.location} · {PROFILE.timezone}
              </span>
            </div>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FACTS.map((fact, index) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-bright/10 bg-ink/60 p-5 transition-all duration-300 hover:border-accent/30 hover:bg-panel2"
                >
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-bold tracking-tight text-bright">
                    {fact.value}
                  </dd>
                  <dd className="mt-1 text-xs leading-relaxed text-muted">
                    {fact.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
