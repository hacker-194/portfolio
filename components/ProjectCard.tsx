"use client";

import { useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Reveal } from "@/components/Reveal";
import { FactList } from "@/components/FactList";
import { StudyBlock } from "@/components/StudyBlock";
import { useGsapScope } from "@/lib/gsap";
import type { Project } from "@/lib/data";
import { CHIP, VISUAL } from "@/lib/visuals";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  reversed,
}: {
  project: Project;
  reversed: boolean;
}) {
  const root = useRef<HTMLElement | null>(null);
  const visual = useRef<HTMLDivElement | null>(null);

  useGsapScope(root, (scope) => {
    gsap.fromTo(
      visual.current,
      { yPercent: -2 },
      {
        yPercent: 2,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  return (
    <article
      id={project.id}
      ref={root}
      className="group relative rounded-2xl border border-bright/10 bg-panel/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-bright/20 sm:p-8 lg:p-10"
    >
      <div className="relative grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Schematic visual column */}
        <div className={cn("lg:col-span-6", reversed && "lg:order-2")}>
          <div
            ref={visual}
            className="overflow-hidden rounded-xl border border-bright/10 bg-ink/80 p-3 sm:p-5 shadow-2xl transition-transform duration-500 group-hover:-translate-y-1"
          >
            <ProjectVisual variant={VISUAL[project.id] ?? "api"} />
          </div>

          {/* Tech stack directly visible under diagram */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className={CHIP}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Case study details column */}
        <div className={cn("lg:col-span-6 flex flex-col justify-between", reversed && "lg:order-1")}>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent">
                {project.category}
              </span>
              <span className="text-xs font-mono text-muted">{project.year}</span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-bright sm:text-3xl">
              <Link
                href={`/projects/${project.id}`}
                className="transition-colors hover:text-accent"
              >
                {project.title}
              </Link>
            </h3>

            <p className="mt-3 text-base leading-relaxed text-muted">
              {project.summary}
            </p>

            <div className="mt-6 flex flex-col gap-6">
              <StudyBlock label="Problem Statement">
                <p className="text-sm leading-relaxed text-soft">
                  {project.problem}
                </p>
              </StudyBlock>

              <StudyBlock label="Key Implementation">
                <ul className="flex flex-col gap-2.5">
                  {project.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-3 text-sm leading-relaxed text-soft"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </StudyBlock>

              <StudyBlock label="Architecture Pipeline">
                <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-soft">
                  {project.pipeline.map((stage, i) => (
                    <li key={stage} className="flex items-center gap-2">
                      <span className="rounded-md border border-bright/10 bg-panel px-2.5 py-1 text-bright">
                        {stage}
                      </span>
                      {i < project.pipeline.length - 1 ? (
                        <ArrowRight
                          className="h-3 w-3 shrink-0 text-muted"
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  ))}
                </ol>
              </StudyBlock>

              <StudyBlock label="Technical Specifications">
                <FactList items={project.spec} />
              </StudyBlock>

              {project.results?.length ? (
                <StudyBlock label="Measured Metrics">
                  <FactList items={project.results} />
                </StudyBlock>
              ) : null}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-bright/10 pt-6">
            <Link
              href={`/projects/${project.id}`}
              className="group/link inline-flex items-center gap-2 rounded-lg bg-bright/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-bright transition-all hover:bg-accent hover:text-void"
            >
              Detailed Case Study
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1"
                strokeWidth={2}
              />
            </Link>

            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-bright"
              >
                Source Code
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs text-muted">
                <Clock className="h-3.5 w-3.5 shrink-0 text-accent/60" strokeWidth={1.8} />
                <span>{project.linkNote}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
