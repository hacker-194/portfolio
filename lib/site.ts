/**
 * Single source of truth for identity + contact details.
 * Every value here is taken from Khagendra's CV — nothing invented.
 */

export type NavItem = {
  label: string;
  href: string;
  index: string;
};

/** Primary navigation, exactly as briefed. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home", index: "01" },
  { label: "About", href: "#about", index: "02" },
  { label: "Projects", href: "#projects", index: "03" },
  { label: "Research", href: "#research", index: "04" },
  { label: "Skills", href: "#skills", index: "05" },
  { label: "Contact", href: "#contact", index: "06" },
];

/** The full running order, surfaced in the full-screen menu. */
export const ALL_SECTIONS: NavItem[] = [
  { label: "Home", href: "#home", index: "01" },
  { label: "About", href: "#about", index: "02" },
  { label: "Projects", href: "#projects", index: "03" },
  { label: "Frontier", href: "#frontier", index: "04" },
  { label: "Research", href: "#research", index: "05" },
  { label: "Skills", href: "#skills", index: "06" },
  { label: "Experience", href: "#experience", index: "07" },
  { label: "Contact", href: "#contact", index: "08" },
];

export const PROFILE = {
  name: "Khagendra Luitel",
  initials: "KL",
  role: "AI / ML Engineer",
  discipline: "Artificial Intelligence · Machine Learning · Cybersecurity · Data Science",
  location: "Sunsari, Nepal",
  timezone: "NPT · UTC+5:45",
  availability: "Open to AI/ML internships & research collaboration",
  headline: ["Building intelligent systems,", "exploring deep learning,", "and engineering autonomous AI."],
  statement:
    "Computer Science student specialising in Artificial Intelligence, Machine Learning and Cybersecurity. I build data-driven systems end to end — from cleaning messy real-world datasets to training models and shipping them behind real APIs.",
  email: "anjalluitel3@gmail.com",
  phone: "+977-9827060306",
  phoneHref: "tel:+9779827060306",
  github: "https://github.com/hacker-194",
  githubHandle: "hacker-194",
  linkedin: "https://www.linkedin.com/in/khagendra-luitel-321560327",
  linkedinHandle: "khagendra-luitel",
  resume: "/khagendra-luitel-cv.pdf",
} as const;

export const HERO_IMAGE = {
  src: "/naruto/naruto-portrait.webp",
  width: 1080,
  height: 1920,
  alt: "Illustrated hero artwork in warm orange and gold tones",
  /** Low-quality image placeholder generated from the source file. */
  blurDataURL:
    "data:image/webp;base64,UklGRuQAAABXRUJQVlA4INgAAABwBgCdASoUACQAPu1mq0+ppSOiKqoBMB2JbACxH4T+ABZrCJrU2nEqFBGFZid21SQMacTtVz11j5c4DEAA/PVrb+Winx9zSes8kDeTE4402538lzogiuJ4kr/1201gsPhQr7DvZbJU/8gTyfHaa1iTMv8Uw5sFJZho6vn5hVAktMtkP8x7+OdiodicFZ3Db1CTGz7Id2EU8/VrPJiX15Pjjrq/3Uc6PCdEY/4qtO1+8g/dM+/g2zdwljrP96QrA69KNZ42lIFPQAQA8fKsZsRyZapCsgAAAAA=",
} as const;
