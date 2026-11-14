import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Static Content-Security-Policy.
 * Inline scripts allowed via 'unsafe-inline' since JSON-LD schemas are static.
 * Nonce removed to enable full static rendering.
 */
const CSP_HEADER = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "script-src 'self' 'unsafe-inline'",
  ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
  "frame-src 'self' https://tally.so",
  "connect-src 'self' https://api.tally.so https://tally.so",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", CSP_HEADER);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};