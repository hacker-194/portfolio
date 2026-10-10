import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { ProjectVisual } from "@/components/ProjectVisual";
import { StudyBlock } from "@/components/StudyBlock";
import { PROJECTS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { ACCENT_CLASS, CHIP, VISUAL } from "@/lib/visuals";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

/** Every case study is prerendered; nothing here needs request-time data. */
export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((entry) => entry.id === slug);

  if (!project) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

/**
 * One project, on its own URL.
 *
 * Same material as the card on the front page, laid out as a document rather
 * than a panel: the figure, then problem, approach, architecture and results in
 * two columns. Nothing is added that the card does not already say, so the two
 * can be read against each other.
 */
export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((entry) => entry.id === slug);
  if (!project) notFound();

  return (
    <section className="relative overflow-hidden py-24 sm:py-28 lg:py-32">
      <div className={SECTION_CONTAINER}>
        <Link
          href="/#projects"
          className="group/back label-mono inline-flex items-center gap-2 text-muted transition-colors duration-300 hover:text-accent"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover/back:-translate-x-1"
            strokeWidth={1.8}
            aria-hidden
          />
          All projects
        </Link>

        {/* Folio: the case study's place in the running order, plus its
            category and year against a hairline. */}
        <div className="mt-9 flex w-full items-center gap-4">
          <span
            className={cn(
              "font-mono text-sm tabular-nums",
              ACCENT_CLASS[project.accent],
            )}
          >
            {project.index}
          </span>
          <span className="hairline h-px flex-1 border-t" aria-hidden />
          <span className="label-mono text-muted">{project.category}</span>
          <span className="label-mono text-muted">{project.year}</span>
        </div>

        <h1 className="display-tight mt-8 max-w-4xl text-[clamp(2rem,5vw,4rem)] font-medium text-bright">
          {project.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-soft sm:text-lg">
          {project.summary}
        </p>

        <div className="mt-12 max-w-5xl">
          <ProjectVisual variant={VISUAL[project.id] ?? "api"} />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-9 lg:col-span-7">
            <StudyBlock label="Problem">
              <p className="text-sm leading-relaxed text-soft sm:text-base">
                {project.problem}
              </p>
            </StudyBlock>

            <StudyBlock label="Approach">
              <ul className="flex flex-col gap-3.5">
                {project.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex gap-3.5 text-sm leading-relaxed text-soft sm:text-base"
                  >
                    <span
                      className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </StudyBlock>
          </div>

          <div className="flex flex-col gap-9 lg:col-span-5">
            <StudyBlock label="Architecture">
              {/* Same order as the card, and the same trailing connector: a
                  wrapped row starts on a stage, not on an arrow. */}
              <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-xs uppercase tracking-[0.1em] text-soft">
                {project.pipeline.map((stage, index) => (
                  <li key={stage} className="flex items-center gap-2.5">
                    <span className="rounded-lg border border-bright/15 bg-bright/5 px-2.5 py-1.5">
                      {stage}
                    </span>
                    {index < project.pipeline.length - 1 ? (
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-muted"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    ) : null}
                  </li>
                ))}
              </ol>
            </StudyBlock>

            <StudyBlock label="Specification">
              <dl className="flex flex-col">
                {project.spec.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-bright/10 py-3 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <dt className="label-mono w-28 shrink-0 text-muted">
                      {item.label}
                    </dt>
                    <dd className="text-sm leading-snug text-bright">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </StudyBlock>

            <StudyBlock label="Stack">
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech} className={CHIP}>
                    {tech}
                  </li>
                ))}
              </ul>
            </StudyBlock>
          </div>
        </div>

        <div className="hairline mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-8">
          <Link
            href="/#projects"
            className="group/link inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.16em] text-bright transition-colors hover:text-accent"
          >
            All case studies
            <ArrowLeft
              className="h-4 w-4 text-accent transition-transform duration-300 group-hover/link:-translate-x-1"
              strokeWidth={2}
            />
          </Link>

          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group/link inline-flex items-center gap-2.5 text-sm font-medium uppercase tracking-[0.16em] text-bright transition-colors hover:text-accent"
            >
              Source code
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                strokeWidth={2}
              />
            </a>
          ) : (
            <div className="inline-flex items-center gap-3 rounded-lg border border-dashed border-bright/15 px-3.5 py-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.8} />
              <span className="font-mono text-xs leading-tight tracking-wide text-muted">
                {project.linkNote}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
