"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PIPELINE_STAGES } from "@/lib/data";
import { useGsapScope } from "@/lib/gsap";
import { tint } from "@/lib/palette";
import { cn } from "@/lib/utils";

/**
 * "Futuristic intelligence pipeline".
 *
 * A vertical INPUT → LLM → REASONING → TOOLS → AGENT → OUTPUT track whose
 * connector draws itself and whose stage packets travel down as the section is
 * scrolled. Driven entirely by GSAP ScrollTrigger so the animation is tied to
 * the reader's position rather than a timer.
 */
export function PipelineDiagram({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement | null>(null);

  useGsapScope(root, (scope) => {
    gsap.fromTo(
      "[data-pipeline-rail]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: scope,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      },
    );

    gsap.utils.toArray<HTMLElement>("[data-pipeline-stage]").forEach((stage, index) => {
      gsap.fromTo(
        stage,
        { opacity: 0.18, x: -18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stage,
            start: "top 82%",
            end: "top 55%",
            scrub: 0.5,
          },
        },
      );

      gsap.fromTo(
        `[data-pipeline-dot='${index}']`,
        { scale: 0.18, opacity: 0.25 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stage,
            start: "top 85%",
            end: "top 62%",
            scrub: 0.4,
          },
        },
      );

      const packet = stage.querySelector("[data-packet]");
      if (packet) {
        gsap.fromTo(
          packet,
          { yPercent: 0, opacity: 0 },
          {
            yPercent: 460,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top 80%",
              end: "bottom 30%",
              scrub: 0.4,
            },
          },
        );
      }
    });
  });

  return (
    <div ref={root} className={cn("relative", className)}>
      {/* Rail */}
      <div
        className="absolute left-[1.35rem] top-2 bottom-2 w-px bg-white/[0.07]"
        aria-hidden
      />
      <div
        data-pipeline-rail
        className="ember-gradient absolute left-[1.35rem] top-2 bottom-2 w-px origin-top"
        aria-hidden
      />

      <ol className="relative flex flex-col gap-2">
        {PIPELINE_STAGES.map((stage, index) => (
          <li
            key={stage.id}
            data-pipeline-stage
            className="group relative flex items-center gap-5 rounded-xl py-3 pl-0 pr-4 transition-colors duration-300 hover:bg-white/[0.02]"
          >
            {/* Node dot */}
            <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center">
              <span
                data-pipeline-dot={index}
                className="absolute inset-0 rounded-full border border-flare/35 bg-void"
              />
              <span
                className="animate-flicker absolute inset-[6px] rounded-full border border-ember/25"
                aria-hidden
              />
              <span className="relative font-mono text-[0.6rem] tracking-widest text-flare">
                {String(index + 1).padStart(2, "0")}
              </span>
            </span>

            {/* Vertical packet travelling down the rail */}
            <span
              data-packet
              className="absolute left-[1.15rem] top-0 h-2 w-2 rounded-full bg-gold opacity-0"
              style={{ boxShadow: `0 0 14px 3px ${tint("ember", 0.55)}` }}
              aria-hidden
            />

            <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <span className="font-display text-[1.05rem] font-semibold uppercase tracking-[0.14em] text-bone sm:text-[1.2rem]">
                {stage.label}
              </span>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ash/80">
                {stage.detail}
              </span>
            </div>

            {index < PIPELINE_STAGES.length - 1 ? (
              <span
                className="pointer-events-none absolute left-[1.35rem] top-[calc(100%-0.35rem)] -translate-x-1/2 font-mono text-[0.7rem] text-ember/60"
                aria-hidden
              >
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
