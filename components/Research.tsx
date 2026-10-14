"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { LEARNING } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";

/**
 * Research / Learning.
 *
 * An archive of public work being studied right now. The publications listed are
 * other people's, so it makes no claim of authorship. It used to open with a
 * card for one piece of original research; that is gone, and nothing has been
 * written to fill the space.
 */
export function Research() {
  return (
    <section
      id="research"
      className="relative overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          eyebrow="Research & Literature"
          title={["Foundational papers", "and ongoing study."]}
          description="Key machine learning literature and deep-dive technical material I analyze to inform architectural design decisions."
        />

        {/* Learning archive */}
        <div className="mt-14 lg:mt-18">
          <div className="flex items-center justify-between border-b border-bright/10 pb-4 text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider text-muted">Selected Literature</span>
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
                      <p className="mt-1 text-xs text-muted">{item.source}</p>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <span className="rounded-full border border-bright/10 bg-panel px-3 py-1 font-mono text-xs text-soft">
                      {item.topic}
                    </span>
                  </div>

                  <div className="md:col-span-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-0.5 font-mono text-[0.6875rem] text-accent">
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
      </div>
    </section>
  );
}
