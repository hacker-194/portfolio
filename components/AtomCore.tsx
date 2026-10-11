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
/**
 * Degrees the whole figure turns toward the pointer.
 *
 * Small on purpose: enough that the sculpture reads as a physical object under
 * the cursor, not so much that the labels start to lean.
 */
const MAX_TILT = 7;

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

/**
 * Radius of the whole ball, in the shared 0-100 box.
 *
 * Deliberately small against the orbits. A large core reads as a cartoon atom
 * (a fat ball with three rings round it); a small, fine-grained one reads as an
 * instrument, and it lets the orbits carry the composition.
 */
const NUCLEUS_RADIUS = 4.6;

/**
 * Nucleon centre spacing.
 *
 * Just under two radii, so neighbours touch and slightly interpenetrate. That
 * overlap is wanted: these spheres are translucent, and where two of them cross
 * the fill doubles up into a darker junction, which reads as the contact shadow
 * between packed matter rather than as a rendering fault.
 */
const NUCLEON_STEP = 1.5;

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
        if (Math.hypot(x, y, z) > NUCLEUS_RADIUS - 0.78) continue;
        out.push({ x, y, z, r: 0.58 + rand() * 0.12, blue: rand() < 0.42 });
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

    /*
     * Pointer response.
     *
     * The figure turns a few degrees toward the cursor. The pointer writes a
     * target and nothing else: the current angles ease toward it inside the
     * frame loop that is already running, so this needs no second rAF loop and
     * no React render. Off entirely for touch and for reduced motion, where a
     * figure leaning at the finger would be the only thing moving.
     */
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0, drawnX: 99, drawnY: 99 };
    const interactive =
      !still && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0) return;
      const across = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const down = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      tilt.targetX = Math.max(-1, Math.min(1, across)) * MAX_TILT;
      tilt.targetY = -Math.max(-1, Math.min(1, down)) * MAX_TILT;
    };
    const restTheFigure = () => {
      tilt.targetX = 0;
      tilt.targetY = 0;
    };

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("blur", restTheFigure);
      window.addEventListener("pointerleave", restTheFigure);
    }

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
          bead.setAttribute("r", (0.55 + front * 0.35).toFixed(2));
        }
      });

      if (interactive) {
        tilt.x += (tilt.targetX - tilt.x) * 0.07;
        tilt.y += (tilt.targetY - tilt.y) * 0.07;
        // Only touch the DOM once the frame actually differs from the last one
        // written, which is most frames spent resting at the centre.
        if (Math.abs(tilt.x - tilt.drawnX) > 0.01 || Math.abs(tilt.y - tilt.drawnY) > 0.01) {
          tilt.drawnX = tilt.x;
          tilt.drawnY = tilt.y;
          host.style.transform = `perspective(1400px) rotateX(${tilt.y.toFixed(3)}deg) rotateY(${tilt.x.toFixed(3)}deg)`;
        }
      }
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
      if (interactive) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("blur", restTheFigure);
        window.removeEventListener("pointerleave", restTheFigure);
      }
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
            <stop offset="0%" stopColor={P.accent} stopOpacity="0.26" />
            <stop offset="45%" stopColor={P.accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
          </radialGradient>

          {/*
            Light between the nucleons, so the gaps inside the ball read as a
            dense, lit core rather than as black holes in the figure.
          */}
          <radialGradient id="atom-heart">
            <stop offset="0%" stopColor={P.bright} stopOpacity="0.42" />
            <stop offset="55%" stopColor={P.volt} stopOpacity="0.14" />
            <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
          </radialGradient>

          {/*
            The nucleons, lit from the upper left.
            Both are `objectBoundingBox`, so a single definition shades every
            sphere in the ball and the highlight stays one fixed direction
            across the whole nucleus.

            Both tones are desaturated steel. A first pass ran one of them at
            full electric blue and the ball read as candy: at this size the eye
            takes saturation for plastic, and two greys a step apart read as
            machined metal instead. The falloff is wide and the highlight is
            small, which is what keeps a sphere from looking like a toy.
          */}
          <radialGradient id="nucleon-steel" cx="0.36" cy="0.32" r="0.94">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="16%" stopColor="#d7e0ee" />
            <stop offset="58%" stopColor="#98a5bb" />
            <stop offset="86%" stopColor="#5a6478" />
            <stop offset="100%" stopColor="#454e61" />
          </radialGradient>
          <radialGradient id="nucleon-cool" cx="0.36" cy="0.32" r="0.94">
            <stop offset="0%" stopColor="#f6f9ff" />
            <stop offset="16%" stopColor="#c8d4e8" />
            <stop offset="58%" stopColor="#8798b6" />
            <stop offset="86%" stopColor="#4e5b76" />
            <stop offset="100%" stopColor="#3b465c" />
          </radialGradient>

          {/* Seats the ball: light falls off away from the key light. */}
          <radialGradient id="nucleus-shade" cx="0.36" cy="0.3" r="0.9">
            <stop offset="0%" stopColor={P.void} stopOpacity="0" />
            <stop offset="58%" stopColor={P.void} stopOpacity="0.08" />
            <stop offset="100%" stopColor={P.void} stopOpacity="0.5" />
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
              stroke={tintDeep("accent", 0.85)}
              strokeWidth="0.42"
              strokeLinecap="round"
              strokeDasharray="16 84"
            />
            <circle data-bead={index} cx="50" cy="50" r="0.7" fill={tintDeep("bright", 0.9)} />
          </g>
        ))}

        {/* The nucleus: outer wash, lit interior, then the packed nucleons. */}
        <circle cx="50" cy="50" r="15" fill="url(#atom-bloom)" />
        <circle cx="50" cy="50" r={NUCLEUS_RADIUS - 0.9} fill="url(#atom-heart)" />

        {NUCLEONS.map((nucleon, index) => {
          /** 0 at the back of the ball, 1 at the front. */
          const front = (nucleon.z + NUCLEUS_RADIUS) / (NUCLEUS_RADIUS * 2);
          return (
            <circle
              key={index}
              cx={50 + nucleon.x}
              cy={50 + nucleon.y}
              r={nucleon.r * (0.86 + front * 0.14)}
              fill={nucleon.blue ? "url(#nucleon-cool)" : "url(#nucleon-steel)"}
              opacity={0.68 + front * 0.32}
            />
          );
        })}

        {/* Shading and the specular seat the ball in the light. */}
        <circle cx="50" cy="50" r={NUCLEUS_RADIUS} fill="url(#nucleus-shade)" />
        <circle cx="48.6" cy="48.5" r="1.1" fill={tintDeep("bright", 0.3)} />
      </svg>

      {/* Each label rides its own orbit. Position and scale are set per frame. */}
      {ORBITS.map((orbit) => (
        <span
          key={orbit.label}
          data-carrier
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-volt/25 bg-void/80 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-soft shadow-[0_0_20px_-10px_rgba(100,255,218,0.5)] sm:text-[0.68rem]"
        >
          {orbit.label}
        </span>
      ))}
    </div>
  );
}

export default AtomCore;
