"use client";

import { useEffect, useRef } from "react";
import { PALETTE_DEEP as P, tintDeep } from "@/lib/palette";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * The hero sculpture: a nucleus with three orbits turning around it, each one
 * carrying a word for the frontier being studied (LLM, Transformers, RAG).
 *
 * This replaced the neural-network mesh that used to sit behind the hero. The
 * atom says the same thing more plainly: one core, three paths around it, and
 * the vocabulary of the work riding those paths.
 *
 * It is SVG and DOM rather than canvas. The rings are static ellipse geometry,
 * so the only thing that changes each frame is where each carrier sits on its
 * ring, and the labels stay real HTML text: they take the site's own type, they
 * stay upright the whole way round (text riding a 3D transform would flip at the
 * back), and they cost three attribute writes each per frame.
 *
 * Decorative, so it is hidden from assistive tech, and it holds one still frame
 * when the visitor prefers reduced motion.
 */

type Orbit = {
  label: string;
  /** Semi-axes and ring tilt, in the 0-100 box the SVG and the labels share. */
  rx: number;
  ry: number;
  tilt: number;
  /** Seconds per full turn, and where the carrier starts on that turn. */
  period: number;
  phase: number;
};

const ORBITS: Orbit[] = [
  { label: "LLM", rx: 45, ry: 13, tilt: -22, period: 34, phase: 0 },
  { label: "Transformers", rx: 40, ry: 24, tilt: 54, period: 44, phase: 0.36 },
  { label: "RAG", rx: 33, ry: 30, tilt: 112, period: 56, phase: 0.71 },
];

/**
 * A point on a tilted ellipse, in the shared 0-100 box.
 *
 * `depth` is the turn's phase (-1 at one end, 1 at the other) rather than a real
 * depth buffer.
 *
 * ponytail: depth is a sinusoid, not an intersection test, so a carrier passes
 * in front of the nucleus by fading rather than by occluding it. Single-figure
 * hero, no overlap to resolve; swap in a z-sort against the core radius if the
 * atom ever gains a second layer.
 */
function pointOn(orbit: Orbit, turn: number) {
  const angle = turn * Math.PI * 2;
  const tilt = (orbit.tilt * Math.PI) / 180;
  const lx = orbit.rx * Math.cos(angle);
  const ly = orbit.ry * Math.sin(angle);
  return {
    x: 50 + lx * Math.cos(tilt) - ly * Math.sin(tilt),
    y: 50 + lx * Math.sin(tilt) + ly * Math.cos(tilt),
    depth: Math.sin(angle),
  };
}

export function AtomCore({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const carriers = Array.from(host.querySelectorAll<HTMLElement>("[data-carrier]"));
    const arcs = Array.from(host.querySelectorAll<SVGElement>("[data-arc]"));
    const beads = Array.from(host.querySelectorAll<SVGCircleElement>("[data-bead]"));
    const still = prefersReducedMotion();
    const start = performance.now();

    let raf = 0;
    let running = true;

    const draw = (now: number) => {
      const elapsed = still ? 0 : (now - start) / 1000;

      ORBITS.forEach((orbit, index) => {
        const turn = (orbit.phase + elapsed / orbit.period) % 1;
        const point = pointOn(orbit, turn);
        /** 0 at the back of the turn, 1 at the front. */
        const front = (point.depth + 1) / 2;

        const carrier = carriers[index];
        if (carrier) {
          carrier.style.left = `${point.x}%`;
          carrier.style.top = `${point.y}%`;
          carrier.style.opacity = `${0.45 + front * 0.55}`;
          carrier.style.transform = `translate(-50%, -50%) scale(${0.9 + front * 0.12})`;
        }

        // The lit arc is driven from the same turn as the carrier, so the two
        // cannot drift apart, and it keeps the ring reading as a turning orbit
        // even while the carrier is dimmed round the back.
        const arc = arcs[index];
        if (arc) arc.style.strokeDashoffset = `${-turn * 100}`;

        const bead = beads[index];
        if (bead) {
          bead.setAttribute("cx", point.x.toFixed(2));
          bead.setAttribute("cy", point.y.toFixed(2));
          bead.setAttribute("r", (0.8 + front * 0.5).toFixed(2));
        }
      });
    };

    const tick = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    if (still) {
      draw(start);
    } else {
      raf = requestAnimationFrame(tick);
    }

    // Stop while the hero is off screen, the same bargain the canvas figures
    // make: nothing runs for a section nobody is looking at.
    const observer = new IntersectionObserver(([entry]) => {
      if (still) return;
      if (entry.isIntersecting) {
        if (!running) {
          running = true;
          raf = requestAnimationFrame(tick);
        }
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    observer.observe(host);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className={cn("relative aspect-square", className)}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <radialGradient id="atom-bloom">
            <stop offset="0%" stopColor={P.accent} stopOpacity="0.5" />
            <stop offset="45%" stopColor={P.accent} stopOpacity="0.14" />
            <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="atom-core">
            <stop offset="0%" stopColor={P.bright} />
            <stop offset="55%" stopColor={P.ice} />
            <stop offset="100%" stopColor={P.volt} stopOpacity="0.7" />
          </radialGradient>
        </defs>

        {/* Orbits: a faint ring, the lit arc trailing the bead, then the bead. */}
        {ORBITS.map((orbit, index) => (
          <g key={orbit.label} transform={`rotate(${orbit.tilt} 50 50)`}>
            <ellipse
              cx="50"
              cy="50"
              rx={orbit.rx}
              ry={orbit.ry}
              fill="none"
              stroke={tintDeep("volt", 0.14)}
              strokeWidth="0.3"
            />
            <ellipse
              data-arc={index}
              cx="50"
              cy="50"
              rx={orbit.rx}
              ry={orbit.ry}
              fill="none"
              pathLength={100}
              stroke={tintDeep("accent", 0.9)}
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeDasharray="16 84"
            />
            <circle data-bead={index} cx="50" cy="50" r="1" fill={tintDeep("bright", 0.95)} />
          </g>
        ))}

        {/* Nucleus: the bloom, the core, and the nucleons packed inside it. */}
        <circle cx="50" cy="50" r="20" fill="url(#atom-bloom)" />
        <circle cx="50" cy="50" r="4.4" fill="url(#atom-core)" />
        <g fill={tintDeep("bright", 0.8)}>
          <circle cx="48.6" cy="48.8" r="1.15" />
          <circle cx="51.4" cy="49.2" r="1.15" />
          <circle cx="49.6" cy="51.6" r="1.15" />
          <circle cx="51.1" cy="51.3" r="0.9" />
        </g>
      </svg>

      {/* Each label rides its own orbit. Position and scale are set per frame. */}
      {ORBITS.map((orbit) => (
        <span
          key={orbit.label}
          data-carrier
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-volt/25 bg-void/80 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-soft shadow-[0_0_24px_-8px_rgba(77,141,255,0.6)] sm:text-[0.68rem]"
        >
          {orbit.label}
        </span>
      ))}
    </div>
  );
}

export default AtomCore;
