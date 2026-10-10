"use client";

import { useEffect } from "react";

/**
 * Locks page scrolling while an overlay is open, honouring the Lenis instance
 * that SmoothScroll registers on `window`.
 *
 * Used by the full-screen menu and the command palette. The intro sequence that
 * used to live in this file is gone: the page renders itself in, so there is no
 * curtain to hold a context open for.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const lenis = window.__lenis;

    if (locked) {
      root.style.overflow = "hidden";
      lenis?.stop();
    } else {
      root.style.overflow = "";
      lenis?.start();
    }

    return () => {
      root.style.overflow = "";
      lenis?.start();
    };
  }, [locked]);
}
