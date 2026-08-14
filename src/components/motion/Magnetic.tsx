"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Pulls its child toward the cursor while hovered, then springs back.
 * Disabled for touch pointers and when reduced motion is requested.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  radius = 120,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion() ?? false;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  function handleMove(event: React.MouseEvent<HTMLSpanElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(relX, relY);
    const falloff = Math.max(0, 1 - distance / (radius + rect.width / 2));
    x.set(relX * strength * falloff);
    y.set(relY * strength * falloff);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.span>
  );
}
