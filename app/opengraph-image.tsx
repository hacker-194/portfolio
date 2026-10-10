import { ImageResponse } from "next/og";
import { PALETTE, tint } from "@/lib/palette";
import { PROFILE } from "@/lib/site";

// The identity strings come from `lib/site.ts` rather than being repeated here,
// so the card a link preview shows cannot drift from the page it points at.
export const alt = `${PROFILE.name}, ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          // The site's own paper ground, held flat so the card reads at
          // thumbnail size the way the page does.
          background: `radial-gradient(80% 90% at 78% 18%, ${PALETTE.ink} 0%, ${PALETTE.void} 70%)`,
          color: PALETTE.bright,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 999,
              border: `1px solid ${tint("accent", 0.55)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: PALETTE.accent,
            }}
          >
            {PROFILE.initials}
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: PALETTE.accent,
            }}
          >
            {PROFILE.role}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -3.5,
              textTransform: "uppercase",
            }}
          >
            {PROFILE.name}
          </div>
          {/* The break is written in rather than left to the renderer, so the
              two lines land where the card was laid out for them. */}
          <div
            style={{
              fontSize: 30,
              color: PALETTE.muted,
              lineHeight: 1.4,
              whiteSpace: "pre-line",
            }}
          >
            {"I train models on messy real data,\nthen ship them behind working APIs."}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${tint("bright", 0.16)}`,
            paddingTop: 26,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: PALETTE.muted,
          }}
        >
          <span>{PROFILE.tagline}</span>
          <span style={{ color: PALETTE.bright }}>{PROFILE.location}</span>
        </div>
      </div>
    ),
    size,
  );
}
