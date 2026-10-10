"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, useStillMotion } from "@/lib/hooks";
import { PALETTE, PALETTE_DEEP } from "@/lib/palette";

/**
 * The pointer companion.
 *
 * A ring trails the pointer by a few frames while a dot sits exactly under it,
 * so aim is never ambiguous. Over anything clickable the ring opens up, and
 * where the element declares a label (`data-cursor="Read case study"`) a small
 * paper card names the action.
 *
 * How it behaves:
 *
 * - Desktop only. A touch pointer is left entirely alone.
 * - Reduced motion turns it off rather than slowing it down, because a
 *   trailing ring is motion by definition.
 * - The system cursor is hidden only while this is mounted *and* running
 *   (`html[data-cursor="custom"]`). A failed script, a settings change or a
 *   text field all leave a normal cursor behind.
 * - Both nodes are `pointer-events-none`, so nothing here can swallow a click
 *   or interrupt a text selection.
 * - Colour comes from `lib/palette`, the module that exists for drawing
 *   outside CSS, and it re-tints on entering a dark panel so the ring never
 *   disappears into the ink.
 */

/** Anything that answers to a click gets the open ring. */
const ACTION = "a[href], button:not(:disabled), [role='button'], summary";

/**
 * Targets that already draw their own cursor: an I-beam in a text field, a
 * `not-allowed` on a dead button, whatever the embed inside the iframe wants.
 * There the companion hides itself and the platform keeps the floor.
 */
const NATIVE =
  "input, textarea, select, [contenteditable='true'], iframe, button:disabled, [aria-disabled='true']";

const RING_IDLE = 26;
const RING_ACTION = 62;
/** Diameter multiplier while a press is held. */
const RING_PRESSED = 0.74;
const DOT = 5;

/** Room a label needs before it would run off the right edge or the bottom. */
const EDGE_X = 200;
const EDGE_Y = 80;type Mode = "idle" | "action" | "native";

export function CursorCompanion() {
  const fine = useFinePointer();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const enabled = fine && !reduce;

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  // Same source, two speeds: the ring lags and overshoots a little, the dot
  // does not. That difference is the whole feel.
  const ringX = useSpring(rawX, { stiffness: 170, damping: 18, mass: 0.4 });
  const ringY = useSpring(rawY, { stiffness: 170, damping: 18, mass: 0.4 });
  const dotX = useSpring(rawX, { stiffness: 1100, damping: 55, mass: 0.3 });
  const dotY = useSpring(rawY, { stiffness: 1100, damping: 55, mass: 0.3 });

  const [shown, setShown] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("");
  const [deep, setDeep] = useState(false);
  const [pressed, setPressed] = useState(false);
  /** Which way the label opens: near an edge it turns back towards the page. */
  const [flip, setFlip] = useState({ x: false, y: false });
  const seen = useRef(false);
  const corner = useRef(flip);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.dataset.cursor = "custom";

    const onMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      rawX.set(clientX);
      rawY.set(clientY);

      // Held in a ref first so a re-render only happens on an actual crossing.
      const next = {
        x: clientX > window.innerWidth - EDGE_X,
        y: clientY > window.innerHeight - EDGE_Y,
      };
      if (next.x !== corner.current.x || next.y !== corner.current.y) {
        corner.current = next;
        setFlip(next);
      }

      if (seen.current) return;
      // First sighting: place both followers instead of letting them fly in
      // from the corner of the screen.
      seen.current = true;
      ringX.jump(clientX);
      ringY.jump(clientY);
      dotX.jump(clientX);
      dotY.jump(clientY);
      setShown(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.closest(NATIVE)) {
        setMode("native");
        setLabel("");
      } else {
        const action = target.closest(ACTION);
        setMode(action ? "action" : "idle");
        setLabel(action?.getAttribute("data-cursor")?.trim() ?? "");
      }

      // `.on-deep` re-declares the tokens, so a boolean is all we need: the
      // colours come from the matching source of truth in `lib/palette`.
      setDeep(Boolean(target.closest(".on-deep, .panel-deep")));
    };

    const onLeave = () => {
      seen.current = false;
      setShown(false);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      delete root.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, rawX, rawY, ringX, ringY, dotX, dotY]);

  if (!enabled) return null;

  const theme = deep ? PALETTE_DEEP : PALETTE;
  const diameter = mode === "action" ? RING_ACTION : RING_IDLE;
  const size = pressed ? diameter * RING_PRESSED : diameter;
  const dot = pressed ? DOT * RING_PRESSED : DOT;
  const hidden = !shown || mode === "native";
  const fill = (alpha: number) =>
    `color-mix(in oklab, ${theme.accent} ${alpha}%, transparent)`;
  const beyond = size / 2 + 10;
  const across = flip.x ? { right: beyond } : { left: beyond };
  const down = flip.y ? { bottom: beyond } : { top: beyond };

  return (
    <>
      {/* Ring: lags, opens over a target, carries the label. */}
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY, opacity: hidden ? 0 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[121] transition-opacity duration-300 [will-change:transform]"
      >
        <span
          className="absolute rounded-full border transition-[width,height,margin,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderColor: theme.accent,
            backgroundColor: fill(mode === "action" ? 12 : 6),
            boxShadow: `0 0 22px -8px ${theme.accent}`,
          }}
        />

        <span
          className="label-mono absolute whitespace-nowrap rounded-full border px-2.5 py-1.5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            ...across,
            ...down,
            opacity: label ? 1 : 0,
            transform: label ? "translateY(0)" : "translateY(-4px)",
            borderColor: fill(45),
            backgroundColor: theme.panel,
            color: theme.bright,
          }}
        >
          {label}
        </span>
      </motion.div>

      {/* Dot: always exactly on the pointer, so aim is never lost. */}
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY, opacity: hidden ? 0 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[122] transition-opacity duration-300 [will-change:transform]"
      >
        <span
          className="absolute rounded-full transition-[width,height,margin] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: dot,
            height: dot,
            marginLeft: -dot / 2,
            marginTop: -dot / 2,
            backgroundColor: theme.accent,
          }}
        />
      </motion.div>
    </>
  );
}

export default CursorCompanion;
