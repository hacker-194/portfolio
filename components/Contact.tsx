"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { GithubMark, LinkedinMark } from "@/components/BrandIcons";
import { Embers } from "@/components/Embers";
import { MagneticButton } from "@/components/MagneticButton";
import { MaskedLines } from "@/components/MaskedLines";
import { Reveal } from "@/components/Reveal";
import { useCopyToClipboard, useFinePointer, useStillMotion } from "@/lib/hooks";
import { SECTION_CONTAINER } from "@/lib/layout";
import { radialGlow } from "@/lib/palette";
import { PROFILE } from "@/lib/site";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";

type Channel = {
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const CHANNELS: Channel[] = [
  {
    label: "GitHub",
    value: `@${PROFILE.githubHandle}`,
    href: PROFILE.github,
    icon: GithubMark,
  },
  {
    label: "LinkedIn",
    value: `in/${PROFILE.linkedinHandle}`,
    href: PROFILE.linkedin,
    icon: LinkedinMark,
  },
  {
    label: "Email",
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    icon: Mail,
  },
];

export function Contact() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const fine = useFinePointer();
  const { copied, copy } = useCopyToClipboard();

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden border-t border-white/[0.06] py-24 sm:py-28 lg:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: radialGlow("ember", 0.24, {
            geometry: "68% 62% at 50% 108%",
            stop: 62,
          }),
        }}
        aria-hidden
      />
      <div className="tech-grid tech-grid-fade pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Embers count={44} direction={-1} interactive={fine} />
      </div>

      <div className={SECTION_CONTAINER}>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span className="label-mono text-flare/90">08 · Contact</span>
          </Reveal>

          <h2 className="display-tight mt-8 text-[clamp(2rem,6.6vw,5.4rem)] font-bold uppercase text-bone">
            <MaskedLines
              lines={["Let's build", "something", "intelligent."]}
              stagger={0.11}
              lineClassName="font-display"
              renderLine={(line, index) => (
                <span
                  className={
                    index === 2 ? "text-ember-gradient block" : "block"
                  }
                >
                  {line}
                </span>
              )}
            />
          </h2>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-[0.98rem] leading-relaxed text-ash sm:text-[1.05rem]">
              {PROFILE.availability}. If you are working on something in AI, ML or
              security and want an extra pair of hands, the inbox is open.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <MagneticButton
                variant="primary"
                href={`mailto:${PROFILE.email}`}
                icon={<ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />}
              >
                Email me
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                onClick={() => copy(PROFILE.email)}
                icon={
                  copied ? (
                    <Check className="h-4 w-4 text-flare" strokeWidth={2.2} />
                  ) : (
                    <Copy className="h-4 w-4" strokeWidth={1.9} />
                  )
                }
              >
                {copied ? "Copied" : "Copy address"}
              </MagneticButton>
              <a
                href={PROFILE.resume}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2.5 px-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ash transition-colors hover:text-bone"
              >
                Curriculum vitae
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Channels */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] sm:grid-cols-3">
          {CHANNELS.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <motion.a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  channel.href.startsWith("mailto")
                    ? undefined
                    : "noreferrer noopener"
                }
                className="group relative flex flex-col gap-6 bg-void p-7 transition-colors duration-500 hover:bg-umber/60 sm:p-8"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{
                  duration: 0.65,
                  ease: EASE_CINEMATIC,
                  delay: index * 0.08,
                }}
              >
                <div className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-ember/80 transition-colors duration-500 group-hover:text-flare" />
                  <ArrowUpRight
                    className="h-4 w-4 text-ash/50 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-flare"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <span className="label-mono text-ash/70">{channel.label}</span>
                  <p className="mt-3 break-all font-mono text-[0.82rem] tracking-wide text-bone">
                    {channel.value}
                  </p>
                </div>

                <span
                  className="ember-gradient absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
              </motion.a>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-8">
          <div className="hairline flex flex-wrap items-center justify-between gap-4 border-t pt-7">
            <span className="label-mono text-ash/60">{PROFILE.location}</span>
            <span className="label-mono text-ash/60">{PROFILE.phone}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
