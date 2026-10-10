"use client";

import { useEffect, useRef, useState } from "react";
import { useStillMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Terminal-style decode.
 *
 * The string ships in the document as itself, so the server HTML, the search
 * engines and the screen reader all get the real text. Only once the element is
 * actually on screen does it run through random glyphs for a moment and settle
 * back on the very same string.
 *
 * The visible copy is `aria-hidden` and the true string sits beside it in a
 * visually hidden node, so nothing is ever announced half decoded, and the
 * un-animated first render stays identical to the server markup.
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%*+/<>[]{}";

/** Run length scales with the line, with a floor so short lines are readable. */
const settleTime = (length: number) => Math.max(460, length * 42);

type ScrambleProps = {
  text: string;
  /** Wait before the run starts, in ms. */
  delay?: number;
  className?: string;
};

export function Scramble({ text, delay = 0, className }: ScrambleProps) {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // The real string, until an effect is free to animate it.
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduce || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let timer = 0;
    let started = false;

    const play = () => {
      const settle = settleTime(text.length);
      const begin = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - begin) / settle);
        // Characters lock from the left, so the word resolves as it decodes.
        const locked = Math.floor(progress * text.length);
        let next = text.slice(0, locked);
        for (let i = locked; i < text.length; i += 1) {
          const character = text[i];
          next +=
            character === " "
              ? " "
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(next);
        if (progress < 1) frame = window.requestAnimationFrame(step);
        else setDisplay(text);
      };

      frame = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;
          started = true;
          observer.disconnect();
          timer = window.setTimeout(play, delay);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
      // A settings change mid-run must not leave the line half decoded.
      setDisplay(text);
    };
  }, [text, delay, reduce]);

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

export default Scramble;
