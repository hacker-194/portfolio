import type { NextConfig } from "next";

/**
 * Response headers for every route. None of these can break the page: the site
 * ships no third-party scripts, and the one embed (the Tally contact form) is an
 * iframe *into* this site, which `frame-ancestors`-style rules do not touch.
 * A full Content-Security-Policy is left out on purpose, because the inline
 * JSON-LD and the framework's own bootstrap scripts would need a per-request
 * nonce, which would turn every page dynamic.
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

export default nextConfig;
