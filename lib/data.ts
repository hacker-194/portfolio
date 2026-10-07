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
  /** Bullet points taken verbatim in meaning from the CV. */
  details: string[];
  stack: string[];
  /** Technical highlights that are explicitly stated in the CV. */
  highlights: { label: string; value: string }[];
  href: string | null;
  linkNote?: string;
  accent: "ember" | "flare" | "gold";
};

export const PROJECTS: Project[] = [
  {
    id: "insurance-api",
    index: "01",
    title: "FastAPI Insurance Prediction API",
    category: "ML System · Model Serving",
    year: "2026",
    summary:
      "A REST API that serves an insurance premium prediction model, wiring trained scikit-learn inference directly into live endpoints.",
    details: [
      "Built a REST API to serve an insurance premium prediction model using FastAPI and Scikit-learn.",
      "Integrated ML model inference with API endpoints for real-time predictions.",
    ],
    stack: ["FastAPI", "Scikit-learn", "Python"],
    highlights: [
      { label: "Surface", value: "REST · JSON endpoints" },
      { label: "Inference", value: "Real-time per request" },
      { label: "Model", value: "Scikit-learn estimator" },
    ],
    href: null,
    linkNote: "Repository not published — available on request.",
    accent: "ember",
  },
  {
    id: "hr-analytics",
    index: "02",
    title: "HR Data Analysis",
    category: "Exploratory Analysis · Visualisation",
    year: "2026",
    summary:
      "Exploratory analysis of HR datasets to surface attrition and performance signals, translated into decision-ready statistics and charts.",
    details: [
      "Conducted exploratory data analysis on HR datasets to uncover trends in employee attrition and performance.",
      "Produced visualisations and summary statistics to support data-driven HR decisions.",
    ],
    stack: ["Python", "Pandas", "Matplotlib"],
    highlights: [
      { label: "Focus", value: "Attrition · performance" },
      { label: "Method", value: "EDA · summary statistics" },
      { label: "Output", value: "Charts for HR decisions" },
    ],
    href: null,
    linkNote: "Repository not published — notebook walkthrough on request.",
    accent: "flare",
  },
  {
    id: "invoice-intelligence",
    index: "03",
    title: "Invoice Intelligence ML Project",
    category: "Feature Engineering · Model Comparison",
    year: "2026",
    summary:
      "Vendor invoice analytics over a SQL database, culminating in a freight-cost regression study with engineered features and three compared models.",
    details: [
      "Analysed vendor invoice data from a SQL database, using correlation analysis and visualisations to study how quantity, freight cost and invoice value relate.",
      "Engineered a freight-per-unit feature and compared Linear Regression, Decision Tree and Random Forest models for freight cost prediction using R², MAE and RMSE.",
    ],
    stack: ["Python", "SQL", "Pandas", "Scikit-learn", "Seaborn"],
    highlights: [
      { label: "Feature", value: "freight-per-unit" },
      { label: "Models", value: "Linear Reg · Decision Tree · Random Forest" },
      { label: "Metrics", value: "R² · MAE · RMSE" },
    ],
    href: null,
    linkNote: "Repository not published — available on request.",
    accent: "gold",
  },
];

export type FrontierPillar = {
  label: string;
  note: string;
};

export const FRONTIER_PILLARS: FrontierPillar[] = [
  { label: "Generative AI", note: "Model behaviour, prompting, evaluation" },
  { label: "Agentic AI", note: "Tool use, planning, autonomy loops" },
  { label: "Large Language Models", note: "Architecture & fine-tuning landscape" },
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

/** The 3D neural-network nodes requested for the visualisation. */
export type NetworkNode = {
  id: string;
  label: string;
  detail: string;
  /** Normalised layout position, used to align the 3D scene with HTML labels. */
  x: number;
  y: number;
};

export const NETWORK_NODES: NetworkNode[] = [
  { id: "data", label: "Data", detail: "Raw → clean", x: 0.09, y: 0.62 },
  { id: "model", label: "Model", detail: "Train · evaluate", x: 0.275, y: 0.4 },
  { id: "llm", label: "LLM", detail: "Transformer core", x: 0.455, y: 0.6 },
  { id: "tools", label: "Tools", detail: "Retrieval · APIs", x: 0.635, y: 0.34 },
  { id: "agent", label: "Agent", detail: "Plan · act", x: 0.79, y: 0.58 },
  { id: "output", label: "Output", detail: "Ship · serve", x: 0.94, y: 0.42 },
];

export type ResearchTopic = {
  id: string;
  label: string;
  /** Position within the constellation viewport, in percent. */
  x: number;
  y: number;
  /** Relative size/importance of the node. */
  weight: 0 | 1 | 2;
};

export const RESEARCH_TOPICS: ResearchTopic[] = [
  { id: "deep-learning", label: "Deep Learning", x: 22, y: 24, weight: 2 },
  { id: "transformers", label: "Transformers", x: 52, y: 16, weight: 2 },
  { id: "llms", label: "Large Language Models", x: 78, y: 30, weight: 2 },
  { id: "agentic", label: "Agentic AI", x: 66, y: 58, weight: 1 },
  { id: "vision", label: "Computer Vision", x: 34, y: 62, weight: 1 },
  { id: "security", label: "Cybersecurity", x: 14, y: 52, weight: 1 },
  { id: "social-good", label: "AI for Social Good", x: 48, y: 82, weight: 1 },
  { id: "open-source", label: "Open Source", x: 84, y: 70, weight: 1 },
];

export const CONSTELLATION_LINKS: [string, string][] = [
  ["deep-learning", "transformers"],
  ["transformers", "llms"],
  ["deep-learning", "vision"],
  ["vision", "agentic"],
  ["agentic", "llms"],
  ["security", "deep-learning"],
  ["vision", "social-good"],
  ["agentic", "open-source"],
  ["llms", "open-source"],
  ["security", "social-good"],
  ["transformers", "agentic"],
];

export type ResearchWork = {
  title: string;
  status: string;
  summary: string;
  methods: string[];
  tools: string[];
};

/** From the CV's Research Work section, explicitly marked as ongoing. */
export const RESEARCH_WORK: ResearchWork = {
  title:
    "Early Burnout Detection Using Keystroke Dynamics and Mouse Behaviour",
  status: "Ongoing",
  summary:
    "Explainable machine learning on behavioural biometrics — using typing and pointer patterns as passive signals for early burnout detection.",
  methods: ["Random Forest", "XGBoost", "SVM", "LSTM"],
  tools: ["SHAP", "LIME"],
};

export type SkillGroup = {
  id: string;
  title: string;
  caption: string;
  learning?: boolean;
  skills: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "ai-ml",
    title: "AI / ML",
    caption: "Core modelling toolkit",
    skills: ["PyTorch", "Scikit-learn", "XGBoost", "NumPy", "Pandas"],
  },
  {
    id: "ai-systems",
    title: "AI Systems",
    caption: "Active learning direction",
    learning: true,
    skills: ["Generative AI", "Agentic AI", "LLMs", "RAG"],
  },
  {
    id: "backend",
    title: "Backend",
    caption: "Serving models as products",
    skills: ["FastAPI", "Python", "PostgreSQL"],
  },
  {
    id: "tools",
    title: "Tools",
    caption: "Day-to-day engineering",
    skills: ["Git", "GitHub", "n8n", "Linux"],
  },
];

export type ExperienceItem = {
  id: string;
  role: string;
  org: string;
  period: string;
  kind: "experience" | "leadership";
  points: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "cloud-nepal-web",
    role: "Data Science Intern",
    org: "Cloud Nepal Web",
    period: "May – July 2026 · 3 months",
    kind: "experience",
    points: [
      "Completed a 3-month internship training programme as a Data Science Intern.",
      "Applied Python, Pandas and machine learning to data cleaning and analysis.",
      "Built and evaluated machine learning models on real datasets.",
    ],
  },
  {
    id: "cfc-koshi",
    role: "Operations Lead",
    org: "CFC Koshi",
    period: "2026 – Present",
    kind: "leadership",
    points: [
      "Coordinating operations and logistics for a student-led community organisation.",
      "Managing team collaboration, scheduling and event execution.",
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
  coursework: [
    "Data Analysis & Visualization",
    "Machine Learning",
    "Artificial Intelligence",
    "Probability & Statistics",
    "Data Structures & Algorithms",
    "Research Methodology",
  ],
};

export const INTERESTS = [
  "Machine Learning",
  "Cybersecurity",
  "Data Science",
  "AI for Social Good",
  "Research & Open Source",
  "Generative & Agentic AI",
];
