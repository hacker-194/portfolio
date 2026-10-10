import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Spectral } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { CursorCompanion } from "@/components/CursorCompanion";
import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PROFILE, SITE_URL } from "@/lib/site";

// Display face: a warm editorial serif, and it carries the headings.
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spectral",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  // Matches the page ground in `globals.css`, so the browser chrome on mobile
  // continues the page rather than framing it in white.
  themeColor: "#04060c",
  colorScheme: "dark",
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
      className={`${spectral.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="relative min-h-screen bg-void font-sans text-bright antialiased">
        <script
          type="application/ld+json"
          // Structured data describing the person behind the portfolio.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />

        <SmoothScroll />
        <CursorCompanion />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
