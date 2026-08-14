"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion, motion } from "motion/react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Counts a metric up when it scrolls into view. Non-numeric values
 * (like "Live" or "RTL") are rendered as-is with a fade.
 */
export function Counter({
  value,
  count,
  prefix = "",
  suffix = "",
  locale,
  className,
  duration = 1.6,
}: {
  value: string;
  count?: number;
  prefix?: string;
  suffix?: string;
  locale: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion() ?? false;

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const [counted, setCounted] = useState(`${prefix}0${suffix}`);

  // Non-numeric metrics ("Live", "RTL") and reduced motion skip the count-up.
  const animates = count != null && !reduced;
  const display = animates ? counted : value;

  useEffect(() => {
    if (!animates || !inView) return;
    motionValue.set(count);
  }, [animates, inView, count, motionValue]);

  useEffect(() => {
    if (!animates) return;
    return spring.on("change", (latest) => {
      setCounted(`${prefix}${formatNumber(Math.round(latest), locale)}${suffix}`);
    });
  }, [animates, spring, locale, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      className={cn("tabular-nums", className)}
      dir="ltr"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      {display}
    </motion.span>
  );
}
