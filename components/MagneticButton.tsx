"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, useStillMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const BASE =
  "group relative inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] transition-[color,background-color,border-color,box-shadow] duration-500 sm:px-8 sm:py-4";

/**
 * Buttons are the vocabulary of the world, so they are rebuilt in it: a solid
 * ink pill that answers in the accent on hover, and a hairline outline that
 * does the same. No gradient fill, no sheen.
 */
const VARIANTS: Record<Variant, string> = {
  // Ink and paper reversed: a solid platinum pill that turns ice blue under the
  // pointer. Near-black on either fill clears AA comfortably, which soft white
  // on the blue would not.
  primary:
    "bg-bright text-void hover:bg-accent hover:shadow-[0_0_48px_-18px_rgba(139,233,253,0.55)]",
  secondary:
    "text-bright border border-bright/15 hover:border-accent hover:bg-accent/[0.07] hover:text-accent",
  ghost: "text-muted hover:text-bright px-0 py-0 rounded-none tracking-[0.18em]",
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
