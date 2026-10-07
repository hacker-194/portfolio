"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the visitor has asked for reduced motion.
 *
 * This is the *effect-time* counterpart to `useStillMotion`: it is read inside
 * effects and event handlers, where a synchronous media query read is exactly
 * what we want and where there is no server render to disagree with. Use
 * `useStillMotion` when the value feeds render output, and this when it only
 * guards a side effect — so the check lives in one place either way.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

let pluginRegistered = false;

/**
 * Registers ScrollTrigger exactly once per page load.
 *
 * GSAP tolerates repeat registrations, but calling this from every component
 * that animates on scroll is noise — and it hides the fact that the plugin is
 * a single global dependency rather than a per-component one.
 */
export function registerScrollTrigger(): void {
  if (pluginRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  pluginRegistered = true;
}

/**
 * Runs a GSAP timeline scoped to `ref`, reverting it on unmount and skipping it
 * entirely when the visitor prefers reduced motion.
 *
 * Every scroll animation in this site had the same four-line preamble — read the
 * ref, bail out of reduced motion, register the plugin, wrap the work in a
 * `gsap.context` and revert it. The callback is stored in a ref so callers can
 * pass an inline closure without the effect re-running on every render.
 */
export function useGsapScope<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  build: (scope: T) => void,
): void {
  const buildRef = useRef(build);

  useEffect(() => {
    buildRef.current = build;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    registerScrollTrigger();
    const context = gsap.context(() => buildRef.current(node), node);

    return () => context.revert();
  }, [ref]);
}
