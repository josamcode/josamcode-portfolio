"use client";

import { type ElementType, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { revealVariants, type RevealDirection } from "./variants";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Direction the element travels in from. */
  direction?: RevealDirection;
  distance?: number;
  delay?: number;
  once?: boolean;
  /** Viewport margin — negative bottom values delay the trigger. */
  amount?: number;
  as?: ElementType;
};

/**
 * Scroll-triggered reveal. Everything on the site that enters the viewport
 * goes through this so timing and easing stay consistent.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  distance = 26,
  delay = 0,
  once = true,
  amount = 0.2,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      variants={revealVariants(direction, distance, reduced)}
      transition={{ delay }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered container: children with `RevealItem` animate in sequence. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
  amount = 0.15,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  as?: ElementType;
}) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -6% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
  distance = 22,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion() ?? false;
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag className={cn(className)} variants={revealVariants(direction, distance, reduced)}>
      {children}
    </MotionTag>
  );
}
