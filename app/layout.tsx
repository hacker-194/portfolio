import type { Metadata, Viewport } from "next";
import { Cormorant, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScrollSync } from "@/components/ScrollSync";
import { PALETTE } from "@/lib/palette";
import { PROFILE, SITE_URL } from "@/lib/site";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

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
  themeColor: PALETTE.void,
  colorScheme: "light" as const,
};

// Preload critical fonts for faster FCP/LCP
export const fontPreloads = [
  { href: "https://fonts.gstatic.com/s/cormorant/v20/VdGPAYmumtR1gysyAfTD.woff2", as: "font" },
  { href: "https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2", as: "font" },
  { href: "https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2", as: "font" },
] as const;

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
    "PyTorch",
    "FastAPI",
    "RAG",
    "LLMs",
  ],
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: PROFILE.name,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${jetbrains.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/cormorant/v20/VdGPAYmumtR1gysyAfTD.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="relative min-h-screen bg-void font-sans text-bright antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
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
      </body>
    </html>
  );
}
