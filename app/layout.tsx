import type { Metadata, Viewport } from "next";
import { Cormorant, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollSync } from "@/components/ScrollSync";
import { PALETTE } from "@/lib/palette";
import { PROFILE, SITE_URL } from "@/lib/site";

// Display face: a high-contrast old-style serif with the poise of a fashion
// masthead, and it carries the headings.
//
// 300 is the weight the large type is set in. A display page reads as designed
// from its scale contrast, and the lightest cut is what carries it at 60px and
// up; the heavier cuts are still here for the small display text (card titles,
// captions) where 300 would be too faint to hold.
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Body: a geometric sans, wide and calm, set against the serif.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

// Kept only for figures and code; the palette keeps it off prose and labels.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const DESCRIPTION =
  "Khagendra Luitel, AI/ML engineer and Computer Science student. I train, evaluate and serve machine learning models behind real APIs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Khagendra Luitel, AI / ML Engineer",
    template: "%s · Khagendra Luitel",
  },
  description: DESCRIPTION,
  keywords: [
    "Khagendra Luitel",
    "AI engineer",
    "machine learning",
    "data science",
    "cybersecurity",
    "PyTorch",
    "FastAPI",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Khagendra Luitel, AI / ML Engineer",
    description: DESCRIPTION,
    siteName: PROFILE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Khagendra Luitel, AI / ML Engineer",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Match the paper ground through the shared palette token.
  themeColor: PALETTE.void,
  colorScheme: "light",
};

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  email: `mailto:${PROFILE.email}`,
  telephone: PROFILE.phone,
  address: { "@type": "PostalAddress", addressLocality: PROFILE.location },
  sameAs: [PROFILE.github, PROFILE.linkedin],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Generative AI",
    "Agentic AI",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${jetbrains.variable}`}
    >
      <body className="relative min-h-screen bg-void font-sans text-bright antialiased">
        <script
          type="application/ld+json"
          // Structured data describing the person behind the portfolio.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[2px] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-void"
        >
          Skip to content
        </a>

        <ScrollSync />
        <Navbar />
        <main id="main" tabIndex={-1} className="relative z-10 outline-none">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
