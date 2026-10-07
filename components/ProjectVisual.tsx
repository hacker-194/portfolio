"use client";

import { motion } from "motion/react";
import { useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC } from "@/lib/motion";
import { PALETTE, radialGlow, tint } from "@/lib/palette";
import { cn } from "@/lib/utils";

/**
 * Schematic artwork for each project.
 *
 * These are deliberately abstract diagrams of the *architecture described in the
 * CV* — request/response flow, exploratory analysis, model comparison. They are
 * not screenshots and they contain no invented numbers or metrics.
 */
type ProjectVisualProps = {
  variant: "api" | "analysis" | "models";
  className?: string;
};

export function ProjectVisual({ variant, className }: ProjectVisualProps) {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  return (
    <div
      className={cn(
        "relative aspect-[16/11] w-full overflow-hidden rounded-2xl",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cocoa/70 via-charcoal to-void" />
      <div className="tech-grid absolute inset-0 opacity-50" aria-hidden />
      <div
        className="animate-sheen pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
        style={{ background: radialGlow("ember", 0.3) }}
        aria-hidden
      />

      <svg
        viewBox="0 0 640 440"
        className="relative h-full w-full"
        role="img"
        aria-label={
          variant === "api"
            ? "Schematic: request flows into a model and a prediction is returned"
            : variant === "analysis"
              ? "Schematic: exploratory analysis surfaces trends and patterns"
              : "Schematic: three regression models compared on the same task"
        }
      >
        <defs>
          <linearGradient id={`pv-line-${variant}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PALETTE.ember} stopOpacity="0.1" />
            <stop offset="45%" stopColor={PALETTE.flare} stopOpacity="0.9" />
            <stop offset="100%" stopColor={PALETTE.gold} stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id={`pv-fill-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.ember} stopOpacity="0.35" />
            <stop offset="100%" stopColor={PALETTE.ember} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`pv-node-${variant}`}>
            <stop offset="0%" stopColor={PALETTE.gold} />
            <stop offset="100%" stopColor={PALETTE.ember} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g
          stroke={tint("bone", 0.09)}
          strokeWidth="1"
          fill="none"
          aria-hidden
        >
          <path d="M0 110 H640 M0 220 H640 M0 330 H640" />
          <path d="M160 0 V440 M320 0 V440 M480 0 V440" />
        </g>

        {variant === "api" ? (
          <g>
            {/* Client */}
            <rect
              x="42"
              y="176"
              width="120"
              height="88"
              rx="10"
              fill={tint("bone", 0.04)}
              stroke="rgba(247,242,236,0.18)"
            />
            <text x="102" y="214" textAnchor="middle" className="fill-mist" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="1.6">
              REQUEST
            </text>
            <text x="102" y="234" textAnchor="middle" fill={tint("ash", 0.9)} fontSize="9" fontFamily="var(--font-mono)">
              POST /predict
            </text>

            {/* Flow */}
            <path
              d="M166 220 H286"
              stroke={`url(#pv-line-${variant})`}
              strokeWidth="2"
              strokeDasharray="8 8"
              style={reduce ? undefined : { animation: "dash-flow 6s linear infinite" }}
            />

            {/* Service */}
            <rect
              x="290"
              y="126"
              width="164"
              height="188"
              rx="12"
              fill={tint("cocoa", 0.66)}
              stroke={tint("ember", 0.35)}
            />
            <text x="372" y="156" textAnchor="middle" fill={PALETTE.flare} fontSize="11" fontFamily="var(--font-mono)" letterSpacing="1.8">
              FASTAPI
            </text>

            {/* Model graph inside the service */}
            <g stroke={tint("flare", 0.55)} strokeWidth="1.4" fill="none">
              <path d="M330 210 L372 186 L414 216" />
              <path d="M330 210 L372 240 L414 216" />
              <path d="M372 186 L372 240" />
            </g>
            {[
              [330, 210],
              [372, 186],
              [414, 216],
              [372, 240],
            ].map(([cx, cy], index) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="5"
                fill={`url(#pv-node-${variant})`}
                style={
                  reduce
                    ? undefined
                    : {
                        animation: `pulse-node ${2.6 + index * 0.34}s ease-in-out infinite`,
                        transformOrigin: `${cx}px ${cy}px`,
                      }
                }
              />
            ))}
            <text x="372" y="286" textAnchor="middle" fill={tint("ash", 0.95)} fontSize="9" fontFamily="var(--font-mono)">
              SCikit-learn estimator
            </text>

            <path
              d="M458 220 H560"
              stroke={`url(#pv-line-${variant})`}
              strokeWidth="2"
              strokeDasharray="8 8"
              style={reduce ? undefined : { animation: "dash-flow 6s linear infinite" }}
            />

            {/* Response */}
            <rect
              x="562"
              y="192"
              width="56"
              height="56"
              rx="10"
              fill={tint("bone", 0.04)}
              stroke="rgba(247,242,236,0.18)"
            />
            <text x="590" y="226" textAnchor="middle" fill={PALETTE.gold} fontSize="18" fontFamily="var(--font-mono)">
              {"{ }"}
            </text>
          </g>
        ) : null}

        {variant === "analysis" ? (
          <g>
            {/* Abstract EDA composition: distribution + trend. No numeric claims. */}
            <rect x="60" y="96" width="240" height="248" rx="10" fill={tint("bone", 0.03)} stroke={tint("bone", 0.12)} />
            {[0.32, 0.55, 0.42, 0.78, 0.63, 0.9, 0.5, 0.7].map((height, index) => (
              <motion.rect
                key={height + index}
                x={82 + index * 26}
                width="14"
                rx="3"
                initial={reduce ? false : { height: 0, y: 320 }}
                whileInView={{ height: height * 200, y: 320 - height * 200 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, delay: 0.06 * index, ease: EASE_CINEMATIC }}
                fill={index % 3 === 0 ? PALETTE.ember : index % 3 === 1 ? PALETTE.flare : tint("bone", 0.28)}
              />
            ))}

            <rect x="344" y="96" width="236" height="248" rx="10" fill={tint("bone", 0.03)} stroke={tint("bone", 0.12)} />
            <g stroke={tint("bone", 0.14)} strokeWidth="1">
              <path d="M376 288 H548 M376 232 H548 M376 176 H548" />
            </g>
            {/* Scatter of abstract observations */}
            {[
              [396, 268], [424, 246], [452, 258], [470, 214], [498, 228],
              [428, 190], [512, 200], [390, 218], [476, 176], [530, 246],
              [410, 246], [456, 210], [520, 172], [404, 288], [488, 262],
            ].map(([cx, cy], index) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={index % 4 === 0 ? 5 : 3.4}
                fill={index % 5 === 0 ? PALETTE.gold : tint("flare", 0.6)}
              />
            ))}
            <path
              d="M386 278 L470 232 L560 168"
              fill="none"
              stroke={`url(#pv-line-${variant})`}
              strokeWidth="2"
              strokeDasharray="7 7"
              style={reduce ? undefined : { animation: "dash-flow 7s linear infinite" }}
            />

            <text x="66" y="382" fill={tint("ash", 0.9)} fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1.6">
              DISTRIBUTION
            </text>
            <text x="350" y="382" fill={tint("ash", 0.9)} fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1.6">
              TREND
            </text>
          </g>
        ) : null}

        {variant === "models" ? (
          <g>
            {/* Three candidate models converging on one task */}
            {[
              { y: 92, label: "LINEAR REG" },
              { y: 196, label: "DECISION TREE" },
              { y: 300, label: "RANDOM FOREST" },
            ].map((lane, index) => (
              <g key={lane.label}>
                <motion.rect
                  x="52"
                  y={lane.y}
                  width="188"
                  height="58"
                  rx="9"
                  fill={tint("cocoa", 0.6)}
                  stroke={index === 2 ? tint("ember", 0.5) : tint("bone", 0.14)}
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: EASE_CINEMATIC }}
                />
                <text
                  x="70"
                  y={lane.y + 35}
                  fill={index === 2 ? PALETTE.gold : tint("mist", 0.85)}
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  letterSpacing="1.4"
                >
                  {lane.label}
                </text>
                <path
                  d={`M240 ${lane.y + 29} H392`}
                  fill="none"
                  stroke={`url(#pv-line-${variant})`}
                  strokeWidth="1.6"
                  strokeDasharray="6 7"
                  style={reduce ? undefined : { animation: `dash-flow ${6 + index}s linear infinite` }}
                />
              </g>
            ))}

            {/* Evaluation panel */}
            <rect x="396" y="92" width="192" height="266" rx="10" fill={tint("bone", 0.03)} stroke={tint("bone", 0.14)} />
            <text x="418" y="124" fill={tint("ash", 0.95)} fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1.6">
              EVALUATION
            </text>
            {["R2", "MAE", "RMSE"].map((metric, index) => (
              <g key={metric}>
                <text x="418" y={170 + index * 46} fill={PALETTE.flare} fontSize="11" fontFamily="var(--font-mono)">
                  {metric}
                </text>
                <rect x="418" y={180 + index * 46} width="148" height="4" rx="2" fill={tint("bone", 0.08)} />
                <motion.rect
                  x="418"
                  y={180 + index * 46}
                  height="4"
                  rx="2"
                  fill={PALETTE.ember}
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: [104, 132, 88][index] }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.14, ease: EASE_CINEMATIC }}
                />
              </g>
            ))}

            {/* Correlation grid */}
            <g transform="translate(418 300)">
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={col * 18}
                    y={row * 14}
                    width="14"
                    height="10"
                    rx="2"
                    fill={tint("ember", 0.1 + ((row * 3 + col * 5) % 7) * 0.055)}
                  />
                )),
              )}
            </g>
          </g>
        ) : null}
      </svg>

      {/* Frame + bottom fade */}
      <div className="hairline pointer-events-none absolute inset-0 rounded-2xl border" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void/85 to-transparent" aria-hidden />
    </div>
  );
}
