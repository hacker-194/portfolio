"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { SKILL_GROUPS } from "@/lib/data";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC, viewportOnce } from "@/lib/motion";
import { CHIP_BUTTON, CHIP_BUTTON_LARGE } from "@/lib/visuals";
import {
  DOMAIN_ORDER,
  SKILL_LINKS,
  SKILL_NODES,
  evidenceFor,
  neighboursOf,
  nodeById,
  nodesInDomain,
  type SkillEvidence,
} from "@/lib/skill-universe";
import { cn } from "@/lib/utils";

/**
 * The skill universe.
 *
 * One figure and one panel over the same graph, which is the whole idea: the
 * canvas shows how the toolkit connects, and the panel answers what backs any
 * single node up. Selecting a node in either place selects it in both, so the
 * figure is never the only way to reach something.
 *
 * The panel is also the accessible path. A canvas cannot be read by a screen
 * reader, so every node is a real button here, in the same five domains the
 * figure draws.
 */

/**
 * The canvas is the heaviest single component and sits far below the fold, so it
 * is split out of the main bundle and fetched after hydration. The placeholder
 * takes the same box as the figure, so nothing shifts when it arrives. The text
 * panel beside it is the complete reading and does not wait for the canvas.
 */
const SkillUniverseCanvas = dynamic(
  () =>
    import("@/components/SkillUniverseCanvas").then(
      (mod) => mod.SkillUniverseCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="relative block aspect-[4/3] h-auto w-full sm:aspect-[16/11]"
        aria-hidden
      />
    ),
  },
);

/** "1 entry" reads better than "1 entries", and the count is on screen often. */
function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function SkillUniverse() {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState(SKILL_GROUPS[0].id);

  const evidence = useMemo(() => {
    const node = selected ? nodeById(selected) : undefined;
    return node ? evidenceFor(node) : null;
  }, [selected]);

  /** Selecting a skill opens its domain too, so clearing lands back where it is. */
  const select = (id: string) => {
    const node = nodeById(id);
    if (node) setOpenGroup(node.domain);
    setSelected(id);
  };

  const open = (id: string) => {
    setSelected(null);
    setOpenGroup(id);
  };

  return (
    <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
      <Reveal y={30} className="lg:col-span-7 lg:self-start">
        <figure className="glass-panel relative overflow-hidden rounded-[3px] border">
          <div className="keylight pointer-events-none absolute inset-0" aria-hidden />

          <SkillUniverseCanvas
            selectedId={selected}
            onSelect={select}
            label={`A map of ${SKILL_NODES.length} skills in three dimensions, grouped into five domains and joined by ${SKILL_LINKS.length} connections. The panel beside it lists the same skills as text.`}
            className="relative block aspect-[4/3] h-auto w-full font-mono sm:aspect-[16/11]"
          />

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-void/80 to-transparent"
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-x-5 bottom-3 flex items-end justify-between gap-5">
            {/* Sentence case, at the label floor rather than below it, and in the
                brighter ink: an instruction only works if it is read. */}
            <figcaption className="max-w-[21rem] font-mono text-xs leading-relaxed tracking-[0.06em] text-soft">
              Drag to turn it. Select a node to see where that skill is used.
            </figcaption>
            <span className="label-mono hidden shrink-0 text-muted sm:block">
              {SKILL_NODES.length} skills &middot; {SKILL_LINKS.length} connections
            </span>
          </div>
        </figure>
      </Reveal>

      <div className="lg:col-span-5">
        {evidence ? (
          <SkillDetail
            key={evidence.node.id}
            evidence={evidence}
            reduce={reduce}
            onSelect={select}
            onClear={() => setSelected(null)}
          />
        ) : (
          <SkillIndex reduce={reduce} active={openGroup} onOpen={open} onSelect={select} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * The detail panel
 * ------------------------------------------------------------------ */

type DetailProps = {
  evidence: SkillEvidence;
  reduce: boolean;
  onSelect: (id: string) => void;
  onClear: () => void;
};

/**
 * What the CV records about one skill: every case study, the role, the
 * coursework, the study material and the frontier direction that name it, each
 * with the source it came from. No number here is stated without its evidence.
 */
function SkillDetail({ evidence, reduce, onSelect, onClear }: DetailProps) {
  const { node, group, projects, roles, coursework, study, pillars, declared, count } =
    evidence;
  const neighbours = neighboursOf(node.id);
  const cardRef = useRef<HTMLDivElement | null>(null);

  /*
   * The detail replaces the list that was just used to choose it, so the button
   * that was pressed no longer exists and focus would fall back to the page.
   * Moving it here keeps the keyboard where the reading is, and carries the
   * change to a screen reader. `preventScroll` keeps a tap on the figure from
   * yanking the page down to a panel that is already on screen.
   */
  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      tabIndex={-1}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_CINEMATIC }}
      className="glass-panel flex flex-col gap-6 rounded-[3px] border p-6 outline-none sm:p-7"
    >
      <div className="flex flex-col gap-2.5">
        <span className="label-mono text-accent">{group.title}</span>
        <h3 className="font-display text-3xl font-normal tracking-tight text-bright sm:text-4xl">
          {node.label}
        </h3>
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="label-mono text-ice">{evidence.standingLabel}</span>
          <span className="max-w-md text-sm leading-relaxed text-soft">
            {evidence.standingNote}
          </span>
        </p>
        {count > 0 ? (
          <span className="label-mono text-muted">
            {plural(count, "entry", "entries")} in the CV
          </span>
        ) : null}
      </div>

      <dl className="hairline flex flex-col gap-5 border-t pt-5">
        {projects.length > 0 ? (
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-muted">Case studies</dt>
            <dd className="flex flex-col gap-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group flex items-baseline gap-3 text-left"
                >
                  <span className="label-mono text-accent">{project.index}</span>
                  <span className="font-display text-base font-medium text-soft underline-offset-4 transition-colors duration-300 group-hover:text-bright group-hover:underline">
                    {project.title}
                  </span>
                </Link>
              ))}
            </dd>
          </div>
        ) : null}

        {roles.length > 0 ? (
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-muted">Experience</dt>
            <dd className="flex flex-col gap-2">
              {roles.map((role) => (
                <span key={role.id} className="flex flex-col">
                  <span className="text-sm text-soft">
                    {role.role}, {role.org}
                  </span>
                  <span className="font-mono text-xs text-muted">{role.period}</span>
                </span>
              ))}
            </dd>
          </div>
        ) : null}

        {coursework.length > 0 ? (
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-muted">Coursework</dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1.5">
              {coursework.map((entry) => (
                <span key={entry} className="text-sm text-soft">
                  {entry}
                </span>
              ))}
            </dd>
          </div>
        ) : null}

        {study.length > 0 ? (
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-muted">Study material</dt>
            <dd className="flex flex-col gap-2.5">
              {study.map((item) => (
                <span key={item.title} className="flex flex-col">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-soft underline decoration-accent/40 underline-offset-4 transition-colors duration-300 hover:text-bright"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="text-sm text-soft">{item.title}</span>
                  )}
                  {item.source ? (
                    <span className="font-mono text-xs text-muted">{item.source}</span>
                  ) : null}
                </span>
              ))}
            </dd>
          </div>
        ) : null}

        {pillars.length > 0 ? (
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-muted">Frontier direction</dt>
            <dd className="flex flex-col gap-2">
              {pillars.map((pillar) => (
                <span key={pillar} className="text-sm text-soft">
                  {pillar}
                </span>
              ))}
            </dd>
          </div>
        ) : null}

        {declared ? (
          <div className="flex flex-col gap-2">
            <dt className="label-mono text-muted">Skills list</dt>
            <dd className="text-sm text-soft">
              Listed among the technical skills on the CV.
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="hairline flex flex-col gap-3 border-t pt-5">
        <span className="label-mono text-muted">Connects to</span>
        <div className="flex flex-wrap gap-2">
          {neighbours.map((neighbour) => (
            <button
              key={neighbour.id}
              type="button"
              onClick={() => onSelect(neighbour.id)}
              className={CHIP_BUTTON}
            >
              {neighbour.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="hairline self-start border-t pt-4 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors duration-300 hover:text-bright"
      >
        All skills
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * The index, which is the same five domains the figure draws
 * ------------------------------------------------------------------ */

type IndexProps = {
  reduce: boolean;
  active: string;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
};

function SkillIndex({ reduce, active, onOpen, onSelect }: IndexProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-lg text-sm leading-relaxed text-soft">
        Node size is how many entries record that skill: a case study, the
        internship, a course, or something being studied right now. Every one of
        those entries is listed the moment you select the node.
      </p>

      <div className="flex flex-col gap-px overflow-hidden rounded-[3px] border border-bright/15 bg-bright/5">
        {SKILL_GROUPS.map((group, index) => {
          const isActive = active === group.id;
          // The same five domains, in the same order the figure draws them.
          const skills = nodesInDomain(DOMAIN_ORDER[index]);

          return (
            <motion.div
              key={group.id}
              className={cn(
                "relative bg-void p-6 transition-colors duration-500 sm:p-7",
                isActive ? "bg-panel2/70" : "hover:bg-panel/60",
              )}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: EASE_CINEMATIC, delay: index * 0.07 }}
              onPointerEnter={() => onOpen(group.id)}
              onFocus={() => onOpen(group.id)}
            >
              <span
                className={cn(
                  "accent-gradient absolute inset-y-0 left-0 w-px origin-top transition-transform duration-500",
                  isActive ? "scale-y-100" : "scale-y-0",
                )}
                aria-hidden
              />

              <button
                type="button"
                onClick={() => onOpen(group.id)}
                className="flex w-full flex-col items-start gap-1.5 text-left"
                aria-expanded={isActive}
              >
                <span className="flex items-baseline gap-4">
                  <span className="label-mono text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-xl font-semibold tracking-tight transition-colors duration-500 sm:text-2xl",
                      isActive ? "text-bright" : "text-soft",
                    )}
                  >
                    {group.title}
                  </span>
                </span>
                <span className="label-mono pl-8 text-muted">
                  {group.learning ? "learning" : group.caption}
                </span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-x-5 gap-y-2 pt-5">
                  {skills.map((skill, skillIndex) => (
                    <motion.button
                      key={skill.id}
                      type="button"
                      onClick={() => onSelect(skill.id)}
                      className={CHIP_BUTTON_LARGE}
                      initial={false}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE_CINEMATIC,
                        delay: isActive ? 0.06 + skillIndex * 0.04 : 0,
                      }}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {skill.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <p className="max-w-lg font-mono text-xs leading-relaxed tracking-[0.06em] text-muted">
        GenAI, Agentic AI and RAG are marked as learning, because that&apos;s where
        they are today.
      </p>
    </div>
  );
}

export default SkillUniverse;
