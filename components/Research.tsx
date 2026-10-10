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
          index="06"
          eyebrow="Research / Learning"
          title={["What I'm reading", "right now."]}
          description="The papers and books I'm working through at the moment."
        />

        {/* Learning archive */}
        <div className="mt-16 lg:mt-20">
          <div className="hairline flex items-baseline justify-between gap-4 border-b pb-4">
            <span className="label-mono text-muted">Learning archive</span>
            <span className="label-mono text-muted">
              {String(LEARNING.length).padStart(2, "0")} entries
            </span>
          </div>

          <ul className="flex flex-col">
            {LEARNING.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} y={16}>
                <li className="hairline grid gap-4 border-b py-7 md:grid-cols-12 md:items-baseline">
                  <span className="font-mono text-xs text-muted md:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="md:col-span-6">
                    <h3 className="font-display text-base font-medium leading-snug text-bright sm:text-lg">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group/link inline-flex items-baseline gap-2 transition-colors hover:text-accent"
                        >
                          {item.title}
                          <ArrowUpRight
                            className="h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                            strokeWidth={1.8}
                          />
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    {item.source ? (
                      <p className="mt-2 text-sm text-muted">{item.source}</p>
                    ) : null}
                  </div>

                  <div className="md:col-span-2">
                    <span className="label-mono text-soft">{item.topic}</span>
                  </div>

                  <div className="md:col-span-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-bright/15 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-accent">
                      <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                      {item.status}
                    </span>
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                      {item.notes.map((note) => (
                        <li
                          key={note}
                          className="text-sm leading-snug text-muted"
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
