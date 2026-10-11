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
 * Degrees the whole figure turns toward the pointer.
 *
 * Small on purpose: enough that the sculpture reads as a physical object under
 * the cursor, not so much that the labels start to lean.
 */
const MAX_TILT = 7;

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

/**
 * Radius of the core, in the shared 0-100 box.
 *
 * A marker, not a ball: it renders around 30px across on a laptop, which is
 * small enough to let the orbits carry the composition and to read as an
 * instrument rather than as a cartoon atom with a fat centre. It went through a
 * packed-cluster phase at nearly three times this size, and individual nucleons
 * are simply the wrong level of detail at this scale: they turn to noise long
 * before they read as matter.
 */
const NUCLEUS_RADIUS = 1.6;

/**
 * The lit arc of the rim, as a start and length along the circle's path.
 *
 * A circle's path begins at 3 o'clock and runs clockwise, so these fractions put
 * the bright arc on the upper left, where the light is. The rest of the rim is a
 * much fainter full circle, which is what stops a one-sided rim from looking
 * like a stray crescent.
 */
const RIM_START = 54;
const RIM_LENGTH = 20;

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
          bead.setAttribute("r", (0.35 + front * 0.2).toFixed(2));
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
          <radialGradient id="atom-bloom">
            <stop offset="0%" stopColor={P.accent} stopOpacity="0.22" />
            <stop offset="45%" stopColor={P.accent} stopOpacity="0.07" />
            <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
          </radialGradient>

          {/*
            The core is dark on purpose. A lit ball at this size reads as a bead
            or a marble; a near-black one with only its edge catching light reads
            as something dense, which is what a nucleus should look like. The
            interior is lifted a touch toward the key light, on the same upper
            left as the rim.
          */}
          <radialGradient id="core-body" cx="0.38" cy="0.34" r="0.9">
            <stop offset="0%" stopColor="#1a2431" />
            <stop offset="42%" stopColor="#0d131c" />
            <stop offset="100%" stopColor="#05070a" />
          </radialGradient>

          {/* A faint cyan interior, the only place the accent enters the core. */}
          <radialGradient id="core-glow">
            <stop offset="0%" stopColor={P.accent} stopOpacity="0.24" />
            <stop offset="58%" stopColor={P.accent} stopOpacity="0.07" />
            <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
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
              stroke={tintDeep("volt", 0.12)}
              strokeWidth="0.22"
            />
            <ellipse
              data-arc={index}
              cx="50"
              cy="50"
              rx={orbit.rx}
              ry={orbit.ry}
              fill="none"
              pathLength={100}
              stroke={tintDeep("accent", 0.8)}
              strokeWidth="0.32"
              strokeLinecap="round"
              strokeDasharray="14 86"
            />
            <circle data-bead={index} cx="50" cy="50" r="0.45" fill={tintDeep("bright", 0.9)} />
          </g>
        ))}

        {/*
          The nucleus: a wash behind it, the dark core, its interior glow, then
          the rim. The rim is two strokes on one circle: a faint full ring for
          the ambient edge, and a brighter arc where the key light lands.
        */}
        <circle cx="50" cy="50" r="8" fill="url(#atom-bloom)" />
        <circle cx="50" cy="50" r={NUCLEUS_RADIUS} fill="url(#core-body)" />
        <circle cx="50" cy="50" r={NUCLEUS_RADIUS * 0.86} fill="url(#core-glow)" />
        <circle
          cx="50"
          cy="50"
          r={NUCLEUS_RADIUS}
          fill="none"
          stroke={tintDeep("ice", 0.2)}
          strokeWidth="0.14"
        />
        <circle
          cx="50"
          cy="50"
          r={NUCLEUS_RADIUS}
          fill="none"
          pathLength={100}
          stroke={tintDeep("bright", 0.88)}
          strokeWidth="0.22"
          strokeLinecap="round"
          strokeDasharray={`${RIM_LENGTH} ${100 - RIM_LENGTH}`}
          strokeDashoffset={-RIM_START}
        />
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
