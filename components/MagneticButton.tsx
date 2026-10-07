"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, useStillMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const BASE =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 sm:px-8 sm:py-4";

/**
 * Tailwind reads these class names as plain text while scanning the source, so
 * the arbitrary shadow values stay written out in full. Composing them from
 * `lib/palette` would produce a class name the scanner never sees, and the
 * utility would silently disappear from the stylesheet.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "text-[#1a0c00] shadow-[0_18px_50px_-22px_rgba(253,124,2,0.85)] hover:shadow-[0_22px_65px_-20px_rgba(253,124,2,0.95)]",
  secondary:
    "text-bone glass-panel border hairline hover:border-ember/50 hover:text-white",
  ghost:
    "text-ash hover:text-bone px-0 py-0 rounded-none tracking-[0.2em]",
};

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  strength?: number;
  ariaLabel?: string;
  disabled?: boolean;
};

export function MagneticButton({
  children,
  href,
  onClick,
  icon,
  variant = "primary",
  external = false,
  className,
  strength = 0.26,
  ariaLabel,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const finePointer = useFinePointer();
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const magnetic = finePointer && !reduce && !disabled;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 240, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 240, damping: 20, mass: 0.5 });

  const handleMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    rawX.set(dx * strength);
    rawY.set(dy * strength);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const content = (
    <>
      {variant === "primary" ? (
        <>
          <span className="ember-gradient absolute inset-0" aria-hidden />
          <span
            className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/35 blur-md transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[420%]"
            aria-hidden
          />
        </>
      ) : null}
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon ? (
          <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
            {icon}
          </span>
        ) : null}
      </span>
    </>
  );

  const shared = {
    ref: (node: HTMLElement | null) => {
      ref.current = node;
    },
    className: cn(BASE, VARIANTS[variant], disabled && "pointer-events-none opacity-40", className),
    style: { x, y },
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    onPointerEnter: handleMove,
    "data-magnetic": "",
  };

  if (href) {
    return (
      <motion.a
        {...shared}
        href={href}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...shared}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {content}
    </motion.button>
  );
}
