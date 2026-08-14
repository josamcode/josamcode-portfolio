"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Moves its child against the scroll direction as it crosses the viewport. */
export function Parallax({
  children,
  className,
  distance = 60,
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });
  const y = useTransform(smooth, [0, 1], [distance, -distance]);
  const s = useTransform(smooth, [0, 0.5, 1], [1.08, 1, 1.08]);

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={reduced ? undefined : { y, ...(scale ? { scale: s } : {}) }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Scales and un-blurs a media block as it enters — used for case-study heroes. */
export function ScrollZoom({
  children,
  className,
  from = 1.14,
  to = 1,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.15"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const smoothScale = useSpring(scale, { stiffness: 110, damping: 26 });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={reduced ? undefined : { scale: smoothScale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Horizontal drift keyed to scroll — subtle depth for decorative rows. */
export function DriftX({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const smooth = useSpring(x, { stiffness: 80, damping: 24 });

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div style={reduced ? undefined : { x: smooth }}>{children}</motion.div>
    </div>
  );
}
