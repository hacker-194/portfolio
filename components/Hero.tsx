"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { GithubMark } from "@/components/BrandIcons";
import { MagneticButton } from "@/components/MagneticButton";
import { MaskedLines } from "@/components/MaskedLines";
import { Scramble } from "@/components/Scramble";
import { scrollToHash } from "@/components/SmoothScroll";
import { CORE_NODES } from "@/lib/core-nodes";
import { PROFILE } from "@/lib/site";
import { EASE_CINEMATIC } from "@/lib/motion";

/**
 * The sculpture is client-only and loaded on demand.
 *
 * WebGL has nothing to render on the server, and the renderer should not sit in
 * the initial payload for a reader whose machine cannot draw it. Everything the
 * sculpture says is repeated in the index row below, which is plain DOM, so the
 * hero reads complete before the canvas arrives.
 */
const IntelligenceCore = dynamic(
  () => import("@/components/IntelligenceCore").then((mod) => mod.IntelligenceCore),
  { ssr: false },
);

/** Ties the index row to the panel it fills. */
const CORE_PANEL_ID = "hero-core-panel";

export function Hero() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  /** Which capability the core is presenting, or null for none. */
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = CORE_NODES.find((node) => node.id === activeId) ?? null;

  /**
   * Entrance props for a block.
   *
   * `animate` is always defined on purpose: when the still branch supplies
   * `initial={false}`, an `undefined` animate target leaves those elements
   * stuck in the server-rendered hidden state.
   */
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 1,
      ease: EASE_CINEMATIC,
      delay: reduce ? 0 : delay,
    },
  });

  return (
    <section
      id="home"
      className="panel-deep relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {/*
        The sculpture.
        A glass core with four capability nodes around it, turning slowly and
        leaning with the pointer. It takes pointer events, so the copy column
        above it releases them everywhere it is not actually drawn. On a wide
        screen it is held to the right; on a small one it sits behind the copy.
      */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <IntelligenceCore
          activeId={activeId}
          onActivate={setActiveId}
          still={reduce}
          className="absolute inset-0 lg:left-[40%]"
        />
      </div>

      {/* Light, then falloff, then a single layer of grain over both. */}
      <div className="keylight pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div className="vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      {/*
        A scrim weighted to the copy column. Without it the figure would run
        under the text; with it the light falls off exactly where the page is
        read, which is how a lit set is built.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(100deg,rgba(0,2,6,0.94)_0%,rgba(0,2,6,0.66)_36%,transparent_70%)] lg:bg-[linear-gradient(100deg,rgba(0,2,6,0.88)_0%,rgba(0,2,6,0.42)_32%,transparent_60%)]"
        aria-hidden
      />
      <div className="grain pointer-events-none absolute inset-0 z-[3]" aria-hidden />

      {/*
        Copy.
        The container passes pointer events through and the drawn column takes
        them back: a full-width box with events would swallow every hover meant
        for the sculpture, including the empty space beside the text.
      */}
      <div className="pointer-events-none relative z-[4] mx-auto flex w-full max-w-[1600px] flex-1 items-center px-5 pb-28 pt-32 sm:px-8 sm:pb-32 lg:px-12">
        <div className="pointer-events-auto max-w-[46rem]">
          <motion.div
            {...rise(0.1)}
            className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="inline-flex items-center gap-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {/* A sentence, not a label: sentence case at the size floor reads
                  faster than tracked upper case, and this is the first thing a
                  hiring reader scans. */}
              <span className="font-mono text-xs leading-relaxed tracking-[0.06em] text-soft">
                {PROFILE.availability}
              </span>
            </span>
            <span className="label-mono text-muted">{PROFILE.location}</span>
          </motion.div>

          <h1
            aria-label={PROFILE.name}
            className="display-tight text-[clamp(3.1rem,9.6vw,9.25rem)] font-medium"
          >
            <MaskedLines
              lines={["Khagendra", "Luitel"]}
              delay={0.2}
              stagger={0.1}
              lineClassName="font-display text-bright"
            />
          </h1>

          <motion.div {...rise(0.5)} className="mt-8">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
                <Scramble text={PROFILE.role} delay={650} />
              </span>
              <motion.span
                className="accent-gradient h-px flex-1 origin-left"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reduce ? 0 : 1.4,
                  ease: EASE_CINEMATIC,
                  delay: reduce ? 0 : 0.7,
                }}
                aria-hidden
              />
            </div>
          </motion.div>

          {/* The statement, set large: on this page the sentence is the design. */}
          <p className="mt-10 max-w-2xl font-display text-[clamp(1.15rem,1.9vw,1.7rem)] leading-[1.45] text-soft">
            <MaskedLines lines={PROFILE.headline} delay={0.85} stagger={0.07} />
          </p>

          <motion.div
            {...rise(1.15)}
            className="mt-12 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <MagneticButton
              variant="primary"
              onClick={() => scrollToHash("#projects")}
              icon={<ArrowRight className="h-4 w-4" strokeWidth={2.2} />}
            >
              View Projects
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              href={PROFILE.github}
              external
              icon={<GithubMark className="h-4 w-4" />}
            >
              GitHub
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              href={PROFILE.resume}
              external
              ariaLabel="Open curriculum vitae (PDF)"
              icon={<Download className="h-4 w-4" strokeWidth={1.9} />}
            >
              Résumé
            </MagneticButton>
          </motion.div>

          {/*
            The readable twin of the sculpture.

            Every node in the core is a real button here, same four, same
            order. The canvas is decoration; this is the path a keyboard or a
            screen reader takes, and it is what keeps the panels a feature
            rather than a hover-only trick. Height is reserved below so that
            revealing a panel never moves the hero.
          */}
          <motion.div {...rise(1.3)} className="mt-12">
            <div className="hairline flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-5">
              <span className="label-mono text-muted">Core</span>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {CORE_NODES.map((node) => {
                  const on = node.id === activeId;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveId(node.id)}
                        onMouseLeave={() => setActiveId(null)}
                        onFocus={() => setActiveId(node.id)}
                        onBlur={() => setActiveId(null)}
                        aria-current={on ? "true" : undefined}
                        aria-controls={CORE_PANEL_ID}
                        className={
                          on
                            ? "font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors duration-300"
                            : "font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-bright"
                        }
                      >
                        {node.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/*
              `aria-live` is the point of this region. The panel appears in
              response to focus or hover, which assistive tech does not announce
              on its own, so without it a screen reader hears four buttons and
              never learns what selecting one revealed.
            */}
            <div id={CORE_PANEL_ID} aria-live="polite" className="mt-5 min-h-[4.5rem]">
              {active ? (
                <div className="glass-card hairline max-w-md rounded-xl border p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-sm font-semibold text-bright">
                      {active.label}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                      {active.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-soft">{active.blurb}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {active.keywords.map((word) => (
                      <li
                        key={word}
                        className="font-mono text-[0.6rem] tracking-wide text-muted"
                      >
                        {word}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Meta bar */}
      <motion.div
        className="pointer-events-none relative z-[4] mx-auto w-full max-w-[1600px] px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reduce ? 0 : 1.1,
          ease: EASE_CINEMATIC,
          delay: reduce ? 0 : 1.35,
        }}
      >
        <div className="hairline pointer-events-auto flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          <div className="flex items-center gap-5">
            {/* The hero is the cover, but it is still the first section of the
                running order: the folio every heading below carries starts
                here, so the nav's numbers have somewhere to land. */}
            <span className="font-mono text-xs tabular-nums text-muted">01</span>
            <button
              type="button"
              onClick={() => scrollToHash("#about")}
              className="group flex items-center gap-3"
            >
              <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full border border-bright/15 transition-colors duration-500 group-hover:border-accent/60">
                <motion.span
                  animate={{ y: reduce ? 0 : [-6, 6, -6] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                  className="flex"
                >
                  <ArrowDown className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
                </motion.span>
              </span>
              <span className="label-mono text-muted transition-colors group-hover:text-bright">
                Scroll to explore
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="label-mono text-muted">{PROFILE.timezone}</span>
            <span className="label-mono hidden text-muted sm:inline">
              {PROFILE.discipline}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
