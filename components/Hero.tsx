"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
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
      duration: reduce ? 0 : 0.6,
      ease: EASE_CINEMATIC,
      delay: reduce ? 0 : delay,
    },
  });

  return (
    <section
      id="home"
      className="panel-deep relative isolate flex min-h-[100svh] w-full flex-col justify-between overflow-hidden"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:px-12">
        <div className="max-w-4xl">
          {/* Status Badge */}
          <motion.div {...rise(0.05)}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              <span>{PROFILE.availability}</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...rise(0.12)}
            className="mt-6 text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-[1.08] tracking-tight text-bright"
          >
            I turn machine learning into dependable software.
          </motion.h1>

          {/* Statement */}
          <motion.p
            {...rise(0.2)}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg sm:leading-relaxed"
          >
            I&apos;m <span className="font-semibold text-bright">{PROFILE.name}</span>, a Machine Learning Engineer based in {PROFILE.location}. I work across the full lifecycle: training PyTorch models, structuring data pipelines, and serving low-latency APIs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...rise(0.28)}
            className="mt-9 flex flex-wrap items-center gap-3.5 sm:gap-4"
          >
            <MagneticButton
              variant="primary"
              onClick={() => scrollToHash("#projects")}
              icon={<ArrowRight className="h-4 w-4" strokeWidth={2.2} />}
            >
              View Featured Work
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              href={PROFILE.resume}
              external
              ariaLabel="Open curriculum vitae (PDF)"
            >
              Curriculum Vitae ↗
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              href={PROFILE.github}
              external
              ariaLabel="Open GitHub profile"
            >
              GitHub ↗
            </MagneticButton>
          </motion.div>

          {/* Capabilities Grid */}
          <motion.div {...rise(0.36)} className="mt-14 sm:mt-16">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {CORE_NODES.map((node) => (
                <div
                  key={node.id}
                  className="rounded-xl border border-bright/10 bg-panel/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-panel2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-semibold tracking-tight text-bright">
                      {node.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                    {node.blurb}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {node.keywords.slice(0, 2).map((word) => (
                      <span
                        key={word}
                        className="rounded border border-bright/10 bg-bright/5 px-2 py-0.5 font-mono text-[0.6875rem] text-soft"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Meta bar */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12"
        {...rise(0.4)}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bright/10 pt-5">
          <button
            type="button"
            onClick={() => scrollToHash("#projects")}
            className="group flex items-center gap-2.5 text-xs text-muted transition-colors hover:text-bright"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full border border-bright/15 transition-colors group-hover:border-accent/60">
              <ArrowDown className="h-3 w-3 text-accent transition-transform group-hover:translate-y-0.5" strokeWidth={2} />
            </span>
            <span>Explore technical work</span>
          </button>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
            <span>{PROFILE.timezone}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{PROFILE.discipline}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
