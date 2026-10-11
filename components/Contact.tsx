"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { GithubMark, LinkedinMark } from "@/components/BrandIcons";
import { ContactForm } from "@/components/ContactForm";
import { MagneticButton } from "@/components/MagneticButton";
import { Reveal } from "@/components/Reveal";
import { useCopyToClipboard, useStillMotion } from "@/lib/hooks";
import { SECTION_CONTAINER } from "@/lib/layout";
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
  const { copied, copy } = useCopyToClipboard();

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      {/* The closing warm edge, the matching note to the plaque near the top of
          the page. The reader meets brass twice and nowhere else. */}
      <span
        className="ember-rule pointer-events-none absolute inset-x-0 top-0 h-px"
        aria-hidden
      />
      <div className={SECTION_CONTAINER}>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span className="label-mono text-volt">09 · Contact</span>
          </Reveal>

          {/* Set as plain text rather than a masked reveal: this is the last
              thing the reader should read, and it should read like a sentence
              on the page by the time they get here, not like an effect. */}
          <h2 className="display-tight mt-8 text-[clamp(2rem,4.8vw,3.75rem)] font-medium text-bright">
            <span className="block">Let&apos;s build</span>
            <span className="block">something</span>
            <span className="text-accent-gradient block">intelligent.</span>
          </h2>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-base">
              {PROFILE.availability}. If you&apos;re working on something in AI,
              ML or security and want an extra pair of hands, my inbox is open.
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
                    <Check className="h-4 w-4 text-volt" strokeWidth={2.2} />
                  ) : (
                    <Copy className="h-4 w-4" strokeWidth={1.9} />
                  )
                }
              >
                {copied ? "Copied" : "Copy address"}
              </MagneticButton>
              {/* The CV is the action a hiring reader is most likely to take
                  from this section, so it carries the same weight as the two
                  beside it rather than sitting under them as muted text. */}
              <MagneticButton
                variant="secondary"
                href={PROFILE.resume}
                external
                ariaLabel="Open curriculum vitae (PDF)"
                icon={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
              >
                Curriculum vitae
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <ContactForm />
          </Reveal>
        </div>

        {/* Channels */}
        <div className="shadow-lux mt-20 grid gap-px overflow-hidden rounded-2xl border border-bright/15 bg-bright/5 sm:grid-cols-3">
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
                className="group relative flex flex-col gap-6 bg-void p-7 transition-colors duration-500 hover:bg-panel2/60 sm:p-8"
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
                  <Icon className="h-5 w-5 text-accent transition-colors duration-500 group-hover:text-volt" />
                  <ArrowUpRight
                    className="h-4 w-4 text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-volt"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <span className="label-mono text-muted">{channel.label}</span>
                  <p className="mt-3 break-all font-mono text-sm tracking-wide text-bright">
                    {channel.value}
                  </p>
                </div>

                <span
                  className="accent-gradient absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
              </motion.a>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-8">
          <div className="hairline flex flex-wrap items-center justify-between gap-4 border-t pt-7">
            <span className="label-mono text-muted">{PROFILE.location}</span>
            <span className="label-mono text-muted">{PROFILE.phone}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
