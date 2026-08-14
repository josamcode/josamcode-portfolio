"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin accent bar pinned to the top of the viewport tracking read progress. */
export function ScrollProgress({ rtl = false }: { rtl?: boolean }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[90] h-[2px] bg-linear-to-r from-accent via-accent-hi to-accent"
      style={{ scaleX, transformOrigin: rtl ? "right" : "left" }}
    />
  );
}
