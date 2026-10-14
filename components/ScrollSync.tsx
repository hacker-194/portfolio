"use client";

import { useEffect } from "react";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/gsap";
import { holdScrollDirection } from "@/lib/hooks";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Give late fonts and images a moment to settle before measuring triggers. */
const REFRESH_SETTLE_MS = 1200;

/** Distance the anchor landing point sits above the target, in px. */
const SCROLL_OFFSET = -8;

/**
 * Registers GSAP's ScrollTrigger and re-measures it once fonts and images have
 * settled.
 *
 * The page scrolls natively. There is no scroll-hijacking layer: wheel and
 * trackpad behave as the reader's system is tuned, find-in-page and anchor
 * links work as the browser intends, and nothing fights reduced-motion settings.
 * ScrollTrigger reads the native scroll position directly, so the
 * position-linked animations need nothing more than this.
 */
export function ScrollSync() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    registerScrollTrigger();

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const settle = window.setTimeout(refresh, REFRESH_SETTLE_MS);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}

/**
 * Scrolls to a `#hash` target and keeps the URL in step. The motion is the
 * browser's own smooth scroll, or an instant jump under reduced motion.
 */
export function scrollToHash(hash: string) {
  if (typeof window === "undefined") return;
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;

  const reduced = prefersReducedMotion();
  const top = target.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;

  // A deliberate jump is the reader asking to be somewhere, not the reader
  // scrolling down, so its travel must not hide the bar: it would be missing
  // when they arrive.
  holdScrollDirection(reduced ? 150 : 1000);
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  window.history.replaceState(null, "", hash);
}
