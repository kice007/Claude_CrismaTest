import type { Variants } from "motion/react";

// Leaf variants contain NO `transition` key — timing is owned by consumers
// (SectionReveal prop or inline `transition` on motion.div children).
// This prevents Motion's top-level `transition` prop from silently overriding variant values.
//
// Exception: staggerContainer carries `staggerChildren` which Motion reads
// exclusively from the variant's transition key (not from the element's transition prop).

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }, // orchestration only
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1 },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};
