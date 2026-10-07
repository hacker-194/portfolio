"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { ArrowDown, ArrowRight } from "lucide-react";
import { GithubMark } from "@/components/BrandIcons";
import { Embers } from "@/components/Embers";
import { MaskedLines } from "@/components/MaskedLines";
import { MagneticButton } from "@/components/MagneticButton";
import { NarutoHero } from "@/components/NarutoHero";
import { scrollToHash } from "@/components/SmoothScroll";
import { useLoad } from "@/lib/load";
import { gradientLayers, radialGlow } from "@/lib/palette";
import { PROFILE } from "@/lib/site";
import { EASE_CINEMATIC } from "@/lib/motion";

export function Hero() {
  const { phase } = useLoad();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const active = phase !== "loading";

  /**
   * Entrance props for a block.
   *
   * `animate` is always defined on purpose: when the still branch supplies
   * `initial={false}`, an `undefined` animate target leaves those elements
   * stuck in the server-rendered hidden state.
   */
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: active ? 1 : 0, y: active ? 0 : 22 },
    transition: {
      duration: reduce ? 0 : 0.9,
      ease: EASE_CINEMATIC,
      delay: reduce ? 0 : delay,
    },
  });

  return (
    <section
      id="home"
      className="relative isolate flex h-[100svh] min-h-[660px] w-full flex-col overflow-hidden"
    >
      {/* Artwork */}
      <NarutoHero ready={active} />

      {/* Cinematic grade: guarantees the headline sits on darkness. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          // Keeps the headline band at >6:1 contrast while the artwork stays
          // fully readable from roughly the middle of the viewport rightwards.
          background:
            "linear-gradient(100deg, rgba(5,4,3,0.97) 0%, rgba(5,4,3,0.93) 32%, rgba(5,4,3,0.74) 50%, rgba(5,4,3,0.34) 68%, rgba(5,4,3,0.14) 84%, rgba(5,4,3,0.46) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%] bg-gradient-to-t from-void via-void/80 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[26%] bg-gradient-to-b from-void/90 via-void/35 to-transparent"
        aria-hidden
      />

      {/* Ambient ember wash */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-70"
        style={{
          background: gradientLayers(
            radialGlow("ember", 0.2, {
              geometry: "80% 60% at 78% 42%",
              stop: 58,
            }),
            radialGlow("burnt", 0.16, {
              geometry: "60% 50% at 12% 88%",
              stop: 62,
            }),
          ),
        }}
        aria-hidden
      />

      {/* Embers — denser on the right where the artwork sits */}
      <div className="pointer-events-none absolute inset-0 z-[3]">
        <Embers count={70} interactive />
      </div>

      {/* Content */}
      <div className="relative z-[4] mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 pb-28 pt-28 sm:px-8 sm:pb-32 lg:px-12">
        <div className="max-w-[min(48rem,58vw)] max-lg:max-w-full">
          {/* Availability chip */}
          <motion.div {...rise(0.1)} className="mb-7 flex flex-wrap items-center gap-3 sm:mb-9">
            <span className="glass-panel hairline inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flare" />
              </span>
              <span className="label-mono text-mist/90">{PROFILE.availability}</span>
            </span>
            <span className="label-mono hidden text-ash/70 sm:inline">
              {PROFILE.location}
            </span>
          </motion.div>

          {/* Name */}
          <h1
            aria-label={PROFILE.name}
            className="display-tight text-[clamp(2.3rem,6.1vw,5.6rem)] font-bold uppercase"
          >
            <MaskedLines
              lines={["Khagendra", "Luitel"]}
              active={active}
              delay={0.2}
              stagger={0.12}
              lineClassName="font-display whitespace-nowrap"
              renderLine={(line, index) => (
                <span
                  className={
                    index === 1
                      ? "text-ember-gradient block whitespace-nowrap"
                      : "block whitespace-nowrap text-bone"
                  }
                >
                  {line}
                </span>
              )}
            />
          </h1>

          {/* Role */}
          <motion.div
            {...rise(0.55)}
            className="mt-6 flex items-center gap-4 sm:mt-7"
          >
            <span className="font-display text-[0.82rem] font-semibold uppercase tracking-[0.38em] text-flare sm:text-[0.95rem]">
              {PROFILE.role}
            </span>
            <motion.span
              className="ember-gradient h-px flex-1 origin-left"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: active ? 1 : 0 }}
              transition={{
                duration: reduce ? 0 : 1.3,
                ease: EASE_CINEMATIC,
                delay: reduce ? 0 : 0.75,
              }}
              aria-hidden
            />
          </motion.div>

          {/* Statement */}
          <p className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-mist/85 sm:mt-8 sm:text-[1.12rem]">
            <MaskedLines
              lines={PROFILE.headline}
              active={active}
              delay={0.85}
              stagger={0.08}
            />
          </p>

          {/* CTAs */}
          <motion.div {...rise(1.15)} className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11 sm:gap-4">
            <MagneticButton
              variant="primary"
              onClick={() => scrollToHash("#projects")}
              icon={<ArrowRight className="h-4 w-4" strokeWidth={2.2} />}
            >
              Explore my work
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              href={PROFILE.github}
              external
              icon={<GithubMark className="h-4 w-4" />}
            >
              View GitHub
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Meta bar */}
      <motion.div
        className="relative z-[4] mx-auto w-full max-w-[1600px] px-5 pb-7 sm:px-8 sm:pb-9 lg:px-12"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{
          duration: reduce ? 0 : 1,
          ease: EASE_CINEMATIC,
          delay: reduce ? 0 : 1.4,
        }}
      >
        <div className="hairline flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          <button
            type="button"
            onClick={() => scrollToHash("#about")}
            className="group flex items-center gap-3"
          >
            <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full border border-white/12">
              <motion.span
                animate={{ y: reduce ? 0 : [-7, 7, -7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="flex"
              >
                <ArrowDown className="h-3.5 w-3.5 text-flare" strokeWidth={2} />
              </motion.span>
            </span>
            <span className="label-mono text-ash transition-colors group-hover:text-bone">
              Scroll to explore
            </span>
          </button>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="label-mono text-ash/80">
              Data Science Intern · Cloud Nepal Web
            </span>
            <span className="label-mono hidden text-ash/60 md:inline">
              {PROFILE.timezone}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
