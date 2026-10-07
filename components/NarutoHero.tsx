"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { HERO_IMAGE } from "@/lib/site";
import { useFinePointer, useInViewport, useStillMotion } from "@/lib/hooks";
import { EASE_CINEMATIC } from "@/lib/motion";

/**
 * The hero artwork.
 *
 * Composition notes:
 * - The source is a 9:16 portrait, so on phones it is used full-bleed (the
 *   viewport is already portrait and the subject survives the `object-cover`).
 * - From `md` up it becomes a wide vertical panel bleeding off the top, right
 *   and bottom edges, masked into the page on its left. That keeps the artwork
 *   near its native resolution, preserves the subject, and guarantees the
 *   headline sits on pure darkness rather than on top of the character.
 * - Motion is layered: scroll parallax on the outside, pointer parallax inside,
 *   with the pointer layer disabled for touch devices and reduced motion.
 */
export function NarutoHero({ ready = false }: { ready?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Hydration-safe: stays false on the server AND on the first client render.
  const reduce = useStillMotion();
  const fine = useFinePointer();
  const { inView } = useInViewport(ref, "0px");

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 130]);
  const parallaxScale = useTransform(scrollY, [0, 1000], [1, 1.09]);
  const smoothY = useSpring(parallaxY, {
    stiffness: 90,
    damping: 30,
    mass: 0.6,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 55, damping: 20, mass: 0.9 });
  const y = useSpring(pointerY, { stiffness: 55, damping: 20, mass: 0.9 });

  useEffect(() => {
    if (!fine || reduce || !inView) return;

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      pointerX.set(nx * -20);
      pointerY.set(ny * -14);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine, reduce, inView, pointerX, pointerY]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      aria-hidden={false}
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: smoothY, scale: parallaxScale }}
      >
        {/*
          `animate` must always be defined. With `initial={false}` (the still
          branch) and an `undefined` animate prop, Motion has no target to
          resolve and the server-rendered hidden state sticks.
        */}
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0, scale: 1.16 }}
          animate={{
            opacity: ready ? 1 : 0,
            scale: ready ? 1 : 1.16,
          }}
          transition={{
            duration: reduce ? 0 : 1.6,
            ease: EASE_CINEMATIC,
            delay: reduce ? 0 : 0.05,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={reduce || !fine ? undefined : { x, y }}
          >
            {/* Full-bleed on phones; cinematic right-hand panel from md up. */}
            <div className="hero-image-mask absolute inset-0 md:left-[26%] md:-right-[8%]">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                fetchPriority="high"
                quality={90}
                sizes="(max-width: 767px) 100vw, 82vw"
                placeholder="blur"
                blurDataURL={HERO_IMAGE.blurDataURL}
                className="object-cover object-[50%_30%]"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
