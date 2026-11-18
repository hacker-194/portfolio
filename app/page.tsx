import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
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
  const [repos, activity] = await Promise.all([getRepos(), getActivity()]);

  return (
    <>
      <Hero />

      {/* Technical toolkit strip */}
      <div className="border-b border-bright/10 py-4">
        <div className={SECTION_CONTAINER}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="label-mono text-muted">Toolkit</span>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-soft">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="after:ml-3 after:text-edge after:content-['/'] last:after:content-none"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Projects />
      <Experience />
      <OpenSource repos={repos} activity={activity} />
      <About />
      <Skills />
      <Research />
      <Contact />
    </>
  );
}
