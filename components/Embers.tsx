"use client";

import { useEffect, useRef } from "react";
import { useCoarsePointer, useStillMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type EmbersProps = {
  className?: string;
  /** Base particle budget, scaled by viewport area and device class. */
  count?: number;
  /** Shift the whole field subtly with the pointer. */
  interactive?: boolean;
  /** 1 = rise, -1 = fall. */
  direction?: 1 | -1;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  sprite: number;
};

const COLORS = ["#fd7c02", "#fba915", "#fdd967"] as const;

function makeSprite(color: string) {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.28, `${color}aa`);
  gradient.addColorStop(0.6, `${color}33`);
  gradient.addColorStop(1, `${color}00`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

/**
 * Lightweight 2D ember field.
 *
 * Particles are drawn from three pre-rendered sprites with additive blending,
 * so per-frame work is only a handful of `drawImage` calls — no allocation in
 * the animation loop. Rendering pauses when the canvas leaves the viewport or
 * the tab is hidden, and the whole field is skipped for reduced-motion users.
 */
export function Embers({
  className,
  count = 70,
  interactive = false,
  direction = 1,
}: EmbersProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const coarse = useCoarsePointer();

  useEffect(() => {
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const sprites = COLORS.map(makeSprite);
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const budget = () => {
      const area = window.innerWidth * window.innerHeight;
      const scaled = Math.round((area / 1_000_000) * count * 0.55);
      const cap = coarse ? 42 : 130;
      return Math.max(18, Math.min(cap, scaled));
    };

    const spawn = (initial: boolean): Particle => {
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : direction === 1 ? height + 20 : -20,
        r: 0.6 + Math.random() * 2.6,
        vy: (0.12 + Math.random() * 0.5) * direction,
        sway: 0.1 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.12 + Math.random() * 0.55,
        sprite: Math.floor(Math.random() * sprites.length),
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = budget();
      if (particles.length > target) {
        particles = particles.slice(0, target);
      } else {
        while (particles.length < target) particles.push(spawn(true));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      for (const particle of particles) {
        particle.phase += 0.01;
        particle.y += particle.vy;
        particle.x += Math.sin(particle.phase) * particle.sway * 0.4;

        const out =
          direction === 1 ? particle.y < -30 : particle.y > height + 30;
        if (out || particle.x < -40 || particle.x > width + 40) {
          Object.assign(particle, spawn(false));
          continue;
        }

        const size = particle.r * 6;
        ctx.globalAlpha = particle.alpha;
        ctx.drawImage(
          sprites[particle.sprite],
          particle.x + pointer.x - size / 2,
          particle.y + pointer.y - size / 2,
          size,
          size,
        );
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      if (!running) return;
      draw();
      frame = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * -26;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * -18;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 180);
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) start();
              else stop();
            },
            { rootMargin: "120px" },
          )
        : null;

    resize();
    observer?.observe(canvas);
    if (!observer) start();
    else start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (interactive) window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      stop();
      observer?.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduce, count, interactive, direction, coarse]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}
