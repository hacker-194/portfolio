"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Layers, RotateCcw } from "lucide-react";
import { useStillMotion } from "@/lib/hooks";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Reveal } from "@/components/Reveal";
import { StudyBlock } from "@/components/StudyBlock";
import { useGsapScope } from "@/lib/gsap";
import type { Project } from "@/lib/data";
import { ACCENT_CLASS, CHIP, VISUAL } from "@/lib/visuals";
import { cn } from "@/lib/utils";

/**
 * The flip control, on both faces of the card.
 *
 * The button that turns the artwork over and the one that turns it back are one
 * control at two moments, so they resolve to one class rather than two that
 * drift apart. Raised above the schematic it sits on, because on a figure this
 * large the control has to look like the thing you are meant to press.
 */
const FLIP_CONTROL =
  "inline-flex items-center gap-2 rounded-lg border border-bright/25 bg-void/95 px-4 py-2.5 text-sm font-semibold text-bright shadow-lux-sm transition-colors duration-300 hover:border-accent hover:text-accent";

export function ProjectCard({
  project,
  reversed,
}: {
  project: Project;
  reversed: boolean;
}) {
  const root = useRef<HTMLElement | null>(null);
  const visual = useRef<HTMLDivElement | null>(null);
  const watermark = useRef<HTMLSpanElement | null>(null);
  const tilt = useRef<HTMLDivElement | null>(null);
  const [flipped, setFlipped] = useState(false);
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  // Subtle opposing parallax between the artwork and its index watermark.
  useGsapScope(root, (scope) => {
    gsap.fromTo(
      visual.current,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      watermark.current,
      { yPercent: 10 },
      {
        yPercent: -10,
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

  /**
   * Pointer tilt on the artwork.
   *
   * Written straight to `style.transform` rather than held in React state: this
   * fires on every pointer move, and a re-render per move would be the single
   * most expensive thing on the page. The GSAP scroll parallax owns a *different*
   * element so the two transforms never fight over the same node.
   */
  const handleTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const node = tilt.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const resetTilt = () => {
    const node = tilt.current;
    if (node) node.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <article
      id={project.id}
      ref={root}
      className="group relative border-t border-bright/15 py-16 first:border-t-0 sm:py-20 lg:py-24"
    >
      {/* Oversized index watermark */}
      <span
        ref={watermark}
        aria-hidden
        className="stroke-text pointer-events-none absolute -top-2 right-0 select-none font-display text-[20vw] font-semibold leading-none opacity-[0.05] sm:text-[15vw] lg:text-[11rem]"
      >
        {project.index}
      </span>

      <div className="relative grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Artwork: tilts with the pointer, flips to the stack on demand. */}
        <Reveal y={30} className={cn("lg:col-span-6", reversed && "lg:order-2")}>
          <div className="[perspective:1400px]">
            <div
              ref={tilt}
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
              className="[transform-style:preserve-3d] transition-transform duration-200 ease-out"
            >
              <div
                className={cn(
                  "relative [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  flipped && "[transform:rotateY(180deg)]",
                )}
              >
                {/* Front: the diagram */}
                <div className="[backface-visibility:hidden]">
                  <div
                    ref={visual}
                    className="relative transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
                  >
                    <ProjectVisual variant={VISUAL[project.id] ?? "api"} />

                    <button
                      type="button"
                      onClick={() => setFlipped(true)}
                      data-cursor="Flip"
                      aria-label={`Show the technology stack for ${project.title}`}
                      className={cn("absolute bottom-4 right-4", FLIP_CONTROL)}
                    >
                      Tech stack
                      <Layers className="h-4 w-4 text-accent" strokeWidth={2} />
                    </button>
                  </div>

                </div>

                {/* Back: the stack. Also listed in the case study, so nothing
                    is only reachable by flipping. */}
                <div className="absolute inset-0 flex flex-col justify-center gap-5 rounded-2xl border border-bright/12 bg-panel p-6 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-8">
                  <span className="label-mono text-muted">Stack</span>
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech} className={CHIP}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setFlipped(false)}
                    className={cn("w-fit", FLIP_CONTROL)}
                  >
                    <RotateCcw className="h-4 w-4 text-accent" strokeWidth={2} />
                    Back to diagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Case study */}
        <div className={cn("lg:col-span-6", reversed && "lg:order-1")}>
          <Reveal delay={0.06}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className={cn("label-mono", ACCENT_CLASS[project.accent])}>
                {project.category}
              </span>
              <span className="hairline h-px w-8 border-t" aria-hidden />
              <span className="label-mono text-muted">{project.year}</span>
            </div>

            <h3 className="mt-4 font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-[1.12] tracking-tight text-bright">
              <Link
                href={`/projects/${project.id}`}
                data-cursor="Read case study"
                className="transition-colors duration-300 hover:text-accent"
              >
                {project.title}
              </Link>
            </h3>

            <p className="mt-4 text-base leading-relaxed text-soft">
              {project.summary}
            </p>

            <div className="mt-8 flex flex-col gap-7">
              <StudyBlock label="Problem">
                <p className="text-sm leading-relaxed text-soft">
                  {project.problem}
                </p>
              </StudyBlock>

              <StudyBlock label="Approach">
                <ul className="flex flex-col gap-3">
                  {project.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-3.5 text-sm leading-relaxed text-soft"
                    >
                      <span
                        className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                        aria-hidden
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </StudyBlock>

              <StudyBlock label="Architecture">
                {/* Ordered pipeline. The arrow trails the stage it belongs to,
                    so a wrapped row starts on a stage and lines up with the row
                    above it rather than beginning on a connector. The arrow is
                    drawn rather than a character, so its weight matches every
                    other icon on the page. */}
                <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] text-soft">
                  {project.pipeline.map((stage, i) => (
                    <li key={stage} className="flex items-center gap-2.5">
                      <span className="rounded-lg border border-bright/15 bg-bright/5 px-2.5 py-1.5">
                        {stage}
                      </span>
                      {i < project.pipeline.length - 1 ? (
                        <ArrowRight
                          className="h-3.5 w-3.5 shrink-0 text-muted"
                          strokeWidth={1.8}
                          aria-hidden
                        />
                      ) : null}
                    </li>
                  ))}
                </ol>
              </StudyBlock>

              <StudyBlock label="Specification">
                {/* One fact per line, label left and value right: the shape a
                    technical reader scans, rather than three cells competing
                    for the same glance. */}
                <dl className="flex flex-col">
                  {project.spec.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-bright/10 py-3 first:pt-0 last:border-b-0 last:pb-0"
                    >
                      <dt className="label-mono w-28 shrink-0 text-muted">
                        {item.label}
                      </dt>
                      <dd className="text-sm leading-snug text-bright">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </StudyBlock>
            </div>

            {/* Link to the case study, plus the source link or a clearly
                marked placeholder. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={`/projects/${project.id}`}
                className="group/link inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.16em] text-bright transition-colors hover:text-accent"
              >
                Case study
                <ArrowRight
                  className="h-4 w-4 text-accent transition-transform duration-300 group-hover/link:translate-x-1"
                  strokeWidth={2}
                />
              </Link>

              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/link inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.16em] text-bright transition-colors hover:text-accent"
                >
                  Source code
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </a>
              ) : (
                <div className="inline-flex items-center gap-3 rounded-lg border border-dashed border-bright/15 px-3.5 py-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.8} />
                  <span className="font-mono text-xs leading-tight tracking-wide text-muted">
                    {project.linkNote}
                  </span>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
