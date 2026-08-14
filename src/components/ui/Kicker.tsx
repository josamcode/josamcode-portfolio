"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/variants";

/** Small uppercase label with a rule that draws itself in. */
export function Kicker({
  children,
  className,
  withRule = true,
  tone = "accent",
}: {
  children: React.ReactNode;
  className?: string;
  withRule?: boolean;
  tone?: "accent" | "dim";
}) {
  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {withRule ? (
        <motion.span
          aria-hidden="true"
          className={cn("block h-px w-7 origin-left rtl:origin-right", tone === "accent" ? "bg-accent" : "bg-line-5")}
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
          }}
        />
      ) : null}
      <motion.span
        className={cn(
          "label text-[11px] sm:text-[11.5px] rtl:text-[13px]",
          tone === "accent" ? "text-accent" : "text-dim",
        )}
        variants={{
          hidden: { opacity: 0, y: 8 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
