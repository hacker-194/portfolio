import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { SECTION_CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * The 404.
 *
 * It renders inside the root layout, so the bar, the footer and the palette are
 * all still there; this only supplies the missing middle. No motion beyond the
 * button hover: a reader who mistyped an address wants the way back, not a
 * performance.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-[62svh] items-center py-28 sm:py-32">
      <div className={SECTION_CONTAINER}>
        <div className="flex w-full items-center gap-4">
          <span className="font-mono text-sm tabular-nums text-muted">404</span>
          <span className="hairline h-px flex-1 border-t" aria-hidden />
          <span className="label-mono text-muted">Not in the running order</span>
        </div>

        <h1 className="display-tight mt-8 max-w-3xl text-[clamp(1.9rem,4.4vw,3.4rem)] font-light text-bright">
          This address doesn&apos;t lead anywhere.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-soft">
          I don&apos;t have a page here, and I&apos;d rather you didn&apos;t hit
          a dead end. Everything I&apos;ve built is on the front page: the three
          case studies, where the source will land, and my contact details. The
          work is the quickest way in.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton
            href="/"
            variant="primary"
            icon={<ArrowRight className="h-4 w-4" strokeWidth={2.2} />}
          >
            Back to the front page
          </MagneticButton>
          <MagneticButton href="/#projects" variant="secondary">
            See the work
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
