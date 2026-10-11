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

/* ------------------------------------------------------------------
   THE NUCLEUS
------------------------------------------------------------------ */

/** Radius of the whole ball, in the shared 0-100 box. */
const NUCLEUS_RADIUS = 6.8;

/**
 * Nucleon centre spacing.
 *
 * Just under two radii, so neighbours touch and slightly interpenetrate. That
 * overlap is wanted: these spheres are translucent, and where two of them cross
 * the fill doubles up into a darker junction, which reads as the contact shadow
 * between packed matter rather than as a rendering fault.
 */
const NUCLEON_STEP = 2.35;

type Nucleon = {
  /** Orthographic projection: x and y are already screen-space, z is depth. */
  x: number;
  y: number;
  z: number;
  r: number;
  /** The blue nucleons, against the platinum ones. */
  blue: boolean;
};

/** A small deterministic PRNG, so the nucleus is identical on every load. */
function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Packs the nucleus with nucleons on a jittered cubic lattice.
 *
 * A lattice rather than random placement, because random sequential packing jams
 * near 38% and leaves visible gaps: the spheres have to touch for the ball to
 * read as matter rather than as scattered dots. The jitter is what stops the
 * lattice reading as a grid, and the sort puts the far spheres down first so the
 * near ones occlude them.
 */
function buildNucleus(): Nucleon[] {
  const rand = mulberry(20261011);
  const out: Nucleon[] = [];
  const span = Math.ceil(NUCLEUS_RADIUS / NUCLEON_STEP);

  for (let i = -span; i <= span; i += 1) {
    for (let j = -span; j <= span; j += 1) {
      for (let k = -span; k <= span; k += 1) {
        const x = i * NUCLEON_STEP + (rand() - 0.5) * 0.24;
        const y = j * NUCLEON_STEP + (rand() - 0.5) * 0.24;
        const z = k * NUCLEON_STEP + (rand() - 0.5) * 0.24;
        // Keep the whole sphere inside the ball, not just its centre.
        if (Math.hypot(x, y, z) > NUCLEUS_RADIUS - 1.15) continue;
        out.push({ x, y, z, r: 1.12 + rand() * 0.18, blue: rand() < 0.42 });
      }
    }
  }

  return out.sort((a, b) => a.z - b.z);
}

const NUCLEONS = buildNucleus();

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
          {/* The wide wash the whole figure sits in. */}
          <radialGradient id="atom-bloom">
            <stop offset="0%" stopColor={P.accent} stopOpacity="0.5" />
            <stop offset="45%" stopColor={P.accent} stopOpacity="0.14" />
            <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
          </radialGradient>

          {/*
            Light between the nucleons, so the gaps inside the ball read as a
            dense, lit core rather than as black holes in the figure.
          */}
          <radialGradient id="atom-heart">
            <stop offset="0%" stopColor={P.bright} stopOpacity="0.8" />
            <stop offset="55%" stopColor={P.volt} stopOpacity="0.3" />
            <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
          </radialGradient>

          {/*
            The nucleons, lit from the upper left.
            Both are `objectBoundingBox`, so a single definition shades every
            sphere in the ball and the highlight stays a fixed direction across
            the whole nucleus. Bright core, mid body, dark terminator.
          */}
          <radialGradient id="nucleon-platinum" cx="0.34" cy="0.3" r="0.82">
            <stop offset="0%" stopColor="#fbfcff" />
            <stop offset="34%" stopColor="#dce5f2" />
            <stop offset="78%" stopColor="#93a4c0" />
            <stop offset="100%" stopColor="#4f5f7d" />
          </radialGradient>
          <radialGradient id="nucleon-blue" cx="0.34" cy="0.3" r="0.82">
            <stop offset="0%" stopColor="#f2f7ff" />
            <stop offset="30%" stopColor="#9cc2ff" />
            <stop offset="74%" stopColor="#4d8dff" />
            <stop offset="100%" stopColor="#1e4694" />
          </radialGradient>

          {/* Seats the ball: light falls off away from the key light. */}
          <radialGradient id="nucleus-shade" cx="0.35" cy="0.28" r="0.86">
            <stop offset="0%" stopColor={P.void} stopOpacity="0" />
            <stop offset="52%" stopColor={P.void} stopOpacity="0.1" />
            <stop offset="100%" stopColor={P.void} stopOpacity="0.62" />
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

        {/* The nucleus: outer wash, lit interior, then the packed nucleons. */}
        <circle cx="50" cy="50" r="23" fill="url(#atom-bloom)" />
        <circle cx="50" cy="50" r={NUCLEUS_RADIUS - 1.2} fill="url(#atom-heart)" />

        {NUCLEONS.map((nucleon, index) => {
          /** 0 at the back of the ball, 1 at the front. */
          const front = (nucleon.z + NUCLEUS_RADIUS) / (NUCLEUS_RADIUS * 2);
          return (
            <circle
              key={index}
              cx={50 + nucleon.x}
              cy={50 + nucleon.y}
              r={nucleon.r * (0.86 + front * 0.14)}
              fill={nucleon.blue ? "url(#nucleon-blue)" : "url(#nucleon-platinum)"}
              opacity={0.62 + front * 0.38}
            />
          );
        })}

        {/* Shading and the specular seat the ball in the light. */}
        <circle cx="50" cy="50" r={NUCLEUS_RADIUS} fill="url(#nucleus-shade)" />
        <circle cx="48.1" cy="48.1" r="2.1" fill={tintDeep("bright", 0.5)} />
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
