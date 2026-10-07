"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { Embers } from "@/components/Embers";
import { useGsapScope } from "@/lib/gsap";
import { useFinePointer } from "@/lib/hooks";
import { SECTION_CONTAINER } from "@/lib/layout";
import { radialGlow } from "@/lib/palette";
import { HERO_IMAGE } from "@/lib/site";
import { cn } from "@/lib/utils";

const WORDS = ["Discipline", "Learning", "Building"];

const SUPPORT: Record<string, string> = {
  Discipline: "Showing up on the days the model refuses to converge.",
  Learning: "Reading the paper, not just the tutorial.",
  Building: "Turning the idea into something that runs.",
};

/**
 * The one place the artwork is allowed to take over.
 *
 * The same hero image is reused as a masked, screen-blended motif — the source
 * pixels, not a redraw — so the character belongs to the visual identity rather
 * than sitting on top of it as decoration. GSAP scrubs the parallax and the
 * word reveal against scroll position.
 */
export function Discipline() {
  const root = useRef<HTMLDivElement | null>(null);
  const motif = useRef<HTMLDivElement | null>(null);
  const fine = useFinePointer();

  useGsapScope(root, (scope) => {
    gsap.fromTo(
      motif.current,
      { yPercent: -8, scale: 1.06 },
      {
        yPercent: 8,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      "[data-discipline-word]",
      { opacity: 0, yPercent: 60 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 1,
        stagger: 0.14,
        ease: "power4.out",
        scrollTrigger: { trigger: scope, start: "top 68%" },
      },
    );

    gsap.fromTo(
      "[data-discipline-flow]",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.6,
        ease: "power3.inOut",
        transformOrigin: "left center",
        scrollTrigger: { trigger: scope, start: "top 62%" },
      },
    );
  });

  return (
    <section
      ref={root}
      aria-label="Discipline, learning, building"
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden border-t border-white/[0.06] py-24 sm:py-28"
    >
      {/* Base — translucent so the site-wide background keeps reading through
          this section instead of stopping at its edge. */}
      <div className="absolute inset-0 bg-void/72" aria-hidden />

      {/* Flowing energy blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="animate-drift absolute -left-[10%] top-[8%] h-[38rem] w-[38rem] rounded-full blur-3xl"
          style={{
            background: radialGlow("ember", 0.22),
          }}
        />
        <div
          className="animate-drift absolute -right-[6%] bottom-[2%] h-[32rem] w-[32rem] rounded-full blur-3xl"
          style={{
            animationDelay: "-8s",
            background: radialGlow("burnt", 0.24, { stop: 68 }),
          }}
        />
        <div
          className="animate-drift absolute left-[42%] top-[46%] h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{
            animationDelay: "-15s",
            background: radialGlow("gold", 0.16, { stop: 70 }),
          }}
        />
      </div>

      {/* Artwork motif — same source image, masked and screen-blended */}
      <div
        ref={motif}
        className="pointer-events-none absolute inset-0 will-change-transform"
        aria-hidden
      >
        <div className="naruto-motif absolute left-1/2 top-1/2 h-[125%] w-[min(92vw,58rem)] -translate-x-1/2 -translate-y-1/2 opacity-[0.34] mix-blend-screen">
          <Image
            src={HERO_IMAGE.src}
            alt=""
            fill
            sizes="(max-width: 1024px) 92vw, 58rem"
            quality={60}
            loading="lazy"
            className="object-cover object-[50%_38%]"
          />
        </div>
      </div>

      {/* Embers */}
      <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
        <Embers count={90} interactive={fine} />
      </div>

      {/* Contrast wash so the words always win */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,4,3,0.72) 0%, rgba(5,4,3,0.5) 40%, rgba(5,4,3,0.78) 100%)",
        }}
        aria-hidden
      />

      {/* Words */}
      <div className={SECTION_CONTAINER}>
        <span className="label-mono text-flare/90">The loop</span>

        <h2 className="mt-8 flex flex-col">
          {WORDS.map((word, index) => (
            <span key={word} className="flex items-baseline gap-4 sm:gap-7">
              <span
                className="w-5 shrink-0 font-mono text-[0.66rem] tracking-widest text-ember/60 sm:w-7 sm:text-[0.72rem]"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                data-discipline-word
                className={cn(
                  "display-tight block font-display text-[clamp(2.4rem,7.4vw,6.4rem)] font-bold uppercase leading-[1.02]",
                  index === WORDS.length - 1
                    ? "text-ember-gradient"
                    : "text-bone",
                )}
              >
                {word}
              </span>
              {index < WORDS.length - 1 ? (
                <span
                  className="hidden font-mono text-[clamp(1rem,1.6vw,1.5rem)] text-ember/40 sm:inline"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </span>
          ))}
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3 lg:mt-16">
          {WORDS.map((word) => (
            <p
              key={word}
              className="hairline max-w-xs border-t pt-4 text-[0.85rem] leading-relaxed text-ash/85"
            >
              {SUPPORT[word]}
            </p>
          ))}
        </div>

        {/* Energy flow */}
        <div className="mt-12 flex max-w-3xl items-center gap-5">
          <span className="label-mono shrink-0 text-ash/60">Input</span>
          <span className="relative h-px flex-1 overflow-hidden bg-white/[0.08]">
            <span
              data-discipline-flow
              className="ember-gradient absolute inset-0 origin-left"
            />
          </span>
          <span className="label-mono shrink-0 text-flare/90">Impact</span>
        </div>
      </div>
    </section>
  );
}
