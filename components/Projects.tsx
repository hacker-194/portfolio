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
      className="relative overflow-hidden py-24 sm:py-32 lg:py-36"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          eyebrow="Work"
          title={["Selected projects."]}
          description="Each one goes from raw data to something that runs."
        />

        <WorkIndex />

        <div className="mt-14 lg:mt-20 space-y-16 sm:space-y-24">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              reversed={index % 2 === 1}
            />
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-bright/10 pt-8 text-sm text-muted">
            <p>
              None of these have a public repository yet. Ask and I will walk you through the code.
            </p>
            <span className="font-mono text-xs text-soft">
              {String(PROJECTS.length).padStart(2, "0")} Case Studies
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
