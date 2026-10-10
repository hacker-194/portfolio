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
      className="relative overflow-hidden border-t border-bright/15 py-24 sm:py-32 lg:py-40"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          index="07"
          eyebrow="Skills"
          title={["What I actually", "reach for."]}
          description="Grouped by how I work, marked where I'm still learning, and drawn as a universe you can turn."
        />

        <SkillUniverse />
      </div>
    </section>
  );
}
