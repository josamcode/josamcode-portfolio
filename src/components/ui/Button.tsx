"use client";

import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";
import { motion } from "motion/react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "label-tight relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-medium transition-colors duration-300 focus-visible:outline-2";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:text-on-accent",
  outline: "border border-line-5 text-txt hover:border-accent hover:text-accent",
  ghost: "text-muted-2 hover:text-txt",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5 text-[11.5px] rtl:text-[13px]",
  md: "px-6 py-3.5 text-[13px] rtl:text-[14.5px]",
  lg: "px-8 py-4 text-[14px] rtl:text-[15.5px]",
};

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
  icon?: ReactNode;
};

/** Sheen that sweeps across the button on hover. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
    />
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  magnetic = true,
  icon,
  ...rest
}: SharedProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const inner = (
    <Link
      href={href}
      className={cn("group", base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <Sheen />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon}
      </span>
    </Link>
  );

  return magnetic ? <Magnetic>{inner}</Magnetic> : inner;
}

export function ButtonAction({
  children,
  variant = "primary",
  size = "md",
  className,
  magnetic = false,
  icon,
  ...rest
}: SharedProps & ComponentProps<typeof motion.button>) {
  const inner = (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn("group", base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <Sheen />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon}
      </span>
    </motion.button>
  );

  return magnetic ? <Magnetic>{inner}</Magnetic> : inner;
}
