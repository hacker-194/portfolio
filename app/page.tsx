import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Discipline } from "@/components/Discipline";
import { Experience } from "@/components/Experience";
import { Frontier } from "@/components/Frontier";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";

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

export default function Page() {
  return (
    <>
      <Hero />

      {/* Stack band — the transition from the hero into the written sections. */}
      <div className="relative border-y border-white/[0.06] bg-obsidian/60 py-6">
        <Marquee
          items={STACK}
          speed={56}
          className="font-display text-[0.95rem] font-semibold uppercase tracking-[0.22em] text-mist/45 sm:text-[1.05rem]"
        />
      </div>

      <About />
      <Projects />
      <Frontier />
      <Research />
      <Skills />
      <Experience />
      <Discipline />
      <Contact />
    </>
  );
}
