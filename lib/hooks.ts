"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const noopSubscribe = () => () => {};

/**
 * SSR-safe "hydration has finished" flag.
 *
 * The server snapshot is `false`, and React re-uses it for the hydration render,
 * so the first client render always matches the server markup exactly.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/**
 * The value to branch *rendering* on for reduced motion.
 *
 * `useReducedMotion` reads the media query synchronously, so using it directly
 * in render output (`initial={reduce ? false : ...}`, conditional returns, inline
 * styles) makes the hydration render disagree with the server HTML. Combining
 * it with `useHydrated` keeps the first client render identical to the server
 * and only switches to the still variant afterwards.
 */
export function useStillMotion(): boolean {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  return hydrated && !!reduce;
}

/** SSR-safe media query subscription built on `useSyncExternalStore`. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True only for devices with a precise, hover-capable pointer (desktop). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export type ScrollState = {
  y: number;
  /** True while the reader is moving down the page past the threshold. */
  scrollingDown: boolean;
};

/**
 * Tracks scroll position (y) with a tiny settle threshold.
 * Re-renders on every meaningful scroll frame for smooth progress bars.
 */
export function useScrollProgress(settlePx = 6): number {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    let last = window.scrollY;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) >= settlePx) {
        last = y;
        setY(y);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [settlePx]);

  return y;
}

/**
 * Tracks scroll direction (down/up) with a threshold to avoid noise.
 * Only re-renders on direction change, not every frame.
 */
export function useScrollDirection(directionThreshold = 560): boolean {
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    let frame = 0;
    let last = window.scrollY;
    let held = false;
    let holdTimer = 0;

    holdScroll = (maxMs: number) => {
      held = true;
      window.clearTimeout(holdTimer);

      const release = () => {
        held = false;
        window.clearTimeout(holdTimer);
        last = window.scrollY;
      };

      holdTimer = window.setTimeout(release, maxMs);

      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      const y = window.scrollY;
      last = y;

      return release;
    };

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;

      if (Math.abs(delta) < 6) return;

      last = y;

      setScrollingDown((prev) =>
        held ? prev : delta > 0 && y > directionThreshold
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(holdTimer);
      holdScroll = undefined;
    };
  }, [directionThreshold]);

  return scrollingDown;
}

/**
 * Combined hook for components that need both progress and direction.
 * Avoids duplicate listeners by using both granular hooks.
 */
export function useScrollState(directionThreshold = 560): ScrollState {
  const y = useScrollProgress();
  const scrollingDown = useScrollDirection(directionThreshold);
  return { y, scrollingDown };
}

/**
 * Set by `useScrollState` while something is listening. Undefined otherwise, in
 * which case there is no direction tracking to hold and the call does nothing.
 */
let holdScroll: ((maxMs: number) => () => void) | undefined;

/**
 * Call before a deliberate jump (a nav click, a footer link). The jump is the
 * reader asking to be somewhere rather than the reader scrolling down, so its
 * travel must not hide the bar, which would leave it missing on arrival.
 *
 * `maxMs` bounds the hold, for a jump that never reports that it landed. Call
 * the returned release when it does.
 */
export function holdScrollDirection(maxMs: number): () => void {
  return holdScroll?.(maxMs) ?? (() => {});
}

/** Copies text to the clipboard and reports success for ~1.6s. */
export function useCopyToClipboard(resetAfter = 1600) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), resetAfter);
    return () => window.clearTimeout(timer);
  }, [copied, resetAfter]);

  return { copied, copy };
}
