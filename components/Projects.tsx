"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkIndex } from "@/components/WorkIndex";
import { PROJECTS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title={["Three systems, and the", "engineering behind", "each one."]}
          description="Three systems from my CV, each written up with its architecture, its approach and its tooling, and the specification exactly as the CV states it. Two are not public yet, and those two say so."
        />

        <WorkIndex />

        <div className="mt-14 lg:mt-20">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              reversed={index % 2 === 1}
            />
          ))}
        </div>

        <Reveal className="mt-2">
          <div className="hairline flex flex-wrap items-center justify-between gap-4 border-t pt-8">
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              Two of these aren&apos;t public yet. Walkthroughs are available on
              request.
            </p>
            <span className="label-mono text-muted">
              {String(PROJECTS.length).padStart(2, "0")} case studies
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
