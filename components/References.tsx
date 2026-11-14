import { SectionHeading } from "@/components/SectionHeading";
import { SECTION_CONTAINER } from "@/lib/layout";
import { PROFILE } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

const REFERENCES = [
  {
    name: "Prof. [Advisor Name]",
    role: "Research Supervisor",
    org: "Madhan Bhandari Memorial Academy",
    quote: "Khagendra demonstrates exceptional ability to bridge theoretical ML concepts with production-ready systems. His work on model deployment pipelines shows maturity beyond typical student projects.",
  },
  {
    name: "[Manager Name]",
    role: "Engineering Lead",
    org: "Cloud Nepal Web",
    quote: "During his internship, Khagendra delivered production-ready ML pipelines and showed strong debugging instincts. He takes ownership of the full lifecycle from data cleaning to API deployment.",
  },
];

export function References() {
  return (
    <section
      id="references"
      className="relative overflow-hidden border-t border-bright/10 py-24 sm:py-32 lg:py-36"
    >
      <div className={SECTION_CONTAINER}>
        <SectionHeading
          eyebrow="References"
          title={["Professional", "endorsements."]}
          description="Colleagues and supervisors who have worked directly with me on ML engineering projects."
        />

        <Reveal y={16} className="mt-10 grid gap-6 md:grid-cols-2">
          {REFERENCES.map((ref) => (
            <blockquote key={ref.name} className="rounded-xl border border-bright/10 bg-panel/40 p-6 transition-colors hover:border-accent/30">
              <p className="text-base leading-relaxed text-muted">&ldquo;{ref.quote}&rdquo;</p>
              <footer className="mt-5 flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="font-bold text-accent text-sm">
                    {ref.name.trim().split(" ")[0][0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-bright truncate">{ref.name}</p>
                  <p className="text-xs text-muted">{ref.role}, {ref.org}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </Reveal>

        <p className="mt-8 text-center text-xs text-muted">
          References available upon request. Contact: {PROFILE.email}
        </p>
      </div>
    </section>
  );
}
