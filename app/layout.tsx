import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

import { CursorGlow } from "@/components/CursorGlow";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SiteBackground } from "@/components/SiteBackground";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LoadProvider } from "@/lib/load";
import { PROFILE } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Decorative editorial face, used once below the fold — kept off the critical
// preload path and limited to a single style to keep the font payload small.
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

/**
 * Absolute base URL used for canonical + Open Graph tags.
 * Set `NEXT_PUBLIC_SITE_URL` to the real deployment origin; the fallback keeps
 * local builds working without inventing a domain.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "Khagendra Luitel — AI/ML engineer and Computer Science student building data-driven systems end to end: model training, evaluation and serving behind real APIs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Khagendra Luitel — AI / ML Engineer",
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
    title: "Khagendra Luitel — AI / ML Engineer",
    description: DESCRIPTION,
    siteName: PROFILE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Khagendra Luitel — AI / ML Engineer",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050403",
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
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable} ${instrument.variable}`}
    >
      <body className="relative min-h-screen bg-void font-sans text-bone antialiased">
        <script
          type="application/ld+json"
          // Structured data describing the person behind the portfolio.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />

        {/* Behind everything: the animated 3D ember field. */}
        <SiteBackground />

        <LoadProvider>
          <SmoothScroll />
          <ScrollProgress />
          <CursorGlow />
          <Preloader />
          <Navbar />
          {/* Content layer sits explicitly above the background. */}
          <main className="relative z-10">{children}</main>
          <Footer />
        </LoadProvider>

        <div className="grain-overlay" aria-hidden />
        <div className="vignette-overlay" aria-hidden />
      </body>
    </html>
  );
}
