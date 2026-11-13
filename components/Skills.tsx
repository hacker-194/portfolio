import { SectionHeading } from "@/components/SectionHeading";
import { SKILL_GROUPS } from "@/lib/data";
import { SECTION_CONTAINER } from "@/lib/layout";

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
          description="Verified capabilities organized by engineering domain. ★ = active study."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group) => (
            <article
              key={group.id}
              className="rounded-xl border border-bright/10 bg-panel/40 p-6 transition-colors hover:border-accent/30"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-bright">
                  {group.title}
                </h3>
                {group.learning && (
                  <span className="rounded-full bg-volt/10 px-2 py-0.5 font-mono text-[0.625rem] text-volt">
                    ★ Active study
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted">{group.caption}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded border border-bright/10 bg-bright/5 px-3 py-1 font-mono text-xs text-soft transition-colors hover:border-accent/30 hover:text-bright"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
