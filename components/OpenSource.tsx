"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronDown, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import type { ActivityDay, Repo } from "@/lib/github";
import { SECTION_CONTAINER } from "@/lib/layout";
import { PROFILE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Open Source: my repositories, read live from the GitHub API.
 *
 * The list is the primary artefact and the graph is its overview. That ordering
 * is deliberate: the list is real links with real text, it works with a keyboard
 * and a screen reader, and it survives WebGL being unavailable. The graph is the
 * second reading of the same data.
 *
 * The list also drives the graph. Hovering a row lights its node, and that is
 * what turns a canvas of unlabelled nodes into something navigable rather than
 * something to poke at.
 *
 * The section opens on the few most recent repositories rather than all of them.
 * The graph is handed the same slice, so the two readings of the data always
 * agree: what the canvas draws is exactly what the list beside it shows.
 *
 * `repos` arrives already fetched and revalidated from the server; see
 * `lib/github.ts`.
 */

/** Repositories shown before the reader asks for the rest. */
const INITIAL_REPOS = 4;

/** Four intensity steps. Enough to read as activity, no invented scale.
 *  The activity cells are data, so they wear the reserved mist blue. */
function tone(count: number): string {
  if (count === 0) return "bg-bright/10";
  if (count === 1) return "bg-data/35";
  if (count <= 3) return "bg-data/65";
  return "bg-data";
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Fixed, UTC-rendered date. A relative "3 days ago" would differ between the
 * server render and the client hydration, and a locale-formatted date would
 * differ between machines.
 */
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function OpenSource({
  repos,
  activity,
}: {
  repos: Repo[];
  activity: ActivityDay[] | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? repos : repos.slice(0, INITIAL_REPOS);
  const collapsible = repos.length > INITIAL_REPOS;

  // Thirteen columns of seven days, oldest first, so the last cell is today.
  const weeks: ActivityDay[][] = [];
  if (activity) {
    for (let i = 0; i < activity.length; i += 7) {
      weeks.push(activity.slice(i, i + 7));
    }
  }
  const activeDays =
    activity?.filter((day) => day.count > 0).length ?? 0;

  return (
    <section
      id="open-source"
      className="panel-deep relative isolate overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={`${SECTION_CONTAINER} relative z-[3]`}>
        <SectionHeading
          eyebrow="Open Source"
          title={["Code and contributions,", "published on GitHub."]}
          description="Live repositories synchronized with GitHub, updated hourly to reflect recent work and open source activity."
        />

        {repos.length === 0 ? (
          <Reveal y={24} className="mt-14 lg:mt-18">
            <div className="rounded-2xl border border-bright/10 bg-panel/50 p-6 sm:p-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">GitHub Feed Status</span>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                The GitHub API feed is temporarily rate-limited. All public repositories remain accessible directly on my profile.
              </p>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link mt-5 inline-flex items-center gap-2 text-xs font-medium text-bright transition-colors hover:text-accent"
              >
                {PROFILE.githubHandle} on GitHub
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>
          </Reveal>
        ) : (
          <>
            <div className="mt-14 lg:mt-18">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bright/10 pb-4 text-xs text-muted">
                  <span className="font-semibold uppercase tracking-wider text-muted">Repositories</span>
                  <span>
                    {collapsible && !expanded
                      ? `${visible.length} of ${repos.length} repositories`
                      : `${repos.length} public repositories`}
                  </span>
                </div>

                <ul id="open-source-list" className="flex flex-col divide-y divide-bright/10">
                  {visible.map((repo, index) => (
                    <Reveal key={repo.name} delay={index * 0.03} y={12}>
                      <li className="transition-colors hover:bg-bright/[0.02]">
                        <a
                          href={repo.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group/link block py-5 transition-colors sm:py-6"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                            <span className="font-display text-lg font-semibold tracking-tight text-bright transition-colors group-hover/link:text-accent sm:text-xl">
                              {repo.name}
                            </span>

                            <div className="flex items-center gap-3">
                              {repo.stars > 0 ? (
                                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                                  <Star className="h-3 w-3" strokeWidth={2} />
                                  {repo.stars}
                                </span>
                              ) : null}
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-bright/10 bg-panel px-2.5 py-0.5 font-mono text-[0.6875rem] text-soft">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                                {repo.language}
                              </span>
                              <span className="font-mono text-xs text-muted">
                                {formatDate(repo.updatedAt)}
                              </span>
                              <ArrowUpRight
                                className="h-4 w-4 text-muted transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-accent"
                                strokeWidth={2}
                              />
                            </div>
                          </div>

                          {repo.description ? (
                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
                              {repo.description}
                            </p>
                          ) : null}
                        </a>
                      </li>
                    </Reveal>
                  ))}
                </ul>

                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    aria-expanded={expanded}
                    aria-controls="open-source-list"
                    className="group/more flex w-full items-center justify-between border-t border-bright/10 py-5 text-left text-xs font-medium text-accent transition-colors hover:text-bright"
                  >
                    <span>
                      {expanded
                        ? `Show fewer repositories`
                        : `Show all ${repos.length} repositories`}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-accent transition-transform duration-200 ${
                        expanded ? "rotate-180" : ""
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Public activity strip, from the same API as the list above.
                `null` means the call failed, and then no strip is shown at all:
                an empty grid would read as "no activity", which is a claim we
                cannot make. */}
            {activity ? (
              <Reveal delay={0.06} y={14} className="mt-10">
                <div className="hairline border-t pt-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                    <span className="label-mono text-muted">
                      Public activity · last 13 weeks
                    </span>
                    <span className="label-mono text-muted">
                      {activeDays} {activeDays === 1 ? "active day" : "active days"}
                    </span>
                  </div>

                  {activeDays === 0 ? (
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      No public events in the last 13 weeks.
                    </p>
                  ) : (
                    <div
                      className="mt-4 grid w-full max-w-[30rem] grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5"
                      role="img"
                      aria-label={`${activeDays} ${
                        activeDays === 1 ? "day" : "days"
                      } with public GitHub activity in the last 13 weeks`}
                    >
                      {weeks.map((column, columnIndex) => (
                        <div key={columnIndex} className="grid gap-1.5">
                          {column.map((day) => (
                            <span
                              key={day.date}
                              title={`${day.date} · ${day.count} public ${
                                day.count === 1 ? "event" : "events"
                              }`}
                              aria-hidden
                              className={cn(
                                "aspect-square rounded-[3px]",
                                tone(day.count),
                              )}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default OpenSource;
