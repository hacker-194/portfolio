"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";
import { scrollToHash } from "@/components/SmoothScroll";
import { useScrollLock } from "@/lib/load";
import { useScrollState, useStillMotion } from "@/lib/hooks";
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

  const condensed = scrollY > 24;
  // Hide the bar while scrolling down, bring it back on the way up.
  const hidden = scrollingDown && !menuOpen;

  /*
   * The bar used to flip between a light-on-paper and a light-on-dark rendition
   * of the tokens depending on what sat underneath it, which meant a scroll
   * listener measuring the hero on every frame. The page has one ground now, so
   * the bar reads the base tokens everywhere and that whole apparatus is gone:
   * one less listener, one less state, nothing to drift out of sync.
   */

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
        initial={reduce ? false : { y: -70, opacity: 0 }}
        animate={{ y: hidden && !menuOpen ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_CINEMATIC, delay: reduce ? 0 : 0.15 }}
        className="fixed inset-x-0 top-0 z-[80]"
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 lg:px-12",
            condensed ? "py-2.5" : "py-4 sm:py-5",
          )}
        >
          {/* Brand */}
          <button
            type="button"
            onClick={() => go("#home")}
            aria-label={`${PROFILE.name}, home`}
            className="group flex items-center gap-3"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-accent/35 bg-accent/5 transition-colors duration-500 group-hover:border-accent/80 group-hover:bg-accent/10">
              <span className="font-mono text-xs font-medium tracking-tight text-bright">
                {PROFILE.initials}
              </span>
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-bright">
                {PROFILE.name.split(" ")[0]}
              </span>
              <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-muted sm:inline">
                / AI·ML
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.href;
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => go(item.href)}
                  className={cn(
                    "relative rounded-lg px-3.5 py-2 text-sm font-medium uppercase tracking-[0.16em] transition-colors duration-300",
                    isActive
                      ? "text-bright"
                      : "text-muted hover:bg-bright/5 hover:text-bright",
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-px bg-accent"
                      transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Actions. GitHub, LinkedIn and the CV live in the hero, the mobile
              menu and the footer; repeating them in the bar was clutter. The
              command palette trigger lives here too, as the discoverable way to
              find a shortcut most readers never learn about. */}
          <div className="flex items-center gap-2">
            <CommandPalette />

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="grid h-9 w-9 place-items-center rounded-lg border border-bright/15 text-bright lg:hidden"
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
                    <X className="h-4 w-4" strokeWidth={1.8} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ opacity: 0, rotate: 60 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -60 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4" strokeWidth={1.8} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[75] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_CINEMATIC }}
          >
            {/* An opaque ground and a wash of light from above, rather than a
                blurred sheet: the menu should read as a deeper room, not as
                frosted glass over the page behind it. */}
            <div className="absolute inset-0 bg-void bg-[radial-gradient(120%_60%_at_50%_-10%,rgba(100,255,218,0.08),transparent_72%)]" />

            <div className="relative flex h-full flex-col overflow-y-auto px-6 pb-10 pt-24">
              <nav className="flex flex-col" aria-label="Mobile">
                {MOBILE_LINKS.map((item, index) => (
                  <motion.button
                    key={item.href}
                    type="button"
                    onClick={() => go(item.href)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: EASE_CINEMATIC,
                      delay: 0.08 + index * 0.04,
                    }}
                    className="group flex items-baseline justify-between border-b border-bright/15 py-4 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-muted">
                        {item.index}
                      </span>
                      <span
                        className={cn(
                          "font-display text-2xl font-medium leading-none tracking-tight transition-colors duration-300",
                          active === item.href ? "text-bright" : "text-soft",
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </nav>

              <motion.div
                className="mt-auto flex flex-col gap-4 pt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="font-display text-lg text-bright"
                >
                  {PROFILE.email}
                </a>
                <div className="flex flex-wrap gap-5 pt-1">
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label-mono text-muted transition-colors hover:text-accent"
                  >
                    GitHub
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label-mono text-muted transition-colors hover:text-accent"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={PROFILE.resume}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label-mono text-muted transition-colors hover:text-accent"
                  >
                    Résumé
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
