"use client";

import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PROJECTS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";
import { radialGlow } from "@/lib/palette";

export function Projects() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-28 lg:py-36"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[80rem] -translate-x-1/2 opacity-60"
        style={{
          background: radialGlow("burnt", 0.16, {
            geometry: "50% 50% at 50% 0%",
            stop: 70,
          }),
        }}
        aria-hidden
      />

      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="03"
          eyebrow="Selected work"
          title={["Systems I built,", "described exactly", "as they are."]}
          description="Three case studies taken straight from my CV — the architecture, the approach and the tooling. Nothing here is inflated: where a repository link does not exist yet, the card says so plainly."
        />

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
            <p className="max-w-xl text-sm leading-relaxed text-ash">
              Repository links are added as each project is packaged for public
              release. In the meantime, walkthroughs are available directly.
            </p>
            <span className="label-mono text-ash/60">
              {String(PROJECTS.length).padStart(2, "0")} case studies
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
