import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Frontier } from "@/components/Frontier";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { OpenSource } from "@/components/OpenSource";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";
import { SECTION_CONTAINER } from "@/lib/layout";
import { getRepos, getActivity } from "@/lib/github";

const STACK = [
  "Python",
  "PyTorch",
  "Scikit-learn",
  "XGBoost",
  "NumPy",
  "Pandas",
  "FastAPI",
  "PostgreSQL",
  "SQL",
  "n8n",
  "Git",
  "Linux",
];

export default async function Page() {
  // Cached and revalidated on the server; see `lib/github.ts`. Returns an empty
  // list rather than throwing, so the section owns its own empty state.
  const [repos, activity] = await Promise.all([getRepos(), getActivity()]);

  return (
    <>
      <Hero />

      {/*
       * Stack band: a line of setting carried across the full width, the
       * transition out of the hero and into the written sections.
       *
       * Items wrap as a list rather than running as one inline line. Adjacent
       * spans with no whitespace between them offer no line-break opportunity,
       * so the whole strip becomes a single unbreakable run and drags the
       * layout viewport wider than the phone it is on.
       */}
      <div className="border-y border-bright/10 bg-ink/70 py-6">
        <div className={SECTION_CONTAINER}>
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-soft">
            {STACK.map((item, index) => (
              <li key={item} className="flex items-center gap-3">
                {index > 0 ? (
                  <span className="text-accent/60" aria-hidden>
                    ·
                  </span>
                ) : null}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Highlights />

      <About />
      <Projects />
      <OpenSource repos={repos} activity={activity} />
      <Frontier />
      <Research />
      <Skills />
      <Experience />
      <Contact />
    </>
  );
}
