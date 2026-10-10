import {
  EDUCATION,
  EXPERIENCE,
  FRONTIER_PILLARS,
  LEARNING,
  PROJECTS,
  SKILL_GROUPS,
  type SkillGroup,
} from "./data.ts";

/**
 * The skill universe: what goes in it, how it connects, and where it sits.
 *
 * Two rules hold this file together.
 *
 * One: the graph is only a set of names and connections. Nothing about how well
 * any of it is known is written here by hand. `evidenceFor` reads `lib/data.ts`
 * and reports which case studies, which role, which coursework and which study
 * item record a skill, so a node cannot claim more than the CV supports.
 *
 * Two: the layout is a pure function of the node list, so the figure is the same
 * on every load and the same on the server as in the browser.
 */

export type SkillDomainId = "ml" | "llm" | "agentic" | "backend" | "tools";

export type SkillNode = {
  id: string;
  label: string;
  domain: SkillDomainId;
  /**
   * Other spellings of the same skill as `lib/data.ts` writes them, matched
   * exactly (case and punctuation aside). Every node needs at least one match
   * somewhere in the data, and `universeIssues` fails the build test if one
   * does not.
   */
  also?: string[];
};

/** The domain order is the skill section's own order, not a second one. */
export const DOMAIN_ORDER: SkillDomainId[] = SKILL_GROUPS.map(
  (group) => group.id as SkillDomainId,
);

export const SKILL_NODES: SkillNode[] = [
  // Modelling, the toolkit every project here is built from.
  { id: "machine-learning", label: "Machine Learning", domain: "ml" },
  { id: "pytorch", label: "PyTorch", domain: "ml" },
  { id: "scikit-learn", label: "Scikit-learn", domain: "ml" },
  { id: "xgboost", label: "XGBoost", domain: "ml" },
  { id: "numpy", label: "NumPy", domain: "ml" },
  { id: "pandas", label: "Pandas", domain: "ml" },
  { id: "matplotlib", label: "Matplotlib", domain: "ml" },
  { id: "seaborn", label: "Seaborn", domain: "ml" },
  {
    id: "eda",
    label: "EDA",
    domain: "ml",
    also: [
      "Exploratory data analysis",
      "Exploratory analysis",
      "Data Analysis & Visualization",
    ],
  },

  // The frontier, studied rather than shipped.
  {
    id: "transformers",
    label: "Transformers",
    domain: "llm",
    also: ["Attention", "Transformer blocks"],
  },
  {
    id: "llms",
    label: "LLMs",
    domain: "llm",
    also: ["Large Language Models", "LLM engineering"],
  },
  { id: "generative-ai", label: "Generative AI", domain: "llm" },
  { id: "rag", label: "RAG", domain: "llm" },

  { id: "agentic-ai", label: "Agentic AI", domain: "agentic" },
  { id: "tool-use", label: "Tool Use", domain: "agentic" },
  { id: "workflows", label: "Workflows", domain: "agentic" },

  // Serving: where a model stops being a notebook.
  { id: "python", label: "Python", domain: "backend" },
  { id: "fastapi", label: "FastAPI", domain: "backend" },
  { id: "rest-apis", label: "REST APIs", domain: "backend" },
  { id: "sql", label: "SQL", domain: "backend" },
  { id: "postgresql", label: "PostgreSQL", domain: "backend" },
  { id: "ai-systems", label: "AI Systems", domain: "backend" },

  { id: "git", label: "Git", domain: "tools" },
  { id: "github", label: "GitHub", domain: "tools" },
  { id: "linux", label: "Linux", domain: "tools" },
  { id: "n8n", label: "n8n", domain: "tools" },
];

/**
 * Connections, as two node ids.
 *
 * Each pair is a composition that holds on its own terms: Python runs the
 * libraries, Pandas reads from SQL, a Transformer is what an LLM is, a served
 * model is what FastAPI is for. The figure draws them, and the panel lists them,
 * which is how the page answers what connects Python to PyTorch to Transformers
 * to agents without writing an essay about it.
 */
export const SKILL_LINKS: [string, string][] = [
  // Python as the hub.
  ["python", "numpy"],
  ["python", "pandas"],
  ["python", "pytorch"],
  ["python", "scikit-learn"],
  ["python", "xgboost"],
  ["python", "matplotlib"],
  ["python", "seaborn"],
  ["python", "fastapi"],
  ["python", "transformers"],

  // The data path.
  ["numpy", "pandas"],
  ["pandas", "matplotlib"],
  ["pandas", "seaborn"],
  ["pandas", "eda"],
  ["pandas", "machine-learning"],
  ["sql", "pandas"],
  ["sql", "postgresql"],
  ["sql", "eda"],
  ["eda", "machine-learning"],

  // Modelling.
  ["machine-learning", "scikit-learn"],
  ["machine-learning", "pytorch"],
  ["machine-learning", "xgboost"],
  ["scikit-learn", "fastapi"],

  // The frontier chain.
  ["pytorch", "transformers"],
  ["transformers", "llms"],
  ["llms", "generative-ai"],
  ["llms", "rag"],
  ["llms", "agentic-ai"],
  ["rag", "tool-use"],
  ["rag", "ai-systems"],
  ["agentic-ai", "tool-use"],
  ["agentic-ai", "workflows"],
  ["tool-use", "rest-apis"],
  ["workflows", "n8n"],

  // Serving and the day-to-day tools.
  ["fastapi", "rest-apis"],
  ["fastapi", "ai-systems"],
  ["ai-systems", "rest-apis"],
  ["n8n", "rest-apis"],
  ["linux", "postgresql"],
  ["linux", "git"],
  ["git", "github"],
];

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */

/**
 * Domain centres are five vertices of an icosahedron, so every pair of clusters
 * sits at the same 63 degrees from every other and no domain ends up behind
 * another by accident.
 */
const DOMAIN_CENTRE: Record<SkillDomainId, [number, number, number]> = {
  ml: [1, 1.618, 0],
  llm: [1.618, 0, 1],
  agentic: [0, -1, 1.618],
  backend: [-1, 1.618, 0],
  tools: [1.618, 0, -1],
};

/** Distance from the middle of the figure to the middle of a cluster. */
const ORBIT = 700;

/** How far a cluster's own nodes spread around that centre. */
const clusterRadius = (count: number) => 96 + 40 * Math.sqrt(count);

/** A small deterministic PRNG, so the figure is identical on every load. */
function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SkillPlacement = {
  /** Position in figure units, before the camera touches it. */
  x: number;
  y: number;
  z: number;
  domain: SkillDomainId;
  /** Radius of the whole figure, used to frame the camera. */
  distance: number;
};

/**
 * Nodes land on a Fibonacci ball inside their domain's shell, then get a small
 * deterministic nudge. The ball keeps the cluster even; the nudge stops it
 * reading as a machine-made sphere.
 */
function layout(): SkillPlacement[] {
  const counts = new Map<SkillDomainId, number>();
  for (const node of SKILL_NODES) {
    counts.set(node.domain, (counts.get(node.domain) ?? 0) + 1);
  }

  const seen = new Map<SkillDomainId, number>();
  const rand = mulberry(0x5c1177);

  return SKILL_NODES.map((node) => {
    const centre = DOMAIN_CENTRE[node.domain];
    const cLength = Math.hypot(centre[0], centre[1], centre[2]);
    const count = counts.get(node.domain) ?? 1;
    const index = seen.get(node.domain) ?? 0;
    seen.set(node.domain, index + 1);

    const radius = clusterRadius(count);
    // Golden angle, so consecutive nodes never stack on one axis.
    const phi = Math.acos(1 - (2 * (index + 0.5)) / count);
    const theta = index * 2.399963 + DOMAIN_ORDER.indexOf(node.domain) * 1.7;

    const spread = Math.sin(phi);
    const jitter = () => (rand() - 0.5) * 30;

    const x =
      (centre[0] / cLength) * ORBIT + spread * Math.cos(theta) * radius + jitter();
    const y =
      (centre[1] / cLength) * ORBIT + Math.cos(phi) * radius + jitter();
    const z =
      (centre[2] / cLength) * ORBIT + spread * Math.sin(theta) * radius + jitter();

    return {
      x,
      y,
      z,
      domain: node.domain,
      distance: Math.hypot(x, y, z),
    };
  });
}

const PLACEMENTS = layout();

/** The furthest anything sits from the middle, so the camera can frame it. */
export const UNIVERSE_EXTENT = PLACEMENTS.reduce(
  (furthest, placement) => Math.max(furthest, placement.distance),
  1,
);

export function placementOf(id: string): SkillPlacement | undefined {
  const index = SKILL_NODES.findIndex((node) => node.id === id);
  return index < 0 ? undefined : PLACEMENTS[index];
}

/* ------------------------------------------------------------------ *
 * Evidence, read from the CV data
 * ------------------------------------------------------------------ */

export type Standing = "shipped" | "practice" | "coursework" | "study" | "toolkit";

export type SkillEvidence = {
  node: SkillNode;
  group: SkillGroup;
  projects: typeof PROJECTS;
  roles: typeof EXPERIENCE;
  coursework: string[];
  study: typeof LEARNING;
  /** Frontier pillars that name this skill. */
  pillars: string[];
  /** Listed in the CV's technical skills, through its skill group. */
  declared: boolean;
  /**
   * How many entries record it: case studies, the role, coursework, study
   * material, frontier pillars. This is exactly the quantity that drives the
   * node's size on the figure, so the two can never disagree.
   */
  count: number;
  /** True when anything at all records it, the skills list included. */
  recorded: boolean;
  standing: Standing;
  standingLabel: string;
  standingNote: string;
};

/** Case and punctuation are the only differences that separate CV spellings. */
function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matches(node: SkillNode, source: string): boolean {
  const target = normalise(source);
  if (normalise(node.label) === target) return true;
  return (node.also ?? []).some((alias) => normalise(alias) === target);
}

const STANDING: Record<Standing, { label: string; note: string }> = {
  shipped: {
    label: "Shipped",
    note: "Used to build the case studies listed below.",
  },
  practice: {
    label: "In practice",
    note: "Used on real data through a three-month data science internship.",
  },
  coursework: {
    label: "Coursework",
    note: "Covered in my degree coursework.",
  },
  study: {
    label: "Studying",
    note: "Being studied now, nothing shipped with it yet.",
  },
  toolkit: {
    label: "In the toolkit",
    note: "Listed in my technical skills. No case study in this portfolio cites it yet.",
  },
};

/**
 * Everything the CV records about one skill, and nothing it does not.
 *
 * The order below is the order of evidence strength: what has shipped outranks
 * what paid work used, which outranks what a course covered, which outranks a
 * domain that is still being studied, which outranks a name on a skills list.
 */
export function evidenceFor(node: SkillNode): SkillEvidence {
  const group =
    SKILL_GROUPS.find((entry) => entry.id === node.domain) ?? SKILL_GROUPS[0];

  const projects = PROJECTS.filter((project) =>
    [...project.stack, ...project.pipeline, ...project.spec.map((row) => row.value)].some(
      (entry) => matches(node, entry),
    ),
  );

  const roles = EXPERIENCE.filter((role) =>
    (role.stack ?? []).some((entry) => matches(node, entry)),
  );

  const coursework = EDUCATION.coursework.filter((entry) => matches(node, entry));

  const study = LEARNING.filter(
    (item) =>
      matches(node, item.topic) ||
      matches(node, item.title) ||
      item.notes.some((note) => matches(node, note)),
  );

  const pillars = FRONTIER_PILLARS.filter((pillar) => matches(node, pillar.label))
    .map((pillar) => pillar.label);

  const declared = group.skills.some((skill) => matches(node, skill));
  const learningGroup = group.learning === true;

  const count =
    projects.length + roles.length + coursework.length + study.length + pillars.length;

  let standing: Standing;
  if (projects.length > 0) standing = "shipped";
  else if (roles.length > 0) standing = "practice";
  else if (coursework.length > 0) standing = "coursework";
  else if (study.length > 0 || pillars.length > 0 || learningGroup) standing = "study";
  else standing = "toolkit";

  return {
    node,
    group,
    projects,
    roles,
    coursework,
    study,
    pillars,
    declared,
    count,
    recorded: count > 0 || declared,
    standing,
    standingLabel: STANDING[standing].label,
    standingNote: STANDING[standing].note,
  };
}

/** The node's direct connections, as full nodes rather than ids. */
export function neighboursOf(id: string): SkillNode[] {
  const ids = SKILL_LINKS.filter(([a, b]) => a === id || b === id).map(([a, b]) =>
    a === id ? b : a,
  );
  return ids
    .map((entry) => SKILL_NODES.find((node) => node.id === entry))
    .filter((node): node is SkillNode => Boolean(node));
}

/** Nodes in one domain, in the order they are declared above. */
export function nodesInDomain(domain: SkillDomainId): SkillNode[] {
  return SKILL_NODES.filter((node) => node.domain === domain);
}

export function nodeById(id: string): SkillNode | undefined {
  return SKILL_NODES.find((node) => node.id === id);
}

/** How large to draw a node: more entries in the CV, a larger sphere. */
export function nodeScale(count: number): number {
  return Math.min(1.5, 0.82 + 0.12 * count);
}

/**
 * The integrity test for the whole file, and the reason it can be trusted.
 *
 * It returns one message per problem and an empty list when the graph is sound:
 * every link joins two declared nodes, every node is reachable through at least
 * one link, and every node is recorded somewhere in the CV data rather than
 * invented here. `scripts/check-skill-universe.ts` runs it.
 */
export function universeIssues(): string[] {
  const issues: string[] = [];
  const ids = new Set(SKILL_NODES.map((node) => node.id));

  if (ids.size !== SKILL_NODES.length) issues.push("duplicate node id");

  const linked = new Set<string>();
  for (const [a, b] of SKILL_LINKS) {
    if (!ids.has(a)) issues.push(`link names unknown node: ${a}`);
    if (!ids.has(b)) issues.push(`link names unknown node: ${b}`);
    if (a === b) issues.push(`link joins a node to itself: ${a}`);
    linked.add(a);
    linked.add(b);
  }

  for (const node of SKILL_NODES) {
    if (!linked.has(node.id)) issues.push(`node has no connections: ${node.id}`);

    const evidence = evidenceFor(node);
    if (!evidence.recorded) {
      issues.push(`node is not recorded anywhere in the CV data: ${node.id}`);
    }
  }

  for (const placement of PLACEMENTS) {
    if (!Number.isFinite(placement.distance)) {
      issues.push("layout produced a non-finite position");
      break;
    }
  }

  return issues;
}
