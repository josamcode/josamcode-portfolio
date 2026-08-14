"use client";

import { type ElementType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { charVariants, wordVariants, lineMaskVariants, EASE } from "./variants";
import { cn } from "@/lib/utils";

type Common = {
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: ElementType;
};

/**
 * Word-by-word 3D flip-in. Used for section headings.
 * Words stay inside a single text node per word so Arabic shaping is preserved.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
  as = "span",
  highlight,
}: Common & { text: string; highlight?: string }) {
  const reduced = useReducedMotion() ?? false;
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.span;
  const words = text.split(" ");
  const highlightWords = highlight ? highlight.split(" ") : [];

  if (reduced) {
    return <span className={cn(className)}>{text}</span>;
  }

  return (
    <MotionTag
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.4 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      style={{ perspective: 800 }}
      aria-label={text}
    >
      {words.map((word, i) => {
        const isHighlighted = highlightWords.includes(word);
        return (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom"
            aria-hidden="true"
          >
            <motion.span
              className={cn("inline-block", isHighlighted && "text-accent")}
              variants={wordVariants}
              style={{ transformOrigin: "bottom center" }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}

/**
 * Character-level blur-in. Reserved for short strings (eyebrows, labels) —
 * per-character spans break Arabic shaping, so Arabic falls back to words.
 */
export function SplitChars({
  text,
  className,
  delay = 0,
  stagger = 0.024,
  once = true,
  isArabic = false,
}: Common & { text: string; isArabic?: boolean }) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) return <span className={cn(className)}>{text}</span>;
  if (isArabic) {
    return <SplitWords text={text} className={className} delay={delay} stagger={0.05} once={once} />;
  }

  const chars = Array.from(text);

  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span key={`${char}-${i}`} className="inline-block" variants={charVariants} aria-hidden="true">
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * Line-by-line mask reveal — each line slides up from behind a clipping box.
 * This is the hero treatment.
 */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
  highlightLast = false,
}: Common & {
  lines: readonly string[];
  lineClassName?: string;
  highlightLast?: boolean;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
      }}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="block overflow-hidden" aria-hidden="true">
          <motion.span
            className={cn(
              "block",
              lineClassName,
              highlightLast && i === lines.length - 1 && "text-accent",
            )}
            variants={
              reduced
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                : lineMaskVariants
            }
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Simple fade+rise for a paragraph, driven on mount rather than on scroll. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion() ?? false;
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}
