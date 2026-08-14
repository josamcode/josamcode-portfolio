"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "./variants";

/** Cycles through a list of phrases with a vertical wipe. */
export function RotatingWords({
  words,
  className,
  interval = 2600,
}: {
  words: readonly string[];
  className?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduced]);

  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      {/* Invisible sizer keeps the layout from jumping between phrases. */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">
        {words.reduce((a, b) => (a.length >= b.length ? a : b), "")}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className="col-start-1 row-start-1 whitespace-nowrap text-accent"
          initial={reduced ? { opacity: 0 } : { y: "100%", opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: "0%", opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Blinking terminal caret. */
export function Caret({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block w-[0.5ch] animate-[blink_1.05s_step-end_infinite] bg-accent", className)}
    >
      &nbsp;
    </span>
  );
}
