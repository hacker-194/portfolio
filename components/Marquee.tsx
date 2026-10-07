"use client";

import { useStillMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  speed?: number;
  reverse?: boolean;
  separator?: string;
};

/** Two identical tracks scrolling in lockstep produce a seamless loop. */
export function Marquee({
  items,
  className,
  speed = 42,
  reverse = false,
  separator = "◆",
}: MarqueeProps) {
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();

  const track = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-8">
          <span className="whitespace-nowrap">{item}</span>
          <span className="text-ember/50 text-[0.7em]" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("mask-fade-edges overflow-hidden", className)} aria-hidden>
      <div
        className={cn("flex w-max", !reduce && "animate-marquee")}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
