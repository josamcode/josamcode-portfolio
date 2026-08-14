"use client";

import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating control that appears past the first viewport, with a progress ring. */
export function BackToTop({ label }: { label: string }) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const pathLength = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setVisible(latest > 0.12 && latest < 0.995);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label={label}
          title={label}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="fixed bottom-6 z-[80] grid h-12 w-12 place-items-center rounded-full border border-line-4 bg-bg/80 text-txt backdrop-blur-md transition-colors hover:border-accent hover:text-accent ltr:right-6 rtl:left-6"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              style={{ pathLength }}
            />
          </svg>
          <ArrowUp className="h-4 w-4" strokeWidth={1.6} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
