"use client";
import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

interface Props {
  children: React.ReactNode;
  variants: Variants;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Wraps a single element with a whileInView scroll reveal.
 * Fires once (viewport={{ once: true }}), owns all transition timing.
 * useReducedMotion() collapses the animation to instant when OS reduced-motion is on.
 *
 * Use this for individual atoms: badge, headline, paragraph, button row.
 * Do NOT use inside a staggerContainer — use motion.div with variants directly there.
 */
export function SectionReveal({
  children,
  variants,
  delay = 0,
  duration = 0.4,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={
        reducedMotion ? { duration: 0 } : { delay, duration, ease: "easeOut" }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
