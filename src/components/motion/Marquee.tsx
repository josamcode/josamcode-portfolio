"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

/** Longest frame the drift will integrate — stops tab-restore jumps. */
const MAX_FRAME_MS = 64;

/**
 * Infinite marquee that drifts at a fixed pixel speed and leans into the
 * scroll direction. Speed is measured in px/second against one copy of the
 * content, so it stays the same however many items the list holds.
 */
export function VelocityMarquee({
  items,
  /** Idle drift in pixels per second. */
  speed = 42,
  /** How much a fast scroll may accelerate the drift, as a multiplier. */
  boost = 1.4,
  className,
  itemClassName,
  separator = "◆",
  reverse = false,
}: {
  items: readonly string[];
  speed?: number;
  boost?: number;
  className?: string;
  itemClassName?: string;
  separator?: string;
  reverse?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const copyRef = useRef<HTMLDivElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);

  const x = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // Clamped, so a flick of the wheel nudges the strip rather than launching it.
  const velocityFactor = useTransform(smoothVelocity, [-2500, 0, 2500], [-1, 0, 1], {
    clamp: true,
  });

  // One copy's width defines the wrap distance.
  useEffect(() => {
    const node = copyRef.current;
    if (!node) return;

    const measure = () => setCopyWidth(node.getBoundingClientRect().width);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [items]);

  const baseDirection = reverse ? 1 : -1;
  const directionRef = useRef(baseDirection);

  useAnimationFrame((_t, delta) => {
    if (reduced || !copyWidth) return;

    const factor = velocityFactor.get();
    // Scrolling one way or the other flips which way the strip travels.
    if (factor > 0.02) directionRef.current = baseDirection;
    else if (factor < -0.02) directionRef.current = -baseDirection;

    const seconds = Math.min(delta, MAX_FRAME_MS) / 1000;
    const pixels = speed * (1 + Math.abs(factor) * boost) * seconds;
    x.set(wrap(-copyWidth, 0, x.get() + directionRef.current * pixels));
  });

  const content = (ref?: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className="flex shrink-0 items-center gap-6">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className={cn("flex shrink-0 items-center gap-6", itemClassName)}>
          <span className="whitespace-nowrap">{item}</span>
          <span aria-hidden="true" className="text-accent/60 text-[0.6em]">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("mask-fade-x relative flex overflow-hidden", className)}>
      <motion.div
        className="flex shrink-0 items-center gap-6 will-change-transform"
        style={{ x: reduced ? 0 : x }}
      >
        {content(copyRef)}
        {content()}
        {content()}
        {content()}
      </motion.div>
    </div>
  );
}

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/** A plain CSS marquee for cases where scroll coupling would be noise. */
export function SimpleMarquee({
  children,
  className,
  reverse = false,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={cn("mask-fade-x group relative flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center gap-8 group-hover:[animation-play-state:paused]",
          reverse ? "animate-[marquee-rtl_42s_linear_infinite]" : "animate-[marquee_42s_linear_infinite]",
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
