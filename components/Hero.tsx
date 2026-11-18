"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { ArrowDown, ArrowRight } from "lucide-react";
import { scrollToHash } from "@/components/ScrollSync";
import { CORE_NODES } from "@/lib/core-nodes";
import { PROFILE } from "@/lib/site";
import { EASE_CINEMATIC } from "@/lib/motion";

export function Hero() {
  const reduce = useStillMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.5,
      ease: EASE_CINEMATIC,
      delay: reduce ? 0 : delay,
    },
  });

  return (
    <section id="home" className="relative flex min-h-[88svh] flex-col justify-between border-b border-bright/10">
      <div className="mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-12 px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:grid-cols-12 lg:gap-16 lg:px-12">
        <div className="lg:col-span-7">
          <motion.div {...rise(0.05)} className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label-mono text-muted">{PROFILE.role}</span>
            <span className="h-px w-8 bg-edge" aria-hidden />
            <span className="text-sm text-accent">{PROFILE.availability}</span>
          </motion.div>

          <motion.h1
            {...rise(0.1)}
            className="mt-7 max-w-4xl font-display text-[clamp(3.2rem,7vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.045em] text-bright"
          >
            I train models, then build the systems around them.
          </motion.h1>

          <motion.p
            {...rise(0.15)}
            className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
          >
            I&apos;m <span className="font-medium text-bright">{PROFILE.name}</span>, based in {PROFILE.location}. My work spans data preparation, model evaluation and API deployment.
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              onClick={() => scrollToHash("#projects")}
              className="group inline-flex items-center gap-2 bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-bright focus-visible:outline-offset-4"
            >
              View selected work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </button>
            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border-b border-edge py-2 text-sm font-medium text-bright transition-colors hover:border-accent hover:text-accent"
            >
              Curriculum Vitae
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border-b border-edge py-2 text-sm font-medium text-bright transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </a>
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:pt-24">
          <div className="mb-5 flex items-center justify-between border-b border-edge pb-3">
            <span className="label-mono text-muted">Areas of focus</span>
            <span className="font-mono text-xs text-muted">01 / 04</span>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
            {CORE_NODES.map((node, index) => (
              <li key={node.id} className="border-b border-edge py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-xl font-medium text-bright">
                    <span className="mr-3 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                    {node.label}
                  </h2>
                  <span className="shrink-0 text-xs text-muted">{node.status}</span>
                </div>
                <p className="mt-2 pl-8 text-sm leading-relaxed text-muted">{node.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-5 pb-7 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-edge pt-4">
          <button
            type="button"
            onClick={() => scrollToHash("#projects")}
            className="group flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-bright"
          >
            <ArrowDown className="h-4 w-4 text-accent transition-transform group-hover:translate-y-0.5" strokeWidth={1.8} />
            <span>Scroll to selected work</span>
          </button>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{PROFILE.location}</span>
            <span className="hidden sm:inline">{PROFILE.timezone}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
