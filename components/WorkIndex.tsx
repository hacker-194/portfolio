"use client";

import { ArrowRight } from "lucide-react";
import { scrollToHash } from "@/components/SmoothScroll";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * The work index.
 *
 * One line per system, above the long form: a technical reader scans first, and
 * three rows under a heading read as a body of work where three cards read as
 * three posts.
 *
 * A row jumps to its card, which is where the full account lives. Status is
 * derived from `href`, so a row stops saying "not public" the moment a
 * repository link exists.
 */
export function WorkIndex() {
  return (
    <div className="mt-16 lg:mt-20">
      <div className="hairline flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b pb-4">
        <span className="label-mono text-muted">Index</span>
        <span className="label-mono text-muted">
          {String(PROJECTS.length).padStart(2, "0")} systems · most recent first
        </span>
      </div>

      <ol className="flex flex-col">
        {PROJECTS.map((project) => (
          <li key={project.id} className="hairline border-b">
            <button
              type="button"
              onClick={() => scrollToHash(`#${project.id}`)}
              aria-label={`Jump to the ${project.title} case study`}
              data-cursor="Jump to case study"
              className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-5 text-left sm:gap-x-6"
            >
              <span className="font-mono text-xs tabular-nums text-muted">
                {project.index}
              </span>

              <span className="font-display text-base font-semibold leading-snug tracking-tight text-bright transition-colors duration-300 group-hover:text-accent sm:text-lg">
                {project.title}
                <ArrowRight
                  className="ml-2 inline h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  strokeWidth={2}
                  aria-hidden
                />
              </span>

              <span className="font-mono text-xs tabular-nums text-muted">
                {project.year}
              </span>

              <span aria-hidden />
              <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                <span className="label-mono text-muted">
                  {project.category}
                </span>
                <span className="font-mono text-xs leading-relaxed tracking-[0.06em] text-soft">
                  {project.stack.join(" · ")}
                </span>
              </span>
              <span
                className={cn(
                  "label-mono whitespace-nowrap",
                  project.href ? "text-accent" : "text-muted",
                )}
              >
                {project.href ? "Public" : "Not public"}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default WorkIndex;
