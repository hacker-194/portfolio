/**
 * Single source of truth for identity + contact details.
 * Every value here is taken from Khagendra's CV, nothing invented.
 */

export type NavItem = {
  label: string;
  href: string;
  index: string;
};

/**
 * Primary navigation, deliberately short: the bar carries the five sections a
 * hiring reader navigates by (the work, the experience, the open source record,
 * the person, the way to reach them), and nothing else. GitHub, LinkedIn and the CV
 * live in the hero, the menu and the footer rather than being repeated here.
 *
 * The indices are the sections' real positions in the full running order, so
 * the number shown here matches the one printed in the section heading itself
 * (`ALL_SECTIONS`).
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "#projects", index: "02" },
  { label: "Experience", href: "#experience", index: "03" },
  { label: "Open Source", href: "#open-source", index: "04" },
  { label: "About", href: "#about", index: "05" },
  { label: "Contact", href: "#contact", index: "09" },
];

/**
 * The full running order, surfaced in the full-screen menu and the command
 * palette. It matches the order sections appear in `app/page.tsx`: the work and
 * the evidence for it first, the biography and the study notes after.
 */
export const ALL_SECTIONS: NavItem[] = [
  { label: "Home", href: "#home", index: "01" },
  { label: "Projects", href: "#projects", index: "02" },
  { label: "Experience", href: "#experience", index: "03" },
  { label: "Open Source", href: "#open-source", index: "04" },
  { label: "About", href: "#about", index: "05" },
  { label: "Skills", href: "#skills", index: "06" },
  { label: "Frontier", href: "#frontier", index: "07" },
  { label: "Research", href: "#research", index: "08" },
  { label: "Contact", href: "#contact", index: "09" },
];

/**
 * Absolute base URL used for canonical, Open Graph, sitemap and robots entries.
 *
 * Resolution order: an explicit `NEXT_PUBLIC_SITE_URL`, then the production
 * hostname Vercel injects at build time, then localhost for local work. The
 * middle step means a deploy that forgot the variable still publishes its own
 * address instead of pointing search engines at localhost. Empty strings are
 * treated as unset, and a trailing slash is dropped so joined paths stay clean.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const origin = explicit || (vercel ? `https://${vercel}` : "http://localhost:3000");
  return origin.replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

/**
 * The contact form's public Tally ID. Empty until one is created, in which
 * case `ContactForm` renders nothing and the section keeps its email buttons.
 */
export const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID ?? "";

export const PROFILE = {
  name: "Khagendra Luitel",
  initials: "KL",
  role: "Machine Learning Engineer",
  discipline: "Deep Learning · System Architecture · PyTorch",
  tagline: "Building ML systems that scale into production",
  location: "Sunsari, Nepal",
  timezone: "NPT (UTC+5:45)",
  availability: "Available for ML engineering roles & research",
  headline: [
    "Building machine learning systems",
    "that scale from raw data",
    "to production APIs.",
  ],
  statement:
    "I build machine learning systems designed for production. I work across the full pipeline: engineering dataset features, training and benchmarking model architectures, and deploying reliable inference services with PyTorch and FastAPI.",
  email: "anjalluitel3@gmail.com",
  phone: "+977-9827060306",
  phoneHref: "tel:+9779827060306",
  github: "https://github.com/hacker-194",
  githubHandle: "hacker-194",
  linkedin: "https://www.linkedin.com/in/khagendra-luitel-321560327",
  linkedinHandle: "khagendra-luitel",
  resume: "/khagendra-luitel-cv.pdf",
} as const;
