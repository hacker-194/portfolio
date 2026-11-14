import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Frontier } from "@/components/Frontier";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Projects } from "@/components/Projects";
import { References } from "@/components/References";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";
import { SECTION_CONTAINER } from "@/lib/layout";
import { getRepos, getActivity } from "@/lib/github";
import OpenSource from "./OpenSourceWrapper";

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
  const [repos, activity] = await Promise.all([getRepos(), getActivity()]);

  return (
    <>
      <Hero />

      {/* Technical toolkit strip */}
      <div className="border-y border-bright/10 bg-ink/50 py-4 backdrop-blur-sm">
        <div className={SECTION_CONTAINER}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-muted">
              Core Toolkit
            </span>
            <ul className="flex flex-wrap items-center gap-2">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-bright/10 bg-panel/80 px-3 py-1 font-mono text-xs text-soft transition-colors hover:border-accent/40 hover:text-bright"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Projects />
      <Highlights />
      <Experience />
      <OpenSource repos={repos} activity={activity} />
      <About />
      <Skills />
      <References />
      <Frontier />
      <Research />
      <Contact />
    </>
  );
}
