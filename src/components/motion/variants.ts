import type { Transition, Variants } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_BRAND = [0.2, 0.7, 0.2, 1] as const;

export const spring: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 0.8 };
export const softSpring: Transition = { type: "spring", stiffness: 140, damping: 22, mass: 1 };

export type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "blur" | "none";

export function revealVariants(
  direction: RevealDirection,
  distance: number,
  reduced: boolean,
): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    };
  }

  const offsets: Record<RevealDirection, Record<string, number | string>> = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    scale: { scale: 0.94 },
    blur: { filter: "blur(14px)", y: distance * 0.5 },
    none: {},
  };

  const settled: Record<RevealDirection, Record<string, number | string>> = {
    up: { y: 0 },
    down: { y: 0 },
    left: { x: 0 },
    right: { x: 0 },
    scale: { scale: 1 },
    blur: { filter: "blur(0px)", y: 0 },
    none: {},
  };

  return {
    hidden: { opacity: 0, ...offsets[direction] },
    visible: {
      opacity: 1,
      ...settled[direction],
      transition: { duration: 0.85, ease: EASE },
    },
  };
}

export const staggerParent = (stagger = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.9em", rotateX: -55 },
  visible: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export const charVariants: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE },
  },
};

export const lineMaskVariants: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 1, ease: EASE } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};
