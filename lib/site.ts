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
 * hiring reader navigates by, and nothing else. GitHub, LinkedIn and the CV
 * live in the hero, the menu and the footer rather than being repeated here.
 *
 * The indices are the sections' real positions in the full running order, so
 * the number shown here matches the one printed in the section heading itself
 * (`ALL_SECTIONS`).
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "#projects", index: "03" },
  { label: "Open Source", href: "#open-source", index: "04" },
  { label: "Research", href: "#research", index: "06" },
  { label: "About", href: "#about", index: "02" },
  { label: "Contact", href: "#contact", index: "09" },
];

/** The full running order, surfaced in the full-screen menu. */
export const ALL_SECTIONS: NavItem[] = [
  { label: "Home", href: "#home", index: "01" },
  { label: "About", href: "#about", index: "02" },
  { label: "Projects", href: "#projects", index: "03" },
  { label: "Open Source", href: "#open-source", index: "04" },
  { label: "Frontier", href: "#frontier", index: "05" },
  { label: "Research", href: "#research", index: "06" },
  { label: "Skills", href: "#skills", index: "07" },
  { label: "Experience", href: "#experience", index: "08" },
  { label: "Contact", href: "#contact", index: "09" },
];

/**
 * Absolute base URL used for canonical, Open Graph, sitemap and robots entries.
 *
 * Set `NEXT_PUBLIC_SITE_URL` to the real deployment origin; the fallback keeps
 * local builds working without inventing a domain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * The contact form's public Tally ID. Empty until one is created, in which
 * case `ContactForm` renders nothing and the section keeps its email buttons.
 */
export const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID ?? "";

export const PROFILE = {
  name: "Khagendra Luitel",
  initials: "KL",
  role: "AI / ML Engineer",
  // The three things this portfolio is hired for, in the order it can prove
  // them. The security certifications and the data-analysis background are real
  // and stay on the page (About, the certifications list, the interests), but
  // they sit under the modelling work rather than beside it: a four-field
  // identity reads as a generalist, which is the one thing an ML engineering
  // application cannot afford to be.
  discipline: "Machine Learning · Deep Learning · Model Serving",
  tagline: "Deep Learning · LLMs · Agentic AI",
  location: "Sunsari, Nepal",
  timezone: "NPT · UTC+5:45",
  availability: "Open to AI/ML engineering roles & research collaboration",
  headline: [
    "I build machine learning",
    "systems end to end, from",
    "messy data to a served API.",
  ],
  statement:
    "I'm an AI/ML engineer and Computer Science student. I take machine learning systems end to end: I clean the messy real datasets, train and compare the models, then ship them behind real APIs.",
  email: "anjalluitel3@gmail.com",
  phone: "+977-9827060306",
  phoneHref: "tel:+9779827060306",
  github: "https://github.com/hacker-194",
  githubHandle: "hacker-194",
  linkedin: "https://www.linkedin.com/in/khagendra-luitel-321560327",
  linkedinHandle: "khagendra-luitel",
  resume: "/khagendra-luitel-cv.pdf",
} as const;
