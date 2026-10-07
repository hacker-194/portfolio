"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { useLoad, useScrollLock } from "@/lib/load";
import { radialGlow } from "@/lib/palette";
import { PROFILE } from "@/lib/site";
import { EASE_CINEMATIC } from "@/lib/motion";

const MIN_DURATION = 1100;
const MAX_DURATION = 3200;

const PHASES = [
  "Initialising runtime",
  "Loading visual assets",
  "Compiling neural graph",
  "Ready",
] as const;

/**
 * Intro curtain. It tracks genuine page readiness (`window.load`, fonts) so the
 * sequence covers real work rather than being a decorative fake delay, then
 * splits open to reveal the hero.
 */
export function Preloader() {
  const { phase, finish, skip } = useLoad();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const [progress, setProgress] = useState(0);
  const loadedRef = useRef(false);
  const doneRef = useRef(false);

  const active = phase !== "ready";
  useScrollLock(active);

  // Reduced motion: no curtain at all.
  useEffect(() => {
    if (reduce) skip();
  }, [reduce, skip]);

  useEffect(() => {
    if (reduce || !active) return;

    const started = performance.now();

    const onLoad = () => {
      loadedRef.current = true;
    };

    if (document.readyState === "complete") loadedRef.current = true;
    else window.addEventListener("load", onLoad, { once: true });

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(() => {
        loadedRef.current = true;
      });
    }

    let frame = 0;
    let value = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      const loaded = loadedRef.current || elapsed > MAX_DURATION;

      // Ease toward a ceiling; the ceiling lifts once assets are in.
      const ceiling = loaded ? 1 : 0.86;
      value += (ceiling - value) * 0.06;

      if (loaded && elapsed > MIN_DURATION && value > 0.985) {
        value = 1;
        setProgress(1);
        if (!doneRef.current) {
          doneRef.current = true;
          window.setTimeout(finish, 260);
        }
        return;
      }

      setProgress(value);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
    };
  }, [reduce, active, finish]);

  if (reduce || !active) return null;

  const exiting = phase === "exiting";
  const percent = Math.round(progress * 100);
  const label =
    PHASES[Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length))];

  return (
    <div
      className="fixed inset-0 z-[90]"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* Two panels split apart like a title sequence. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-void"
        initial={false}
        animate={exiting ? { y: "-101%" } : { y: "0%" }}
        transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-void"
        initial={false}
        animate={exiting ? { y: "101%" } : { y: "0%" }}
        transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
      />

      {/* Accent seam that flashes as the curtain opens. */}
      <motion.div
        className="ember-gradient absolute inset-x-0 top-1/2 h-px"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? [0, 1, 0] : 0 }}
        transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6"
        initial={false}
        animate={
          exiting ? { opacity: 0, y: -26 } : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
      >
        <div className="relative grid place-items-center">
          <span
            className="animate-flicker absolute h-28 w-28 rounded-full"
            style={{ background: radialGlow("ember", 0.28, { stop: 68 }) }}
            aria-hidden
          />
          <span className="font-display relative text-6xl font-semibold tracking-tight text-bone sm:text-7xl">
            {PROFILE.initials}
            <span className="text-ember">.</span>
          </span>
        </div>

        <div className="flex w-[min(78vw,22rem)] flex-col gap-3">
          <div className="hairline relative h-px w-full overflow-hidden bg-white/10">
            <motion.div
              className="ember-gradient absolute inset-y-0 left-0 origin-left"
              style={{ scaleX: progress, width: "100%" }}
            />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="label-mono text-ash">{label}</span>
            <span className="font-mono text-xs tabular-nums text-flare">
              {String(percent).padStart(3, "0")}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
