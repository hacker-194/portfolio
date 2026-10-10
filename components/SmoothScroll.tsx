"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/gsap";
import { holdScrollDirection } from "@/lib/hooks";

/** Give late fonts and images a moment to settle before measuring triggers. */
const REFRESH_SETTLE_MS = 1200;

/** Distance the anchor landing point sits above the target, in px. */
const SCROLL_OFFSET = -8;

/** How long a deliberate jump travels, in seconds. */
const SCROLL_DURATION = 1.35;

/** Extra time a hold is kept past the jump, for one that never reports it landed. */
const HOLD_DEADLINE_MS = 400;

/**
 * Boots Lenis smooth scrolling and keeps GSAP's ScrollTrigger in sync with it.
 *
 * A single rAF loop is used: GSAP's ticker drives `lenis.raf`, and every Lenis
 * scroll event refreshes ScrollTrigger. That avoids two competing loops.
 *
 * When the user prefers reduced motion we skip Lenis entirely and let the
 * browser scroll natively, which is the correct accessible behaviour.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    registerScrollTrigger();

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    window.__lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const settle = window.setTimeout(refresh, REFRESH_SETTLE_MS);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return null;
}

/**
 * Scrolls to a `#hash` target. Uses Lenis when present so the easing and the
 * GSAP sync stay consistent, and falls back to native scrolling otherwise.
 */
export function scrollToHash(hash: string) {
  if (typeof window === "undefined") return;
  const target = document.querySelector(hash);
  if (!target) return;

  // A deliberate jump is the reader asking to be somewhere, not the reader
  // scrolling down, so its travel must not hide the bar: it would be missing
  // when they arrive. Lenis reports the landing; the deadline covers a jump the
  // reader interrupts, which reports nothing.
  const lenis = window.__lenis;
  if (lenis) {
    const release = holdScrollDirection(
      SCROLL_DURATION * 1000 + HOLD_DEADLINE_MS,
    );
    lenis.scrollTo(target as HTMLElement, {
      offset: SCROLL_OFFSET,
      duration: SCROLL_DURATION,
      onComplete: release,
    });
    return;
  }

  const element = target as HTMLElement;
  const reduced = prefersReducedMotion();
  const top = element.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
  // Without Lenis the jump is instant under reduced motion, and the browser's
  // own smoothing is brief either way.
  holdScrollDirection(reduced ? 150 : 1000);
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
