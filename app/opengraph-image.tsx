import { ImageResponse } from "next/og";
import { PALETTE, tint } from "@/lib/palette";

export const alt = "Khagendra Luitel — AI / ML Engineer";
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
          // A hotter corner than any surface in the site itself, so the card
          // still reads once it is scaled down to a thumbnail.
          background: `radial-gradient(70% 80% at 78% 20%, #3a1505 0%, ${PALETTE.obsidian} 55%, ${PALETTE.void} 100%)`,
          color: PALETTE.bone,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 999,
              border: `1px solid ${tint("ember", 0.55)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: PALETTE.gold,
            }}
          >
            KL
          </div>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: PALETTE.flare,
            }}
          >
            AI / ML Engineer
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
            Khagendra Luitel
          </div>
          <div style={{ fontSize: 30, color: PALETTE.ash, lineHeight: 1.4 }}>
            Building intelligent systems, exploring deep learning, and
            engineering autonomous AI.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${tint("bone", 0.14)}`,
            paddingTop: 26,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: PALETTE.ash,
          }}
        >
          <span>Machine Learning · Data Science · Cybersecurity</span>
          <span style={{ color: PALETTE.gold }}>Sunsari, Nepal</span>
        </div>
      </div>
    ),
    size,
  );
}
