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
 * in render output (`initial={reduce ? false : …}`, conditional returns, inline
 * styles) makes the hydration render disagree with the server HTML. Combining
 * it with `useHydrated` keeps the first client render identical to the server
 * and only switches to the still variant afterwards.
 */
export function useStillMotion(): boolean {
  const hydrated = useHydrated();
  const reduce = useReducedMotion();
  return hydrated && !!reduce;
}

/**
 * True while the tab is in the foreground.
 *
 * Used to park continuous animation loops. Built on `useSyncExternalStore` so
 * the listener is attached once and there is no setState inside an effect.
 */
export function useDocumentVisible(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  const getSnapshot = useCallback(
    () => document.visibilityState === "visible",
    [],
  );

  const getServerSnapshot = useCallback(() => true, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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

/** Coarse pointer → touch device. Used to dial effects down. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

export type ViewportState = {
  /** Currently intersecting. Use to pause work that is off screen. */
  inView: boolean;
  /** True from the first time it entered. Use to latch one-time mounts. */
  seen: boolean;
};

/**
 * Tracks whether the element is in the viewport, plus a latched "has ever been
 * in view" flag so expensive children can be mounted once and only paused
 * afterwards — unmounting a WebGL canvas mid-session is both wasteful and
 * unstable.
 */
export function useInViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  rootMargin = "200px",
): ViewportState {
  const [state, setState] = useState<ViewportState>({
    inView: false,
    seen: false,
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Very old browsers: fall back to "always visible", deferred so it is not a
    // synchronous setState inside the effect body.
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(
        () => setState({ inView: true, seen: true }),
        0,
      );
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const inView = entry.isIntersecting;
          setState((previous) =>
            previous.inView === inView && (previous.seen || !inView)
              ? previous
              : { inView, seen: previous.seen || inView },
          );
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return state;
}

export type ScrollState = {
  y: number;
  /** True while the reader is moving down the page past the threshold. */
  scrollingDown: boolean;
};

/**
 * Tracks the scroll offset plus direction. Both values are written inside the
 * scroll-driven animation frame (never synchronously in an effect), so the
 * component only re-renders when something actually changed.
 */
export function useScrollState(directionThreshold = 560): ScrollState {
  const [state, setState] = useState<ScrollState>({
    y: 0,
    scrollingDown: false,
  });

  useEffect(() => {
    let frame = 0;
    let last = window.scrollY;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;

      setState((previous) => {
        if (Math.abs(delta) < 6) {
          return previous.y === y ? previous : { ...previous, y };
        }
        last = y;
        return { y, scrollingDown: delta > 0 && y > directionThreshold };
      });
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
  }, [directionThreshold]);

  return state;
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
