"use client";

import { ArrowUp } from "lucide-react";
import { scrollToHash } from "@/components/SmoothScroll";
import { SECTION_CONTAINER } from "@/lib/layout";
import { ALL_SECTIONS, PROFILE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pb-10 pt-14 sm:pb-12">
      <div className={SECTION_CONTAINER}>
        {/* Oversized wordmark */}
        <div
          className="pointer-events-none mask-fade-b select-none pb-2"
          aria-hidden
        >
          <span className="block whitespace-nowrap font-display text-[clamp(3.4rem,15vw,13rem)] font-bold uppercase leading-[0.85] tracking-tight text-white/[0.045]">
            {PROFILE.name}
          </span>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-flare/30">
                <span className="font-display text-xs font-bold text-bone">
                  {PROFILE.initials}
                </span>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-sm font-semibold tracking-tight text-bone">
                  {PROFILE.name}
                </span>
                <span className="label-mono mt-1.5 text-ash/70">
                  {PROFILE.role}
                </span>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-[0.85rem] leading-relaxed text-ash/80">
              {PROFILE.discipline}
            </p>
          </div>

          <nav className="lg:col-span-4" aria-label="Footer">
            <span className="label-mono text-ash/60">Index</span>
            <ul className="mt-5 grid grid-cols-2 gap-y-3">
              {ALL_SECTIONS.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => scrollToHash(item.href)}
                    className="group flex items-center gap-2 text-[0.82rem] text-mist/70 transition-colors hover:text-bone"
                  >
                    <span className="font-mono text-[0.62rem] text-ember/50">
                      {item.index}
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <span className="label-mono text-ash/60">Elsewhere</span>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[0.82rem] text-mist/70 transition-colors hover:text-bone"
                >
                  github.com/{PROFILE.githubHandle}
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[0.82rem] text-mist/70 transition-colors hover:text-bone"
                >
                  linkedin.com/in/{PROFILE.linkedinHandle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="text-[0.82rem] text-mist/70 transition-colors hover:text-bone"
                >
                  {PROFILE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12 flex flex-wrap items-center justify-between gap-5 border-t pt-7">
          <p className="label-mono text-ash/50">
            © {year} {PROFILE.name} · {PROFILE.location}
          </p>

          <p className="label-mono order-last w-full text-ash/40 sm:order-none sm:w-auto">
            Built with Next.js, TypeScript, Tailwind, Motion, GSAP & React Three
            Fiber
          </p>

          <button
            type="button"
            onClick={() => scrollToHash("#home")}
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2.5 transition-colors hover:border-flare/40"
          >
            <span className="label-mono text-ash transition-colors group-hover:text-bone">
              Back to top
            </span>
            <ArrowUp
              className="h-3.5 w-3.5 text-flare transition-transform duration-300 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
