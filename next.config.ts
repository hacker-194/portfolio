import type { NextConfig } from "next";

// Bundle analyzer - only enable when ANALYZE=true
const withBundleAnalyzer = (() => {
  if (process.env.ANALYZE !== "true") return (config: NextConfig) => config;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@next/bundle-analyzer")({ enabled: true });
})();

/**
 * Response headers for every route.
 * Content-Security-Policy with nonces is handled in middleware.ts to generate
 * a fresh nonce per request for inline JSON-LD scripts and Next.js bootstrap.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No reason to advertise the framework on every response.
  poweredByHeader: false,
  images: {
    // Next 16 defaults `qualities` to [75]. Opt in to the extra levels we use.
    qualities: [60, 75, 90],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default withBundleAnalyzer(nextConfig);
