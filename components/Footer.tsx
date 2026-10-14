"use client";

import { ArrowUp } from "lucide-react";
import { scrollToHash } from "@/components/ScrollSync";
import { SECTION_CONTAINER } from "@/lib/layout";
import { ALL_SECTIONS, PROFILE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-bright/15 pb-10 pt-14 sm:pb-12">
      <div className={SECTION_CONTAINER}>
        {/* Oversized wordmark */}
        <div
          className="pointer-events-none mask-fade-b select-none pb-2"
          aria-hidden
        >
          <span className="block whitespace-nowrap font-display text-[clamp(3.4rem,17vw,16.5rem)] font-light uppercase leading-[0.85] tracking-tight text-bright/[0.06]">
            {PROFILE.name}
          </span>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-[3px] border border-brand/45">
                <span className="font-display text-xs font-bold text-bright">
                  {PROFILE.initials}
                </span>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-sm font-semibold tracking-tight text-bright">
                  {PROFILE.name}
                </span>
                <span className="label-mono mt-1.5 text-muted">
                  {PROFILE.role}
                </span>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {PROFILE.discipline}
            </p>
          </div>

          {/*
            The Index is the footer's only link list.

            There used to be a third column repeating GitHub, LinkedIn and the
            email address that the contact section already presents twice, at
            the end of a very long page. One list is easier to scan and the page
            keeps a single place to look for a way to write.

            `w-fit` with a full-width cap keeps the two columns as tight as
            their own content on a wide screen, and still collapses inside this
            column at the narrower end of the layout instead of overflowing it.
          */}
          <nav className="lg:col-span-4 lg:col-start-9" aria-label="Footer">
            <span className="label-mono text-muted">Index</span>
            <ul className="mt-5 grid w-fit max-w-full grid-cols-2 gap-x-10 gap-y-3">
              {ALL_SECTIONS.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => scrollToHash(item.href)}
                    className="group flex items-center gap-2 text-sm text-soft transition-colors duration-300 hover:text-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-[2px]"
                  >
                    <span className="font-mono text-xs text-accent">
                      {item.index}
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* The back-to-top control sits at the left, matching the brand and the
            headings above it, rather than floating at the opposite margin. */}
        <div className="hairline mt-12 flex flex-wrap items-center justify-between gap-5 border-t pt-7">
          <button
            type="button"
            onClick={() => scrollToHash("#home")}
            className="group inline-flex items-center gap-2.5 rounded-[2px] border border-bright/15 px-4 py-2.5 transition-all duration-300 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowUp
              className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
            <span className="label-mono text-muted transition-colors group-hover:text-bright">
              Back to top
            </span>
          </button>

          {/* The location is already stated in the hero, the profile plaque
              and the contact section; the copyright line is not the fourth
              place it needs to appear. */}
          <p className="label-mono text-muted">
            © {year} {PROFILE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
