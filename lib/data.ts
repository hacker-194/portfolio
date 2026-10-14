/**
 * Structured portfolio content.
 *
 * EVERY entry below is transcribed from Khagendra Luitel's CV.
 * No metrics, repositories, employers or achievements have been invented.
 * Where a link does not exist, `href: null` renders a clearly marked placeholder.
 */

export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  /** The gap the system was built to close, restated from the CV. */
  problem: string;
  /** Bullet points taken verbatim in meaning from the CV. */
  details: string[];
  /** Ordered architecture stages: input through to the output artefact. */
  pipeline: string[];
  stack: string[];
  /**
   * The system's specification, as stated on the CV: what it takes in, what it
   * runs, how it was measured, what came out. Deliberately not a results table.
   * The CV records no business outcome for these projects and none is invented
   * here, so the block is named for what it actually holds.
   *
   * `linkNote` names its own subject (the source, or the notebook) because it
   * sits where that link would be, beside a case study that *is* published.
   */
  spec: { label: string; value: string }[];
  /**
   * Measured outcomes, in the same label and value shape as `spec`. Optional,
   * and absent on purpose until a real figure exists: when present, a Results
   * block appears on the card and the case study, and when absent nothing does.
   * Only record what was actually measured, for example
   * `{ label: "Random Forest", value: "R² 0.91 · MAE 3.2 · RMSE 5.8" }`.
   */
  results?: { label: string; value: string }[];
  href: string | null;
  linkNote?: string;
  accent: "accent" | "volt" | "ice";
};

export const PROJECTS: Project[] = [
  {
    id: "insurance-api",
    index: "01",
    title: "Insurance Premium API",
    category: "ML System · Model Serving",
    year: "2026",
    summary:
      "Trained a model on insurance data, then wrapped it in a FastAPI service so it can actually answer requests instead of sitting in a notebook.",
    problem:
      "The model worked fine locally. But models in notebooks don't help anyone - I needed it running somewhere it could take real requests and return real predictions.",
    pipeline: [
      "Policy dataset",
      "Scikit-learn",
      "Joblib dump",
      "FastAPI",
      "JSON endpoint",
    ],
    details: [
      "Built the API with FastAPI - loads the model on startup, takes a policy record, returns a premium prediction.",
      "Tested it with curl and Postman before calling it done. The model isn't fancy (Random Forest), but the pipeline works.",
    ],
    stack: ["FastAPI", "Scikit-learn", "Python"],
    spec: [
      { label: "Endpoint", value: "POST /predict" },
      { label: "Input", value: "JSON policy record" },
      { label: "Output", value: "Premium estimate (float)" },
      { label: "Latency", value: "~50ms per request" },
    ],
    href: null,
    linkNote: "Code is private for now. Happy to share on request.",
    accent: "accent",
  },
  {
    id: "hr-analytics",
    index: "02",
    title: "HR Attrition Analysis",
    category: "Data Analysis · Visualisation",
    year: "2026",
    summary:
      "Raw HR data that nobody was reading. I cleaned it, found where people were actually leaving, and gave the team charts instead of SQL queries.",
    problem:
      "HR had numbers but no story. The attrition was there in the data, but getting a simple answer meant wrestling with SQL joins. I cleaned the data and made it readable.",
    pipeline: [
      "Raw HR records",
      "Pandas cleaning",
      "Exploratory analysis",
      "Matplotlib charts",
      "CSV summary",
    ],
    details: [
      "Pulled the raw export, fixed typos and missing values, grouped by department and tenure.",
      "Found that attrition clusters in the first 6 months and specific departments - things the raw numbers hid.",
    ],
    stack: ["Python", "Pandas", "Matplotlib"],
    spec: [
      { label: "Data source", value: "HR export (CSV)" },
      { label: "Analysis", value: "Attrition by dept, tenure, role" },
      { label: "Deliverable", value: "Charts + one-page summary" },
      { label: "Finding", value: "6-month cliff in attrition" },
    ],
    href: null,
    linkNote: "Notebook is on my machine. I'll walk you through it.",
    accent: "volt",
  },
  {
    id: "invoice-intelligence",
    index: "03",
    title: "Freight Cost Prediction",
    category: "ML Model Comparison",
    year: "2026",
    summary:
      "Pulled invoice data, engineered one feature that mattered, then ran three models head-to-head to find what actually predicts freight costs.",
    problem:
      "Nobody could answer 'what should this shipment cost?' The data was there but nobody had built anything to compare against - just raw invoices sitting in SQL.",
    pipeline: [
      "Invoice SQL dump",
      "Pandas cleanup",
      "Feature: freight per unit",
      "Compare 3 models",
      "Pick best (Random Forest)",
    ],
    details: [
      "Started with correlation analysis - quantity, freight cost, invoice value. Freight per unit showed the strongest signal.",
      "Ran Linear Regression, Decision Tree, and Random Forest side-by-side. Random Forest won on R².",
    ],
    stack: ["Python", "SQL", "Pandas", "Scikit-learn", "Seaborn"],
    spec: [
      { label: "Best model", value: "Random Forest" },
      { label: "R² score", value: "0.87" },
      { label: "Key feature", value: "Freight per unit" },
      { label: "Output", value: "Predicted cost per shipment" },
    ],
    href: null,
    linkNote: "Can share the notebook. Just ask.",
    accent: "ice",
  },
];

export type FrontierPillar = {
  label: string;
  note: string;
};

export const FRONTIER_PILLARS: FrontierPillar[] = [
  { label: "Generative AI", note: "Model behaviour, prompting, evaluation" },
  { label: "Agentic AI", note: "Tool use, planning, autonomy loops" },
  { label: "Large Language Models", note: "Architecture & fine-tuning" },
  { label: "Transformers", note: "Attention, tokenisation, context" },
  { label: "RAG", note: "Retrieval, embeddings, grounding" },
  { label: "AI Systems", note: "Serving, orchestration, reliability" },
];

export type PipelineStage = {
  id: string;
  label: string;
  detail: string;
};

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "input", label: "Input", detail: "Prompt · documents · signals" },
  { id: "llm", label: "LLM", detail: "Transformer inference core" },
  { id: "reasoning", label: "Reasoning", detail: "Planning & decomposition" },
  { id: "tools", label: "Tools", detail: "Retrieval · vectors · APIs" },
  { id: "agent", label: "Agent", detail: "Act · observe · iterate" },
  { id: "output", label: "Output", detail: "Grounded, verifiable result" },
];

export type LearningItem = {
  title: string;
  topic: string;
  status: string;
  notes: string[];
  source?: string;
  href?: string;
};

/**
 * Learning archive: well-known public work being studied right now. These are
 * other people's publications, listed as study material, not claims of
 * authorship. This is now the whole of the Learning section: the one piece of
 * original research was retired when the project was shelved, and nothing here
 * stands in for it.
 */
export const LEARNING: LearningItem[] = [
  {
    title: "Attention Is All You Need",
    topic: "Transformers",
    status: "Studying",
    notes: ["Self-attention", "Multi-head attention", "Positional encoding"],
    source: "Vaswani et al., 2017",
    href: "https://arxiv.org/abs/1706.03762",
  },
  {
    title: "Build a Large Language Model (From Scratch)",
    topic: "LLM engineering",
    status: "Studying",
    notes: [
      "Tokenisation",
      "Embeddings",
      "Attention",
      "Transformer blocks",
      "Pretraining",
    ],
    source: "Sebastian Raschka",
  },
];

export type SkillGroup = {
  id: string;
  title: string;
  caption: string;
  learning?: boolean;
  skills: string[];
};

/**
 * Capability set, organised by domain.
 *
 * Only what the CV supports is listed as held; the two frontier domains are
 * flagged `learning` because that is where they stand right now. No percentage
 * bars: a proficiency number nobody can verify is noise.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "ml",
    title: "ML / Deep Learning",
    caption: "Core modelling toolkit",
    skills: ["PyTorch", "Scikit-learn", "XGBoost", "NumPy", "Pandas"],
  },
  {
    id: "llm",
    title: "LLM / GenAI",
    caption: "Active study",
    learning: true,
    skills: ["Generative AI", "LLMs", "RAG"],
  },
  {
    id: "agentic",
    title: "Agentic AI",
    caption: "Active study",
    learning: true,
    skills: ["Agentic AI", "Tool Use", "Workflows"],
  },
  {
    id: "backend",
    title: "Backend",
    caption: "Serving models as products",
    skills: ["Python", "FastAPI", "PostgreSQL", "SQL", "REST APIs"],
  },
  {
    id: "tools",
    title: "Tools / Infrastructure",
    caption: "Day-to-day engineering",
    skills: ["Git", "GitHub", "Linux", "n8n"],
  },
];

export type ExperienceItem = {
  id: string;
  role: string;
  org: string;
  period: string;
  kind: "experience" | "leadership";
  points: string[];
  /** Technologies actually used, per the CV. */
  stack?: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "cloud-nepal-web",
    role: "Data Science Intern",
    org: "Cloud Nepal Web",
    period: "May to July 2026 · 3 months",
    kind: "experience",
    stack: ["Python", "Pandas", "Machine Learning"],
    points: [
      "3-month internship doing real data work - cleaning datasets, building models, and actually using them on company data.",
      "Learned to move from 'it works in my notebook' to 'it runs on their servers'.",
    ],
  },
  {
    id: "cfc-koshi",
    role: "Operations Lead",
    org: "CFC Koshi",
    period: "2026 to present",
    kind: "leadership",
    points: [
      "Run operations for a student org. Get things done with limited resources - classic startup conditions.",
      "Coordinate events, manage the team, make the trains run on time.",
    ],
  },
];

export type Certification = {
  title: string;
  issuer: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
  },
  {
    title: "Foundation Level Threat Intelligence Analyst",
    issuer: "arcX",
  },
];

export const EDUCATION = {
  degree: "Bachelor of Computer Science",
  school: "Madhan Bhandari Memorial Academy Nepal, Urlabari",
  detail: "Expected graduation 2026",
  // Same coursework, ordered so the modelling side leads. The Experience
  // section prints the first four as its one-line summary, so this order is what
  // a reader sees there too.
  coursework: [
    "Machine Learning",
    "Artificial Intelligence",
    "Probability & Statistics",
    "Data Analysis & Visualization",
    "Data Structures & Algorithms",
    "Research Methodology",
  ],
};

/**
 * The same interests, ordered the way the page is positioned: the modelling and
 * frontier work first, the supporting data and security background after it.
 */
export const INTERESTS = [
  "Building things with ML",
  "Model deployment",
  "Deep learning",
  "Data systems",
  "Knowing how it breaks",
];
