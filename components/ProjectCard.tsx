"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, Clock } from "lucide-react";
import { ProjectVisual } from "@/components/ProjectVisual";
import { Reveal } from "@/components/Reveal";
import { useGsapScope } from "@/lib/gsap";
import { radialGlow } from "@/lib/palette";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

const VARIANT: Record<string, "api" | "analysis" | "models"> = {
  "insurance-api": "api",
  "hr-analytics": "analysis",
  "invoice-intelligence": "models",
};

const ACCENT: Record<Project["accent"], string> = {
  ember: "text-ember",
  flare: "text-flare",
  gold: "text-gold",
};

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

  // Subtle opposing parallax between the artwork and its index watermark.
  useGsapScope(root, (scope) => {
    gsap.fromTo(
      visual.current,
      { yPercent: -4 },
      {
        yPercent: 4,
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
      { yPercent: 12 },
      {
        yPercent: -12,
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
      ref={root}
      className="group relative border-t border-white/[0.07] py-16 first:border-t-0 sm:py-20 lg:py-28"
      data-cursor="hover"
    >
      {/* Oversized index watermark */}
      <span
        ref={watermark}
        aria-hidden
        className="stroke-text pointer-events-none absolute -top-2 right-0 select-none font-display text-[22vw] font-bold leading-none opacity-[0.07] sm:text-[16vw] lg:text-[11rem]"
      >
        {project.index}
      </span>

      <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Artwork */}
        <Reveal
          y={34}
          className={cn("lg:col-span-7", reversed && "lg:order-2")}
        >
          <div
            ref={visual}
            className="relative transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5"
          >
            <ProjectVisual variant={VARIANT[project.id] ?? "api"} />
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background: radialGlow("ember", 0.22, {
                  geometry: "60% 60% at 50% 50%",
                  stop: 70,
                }),
              }}
              aria-hidden
            />
          </div>
        </Reveal>

        {/* Copy */}
        <div
          className={cn(
            "lg:col-span-5",
            reversed && "lg:order-1",
          )}
        >
          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className={cn("label-mono", ACCENT[project.accent])}>
                {project.category}
              </span>
              <span className="hairline h-px w-8 border-t" aria-hidden />
              <span className="label-mono text-ash/70">{project.year}</span>
            </div>

            <h3 className="mt-5 font-display text-[clamp(1.55rem,3.1vw,2.4rem)] font-semibold leading-[1.08] tracking-tight text-bone">
              {project.title}
            </h3>

            <p className="mt-5 text-[0.98rem] leading-relaxed text-ash">
              {project.summary}
            </p>

            <ul className="mt-7 flex flex-col gap-3.5">
              {project.details.map((detail) => (
                <li key={detail} className="flex gap-3.5 text-[0.92rem] leading-relaxed text-mist/80">
                  <span
                    className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-flare"
                    aria-hidden
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>

            {/* Spec grid */}
            <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-3">
              {project.highlights.map((item) => (
                <div key={item.label} className="hairline border-t pt-3.5">
                  <dt className="label-mono text-ash/70">{item.label}</dt>
                  <dd className="mt-2 text-[0.82rem] leading-snug text-mist/90">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Stack */}
            <ul className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="hairline rounded-md border bg-white/[0.03] px-2.5 py-1.5 font-mono text-[0.7rem] tracking-wide text-mist/85"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {/* Link or a clearly marked placeholder */}
            <div className="mt-9">
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group/link inline-flex items-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-bone transition-colors hover:text-flare"
                >
                  View repository
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </a>
              ) : (
                <div className="inline-flex items-center gap-3 rounded-full border border-dashed border-white/15 bg-white/[0.015] px-4 py-2.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-ash/70" strokeWidth={1.8} />
                  <span className="font-mono text-[0.68rem] leading-tight tracking-wide text-ash/80">
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
