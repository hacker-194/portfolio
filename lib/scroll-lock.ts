"use client";

import { useEffect } from "react";

/**
 * Locks page scrolling while an overlay is open (the full-screen menu and the
 * command palette).
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = locked ? "hidden" : "";
    return () => {
      root.style.overflow = "";
    };
  }, [locked]);
}
