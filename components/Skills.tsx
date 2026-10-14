import { SectionHeading } from "@/components/SectionHeading";
import { SkillUniverse } from "@/components/SkillUniverse";
import { SECTION_CONTAINER } from "@/lib/layout";

/**
 * The capability set.
 *
 * The figure, the domains and the evidence behind every skill live in
 * `SkillUniverse`. This section is the frame around them: the heading, and the
 * rhythm every other section on the page keeps.
 */
export function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden border-t border-bright/10 py-24 sm:py-32 lg:py-36"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          eyebrow="Technical Stack"
          title={["Core competencies,", "tooling, and frameworks."]}
          description="An interactive capability graph organized by engineering domain, backed by verified project evidence."
        />

        <SkillUniverse />
      </div>
    </section>
  );
}
