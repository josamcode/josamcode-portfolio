"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./variants";

const SESSION_KEY = "josam-intro-seen";
const COUNT_MS = 1100;
const LIFT_MS = 900;

type Phase = "hidden" | "running" | "leaving";

/**
 * First-visit curtain: a counter runs to 100 behind four panels, then the
 * panels lift away in sequence. Shown once per session, and skipped entirely
 * under reduced motion. Timings are explicit so the curtain can never stick.
 */
export function Preloader({ label = "Jo Sam Code" }: { label?: string }) {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("hidden");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || reduced) return;

    document.documentElement.setAttribute("data-intro", "running");
    setPhase("running");

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      const ratio = Math.min(1, (now - start) / COUNT_MS);
      setProgress(Math.round(ratio * 100));
      if (ratio < 1) frame = requestAnimationFrame(tick);
    });

    const lift = setTimeout(() => setPhase("leaving"), COUNT_MS + 120);
    const done = setTimeout(() => {
      setPhase("hidden");
      document.documentElement.removeAttribute("data-intro");
      // Marked complete only once it has actually played, so React's
      // double-invoked effect in development still runs the sequence.
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode — the intro just plays again next time */
      }
    }, COUNT_MS + 120 + LIFT_MS + 260);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(lift);
      clearTimeout(done);
      document.documentElement.removeAttribute("data-intro");
    };
  }, [reduced]);

  if (phase === "hidden") return null;

  const leaving = phase === "leaving";

  return (
    <div className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-full w-full bg-bg-2"
            initial={{ y: "0%" }}
            animate={{ y: leaving ? "-101%" : "0%" }}
            transition={{ duration: LIFT_MS / 1000, ease: EASE, delay: leaving ? i * 0.07 : 0 }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-5"
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <span className="font-display text-2xl font-semibold tracking-tight text-txt">
          {label}
          <span className="text-accent">.</span>
        </span>
        <div className="h-px w-40 overflow-hidden bg-line-3">
          <motion.div
            className="h-full bg-accent"
            animate={{ scaleX: progress / 100 }}
            style={{ transformOrigin: "left" }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
        <span className="mono text-[11px] tabular-nums tracking-[0.2em] text-dim" dir="ltr">
          {String(progress).padStart(3, "0")}
        </span>
      </motion.div>
    </div>
  );
}
