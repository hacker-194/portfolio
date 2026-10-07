"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useStillMotion } from "@/lib/hooks";
import { tint } from "@/lib/palette";

/**
 * Ambient ember glow that trails the pointer, with a precise ring that expands
 * over interactive elements. The native cursor stays visible — this is
 * atmosphere, not a replacement.
 *
 * All positions are written straight to `style.transform` inside a single rAF
 * loop (never through React state) so it costs one compositor update per frame.
 * The loop idles out after the pointer stops moving.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const fine = useFinePointer();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  useEffect(() => {
    if (!fine || reduce) return;

    const glow = glowRef.current;
    const ring = ringRef.current;
    if (!glow || !ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const glowPos = { ...target };
    const ringPos = { ...target };
    let scale = 1;
    let targetScale = 1;
    let idleTimer = 0;
    let frame = 0;
    let active = false;
    let visible = false;

    const show = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      const opacity = next ? "1" : "0";
      glow.style.opacity = opacity;
      ring.style.opacity = opacity;
    };

    const loop = () => {
      glowPos.x += (target.x - glowPos.x) * 0.12;
      glowPos.y += (target.y - glowPos.y) * 0.12;
      ringPos.x += (target.x - ringPos.x) * 0.24;
      ringPos.y += (target.y - ringPos.y) * 0.24;
      scale += (targetScale - scale) * 0.16;

      glow.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

      frame = window.requestAnimationFrame(loop);
    };

    const wake = () => {
      if (!active) {
        active = true;
        frame = window.requestAnimationFrame(loop);
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        active = false;
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
      }, 1200);
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      show(true);
      wake();
    };

    const onOver = (event: PointerEvent) => {
      const el = event.target as Element | null;
      const interactive = el?.closest(
        "a, button, [data-magnetic], [data-cursor='hover']",
      );
      targetScale = interactive ? 1.9 : 1;
      if (glow) glow.style.setProperty("--glow-strength", interactive ? "1" : "0.6");
    };

    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.clearTimeout(idleTimer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [fine, reduce]);

  if (!fine || reduce) return null;

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        data-cursor-glow=""
        className="pointer-events-none fixed left-0 top-0 z-[58] h-[26rem] w-[26rem] rounded-full opacity-0 mix-blend-screen transition-opacity duration-500 will-change-transform"
        style={{
          background: `radial-gradient(circle, ${tint("ember", 0.16)} 0%, ${tint(
            "flare",
            0.09,
          )} 34%, ${tint("ember", 0.02)} 58%, transparent 72%)`,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        data-cursor-ring=""
        className="pointer-events-none fixed left-0 top-0 z-[59] h-7 w-7 rounded-full border border-flare/60 opacity-0 transition-opacity duration-300 will-change-transform"
        style={{ boxShadow: `0 0 18px ${tint("ember", 0.35)}` }}
      />
    </>
  );
}
