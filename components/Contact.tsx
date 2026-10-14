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
      {/* One tinted sheet under the closing call to action: the accent and the
          ambient grey together, the destination the scroll has been building
          toward. A printed tone, not a glow, and this section stays on the
          sheet rather than becoming a plate, because the embedded form is
          served by a third party and cannot be trusted to set dark type. */}
      <div className={SECTION_CONTAINER}>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" aria-hidden />
              Get in Touch
            </span>
          </Reveal>

          <h2 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-bold tracking-tight text-bright">
            Let&apos;s build something <span className="text-accent">exceptional.</span>
          </h2>

          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {PROFILE.availability}. If you have an engineering problem, an ML project, or a research direction to explore, I&apos;d love to connect.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-9">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <MagneticButton
                variant="primary"
                href={`mailto:${PROFILE.email}`}
                icon={<ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />}
              >
                Send Email
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                onClick={() => copy(PROFILE.email)}
                icon={
                  copied ? (
                    <Check className="h-4 w-4 text-accent" strokeWidth={2.2} />
                  ) : (
                    <Copy className="h-4 w-4" strokeWidth={1.9} />
                  )
                }
              >
                {copied ? "Copied to clipboard" : "Copy email address"}
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                href={PROFILE.resume}
                external
                ariaLabel="Open curriculum vitae (PDF)"
                icon={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
              >
                Curriculum Vitae
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <ContactForm />
          </Reveal>
        </div>

        {/* Channels */}
        <div className="mt-16 grid overflow-hidden rounded-2xl border border-bright/10 bg-panel/50 backdrop-blur-sm sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-bright/10">
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
                className="group relative flex flex-col justify-between gap-6 p-7 transition-all duration-300 hover:bg-panel2 sm:p-8"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{
                  duration: 0.5,
                  ease: EASE_CINEMATIC,
                  delay: index * 0.06,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-accent/20 bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">{channel.label}</span>
                  <p className="mt-2 font-mono text-sm tracking-wide text-bright">
                    {channel.value}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bright/10 pt-7 text-xs text-muted">
            <span>{PROFILE.location}</span>
            <span>{PROFILE.phone}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
