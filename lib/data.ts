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
  href: string | null;
  linkNote?: string;
  accent: "accent" | "volt" | "ice";
};

export const PROJECTS: Project[] = [
  {
    id: "insurance-api",
    index: "01",
    title: "FastAPI Insurance Prediction API",
    category: "ML System · Model Serving",
    year: "2026",
    summary:
      "I built a REST API that serves an insurance premium prediction model, wiring trained scikit-learn inference straight into live endpoints.",
    problem:
      "A trained premium model can't answer a request while it's stuck in a notebook. Serving it predictably was the missing piece.",
    pipeline: [
      "Policy dataset",
      "Scikit-learn estimator",
      "Serialised model",
      "FastAPI service",
      "JSON prediction",
    ],
    details: [
      "I built a REST API to serve an insurance premium prediction model using FastAPI and Scikit-learn.",
      "I wired ML model inference into API endpoints for real-time predictions.",
    ],
    stack: ["FastAPI", "Scikit-learn", "Python"],
    spec: [
      { label: "Interface", value: "REST · JSON endpoints" },
      { label: "Inference", value: "Real-time, one request at a time" },
      { label: "Model", value: "Scikit-learn estimator, serialised" },
      { label: "Serving", value: "FastAPI service" },
    ],
    href: null,
    linkNote: "Source not published yet. Available on request.",
    accent: "accent",
  },
  {
    id: "hr-analytics",
    index: "02",
    title: "HR Data Analysis",
    category: "Exploratory Analysis · Visualisation",
    year: "2026",
    summary:
      "I explored HR datasets to surface attrition and performance signals, then turned them into summary statistics and charts.",
    problem:
      "Attrition and performance signals sit buried in raw HR records, and they're invisible without structured exploration.",
    pipeline: [
      "HR dataset",
      "Cleaning",
      "Exploratory analysis",
      "Visualisation",
      "Decision-ready insight",
    ],
    details: [
      "I ran exploratory data analysis on HR datasets to uncover trends in employee attrition and performance.",
      "I produced visualisations and summary statistics to support data-driven HR decisions.",
    ],
    stack: ["Python", "Pandas", "Matplotlib"],
    spec: [
      { label: "Input", value: "HR records" },
      { label: "Method", value: "Exploratory data analysis" },
      { label: "Signals", value: "Employee attrition · performance" },
      { label: "Output", value: "Visualisations · summary statistics" },
    ],
    href: null,
    linkNote: "Notebook not published yet. Walkthrough on request.",
    accent: "volt",
  },
  {
    id: "invoice-intelligence",
    index: "03",
    title: "Invoice Intelligence ML Project",
    category: "Feature Engineering · Model Comparison",
    year: "2026",
    summary:
      "I analysed vendor invoice data in SQL, then ran a freight-cost regression study with engineered features and three compared models.",
    problem:
      "Vendor freight cost had no comparative model, so invoice and logistics data couldn't inform pricing decisions.",
    pipeline: [
      "SQL invoices",
      "Correlation analysis",
      "Feature engineering",
      "Model comparison",
      "R² · MAE · RMSE",
    ],
    details: [
      "I analysed vendor invoice data from a SQL database, using correlation analysis and visualisations to study how quantity, freight cost and invoice value relate.",
      "I engineered a freight-per-unit feature and compared Linear Regression, Decision Tree and Random Forest models for freight cost prediction using R², MAE and RMSE.",
    ],
    stack: ["Python", "SQL", "Pandas", "Scikit-learn", "Seaborn"],
    spec: [
      { label: "Sources", value: "Vendor invoices · logistics records" },
      { label: "Analysis", value: "Correlation analysis · visualisation" },
      { label: "Feature", value: "Freight per unit, engineered" },
      { label: "Models", value: "Linear Regression · Decision Tree · Random Forest" },
      { label: "Metrics", value: "R² · MAE · RMSE" },
    ],
    href: null,
    linkNote: "Source not published yet. Available on request.",
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
      "I completed a 3-month internship training programme as a Data Science Intern.",
      "I applied Python, Pandas and machine learning to data cleaning and analysis.",
      "I built and evaluated machine learning models on real datasets.",
    ],
  },
  {
    id: "cfc-koshi",
    role: "Operations Lead",
    org: "CFC Koshi",
    period: "2026 to present",
    kind: "leadership",
    points: [
      "I coordinate operations and logistics for a student-led community organisation.",
      "I manage team collaboration, scheduling and event execution.",
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
  "Machine Learning",
  "Generative & Agentic AI",
  "AI for Social Good",
  "Research & Open Source",
  "Data Science",
  "Cybersecurity",
];
