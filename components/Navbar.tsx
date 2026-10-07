"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { scrollToHash } from "@/components/SmoothScroll";
import { useScrollLock } from "@/lib/load";
import { useScrollState, useStillMotion } from "@/lib/hooks";
import { gradientLayers, radialGlow } from "@/lib/palette";
import { ALL_SECTIONS, NAV_ITEMS, PROFILE } from "@/lib/site";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MOBILE_LINKS = ALL_SECTIONS;

export function Navbar() {
  const { y: scrollY, scrollingDown } = useScrollState();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useScrollLock(menuOpen);

  const condensed = scrollY > 32;
  // Hide the bar while scrolling down, bring it back on the way up.
  const hidden = scrollingDown && !menuOpen;

  // Track which section owns the middle of the viewport.
  useEffect(() => {
    const sections = ALL_SECTIONS.map((item) =>
      document.querySelector(item.href),
    ).filter((node): node is Element => Boolean(node));

    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    // Let the overlay begin closing before the scroll starts.
    window.setTimeout(() => scrollToHash(href), menuOpen ? 220 : 0);
  };

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -80, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_CINEMATIC, delay: reduce ? 0 : 0.15 }}
        className="fixed inset-x-0 top-0 z-[80]"
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 lg:px-12",
            condensed ? "py-2.5" : "py-4 sm:py-6",
          )}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => go("#home")}
            aria-label="Back to top"
            className="group relative flex items-center gap-3"
          >
            <span className="relative grid h-10 w-10 place-items-center">
              <span
                className="absolute inset-0 rounded-full border border-flare/30 transition-colors duration-500 group-hover:border-flare/70"
                aria-hidden
              />
              <span
                className="ember-gradient absolute inset-[3px] rounded-full opacity-0 blur-[6px] transition-opacity duration-500 group-hover:opacity-40"
                aria-hidden
              />
              <span className="font-display relative text-sm font-bold tracking-tight text-bone">
                {PROFILE.initials}
              </span>
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-bone">
                {PROFILE.name}
              </span>
              <span className="label-mono mt-1 text-ash/80">
                {PROFILE.role}
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full transition-all duration-500",
                condensed
                  ? "glass-panel hairline border px-1.5 py-1.5"
                  : "px-1.5 py-1.5",
              )}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.href;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => go(item.href)}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300",
                      isActive ? "text-bone" : "text-ash hover:text-bone",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-flare/25 bg-flare/[0.07]"
                        transition={{ duration: 0.45, ease: EASE_CINEMATIC }}
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => go("#contact")}
              className="group ml-3 inline-flex items-center gap-2 rounded-full border border-transparent bg-bone/[0.04] px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-bone transition-colors duration-300 hover:border-flare/40 hover:bg-flare/[0.08]"
            >
              Let&apos;s talk
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </button>
          </nav>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="glass-panel hairline relative grid h-11 w-11 place-items-center rounded-full border text-bone lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -60 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 60 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-4.5 w-4.5" strokeWidth={1.8} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 60 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -60 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-4.5 w-4.5" strokeWidth={1.8} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[75] lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.65, ease: EASE_CINEMATIC }}
          >
            <div className="absolute inset-0 bg-void/96 backdrop-blur-xl" />
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background: gradientLayers(
                  radialGlow("ember", 0.2, {
                    geometry: "90% 55% at 78% 8%",
                    stop: 62,
                  }),
                  radialGlow("burnt", 0.16, {
                    geometry: "70% 50% at 10% 100%",
                    stop: 60,
                  }),
                ),
              }}
              aria-hidden
            />

            <div className="relative flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28">
              <nav className="flex flex-col" aria-label="Mobile">
                {MOBILE_LINKS.map((item, index) => (
                  <motion.button
                    key={item.href}
                    type="button"
                    onClick={() => go(item.href)}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE_CINEMATIC,
                      delay: 0.16 + index * 0.045,
                    }}
                    className="group flex items-baseline justify-between border-b border-white/[0.07] py-4 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="label-mono text-ember/70">
                        {item.index}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[2rem] font-semibold leading-none tracking-tight transition-colors duration-300",
                          active === item.href ? "text-bone" : "text-mist/70",
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-ash transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.6}
                    />
                  </motion.button>
                ))}
              </nav>

              <motion.div
                className="mt-auto flex flex-col gap-3 pt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="label-mono text-ash">Direct</span>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="font-display text-lg text-bone"
                >
                  {PROFILE.email}
                </a>
                <div className="flex gap-5 pt-2">
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label-mono text-ash transition-colors hover:text-flare"
                  >
                    GitHub
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label-mono text-ash transition-colors hover:text-flare"
                  >
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
