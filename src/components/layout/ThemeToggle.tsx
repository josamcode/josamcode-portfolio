"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useIsHydrated } from "@/hooks/useIsHydrated";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  labels,
  compact = false,
  className,
}: {
  labels: { light: string; dark: string; toggle: string };
  compact?: boolean;
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useIsHydrated();

  // Dark is the server-rendered default; the stored preference is only read
  // once hydration is done, so markup matches on the first pass.
  const isDark = hydrated ? resolvedTheme !== "light" : true;
  const nextLabel = isDark ? labels.light : labels.dark;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={labels.toggle}
      title={labels.toggle}
      className={cn(
        "label-plain group relative inline-flex items-center gap-2 border border-line-4 px-3 py-2 text-[11px] text-muted-2 transition-colors duration-300 hover:border-accent hover:text-accent rtl:text-[13px]",
        compact && "h-10 w-10 justify-center px-0 py-0",
        className,
      )}
    >
      <span className="relative grid h-4 w-4 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.32 }}
            className="absolute inset-0 grid place-items-center"
          >
            {isDark ? <Sun className="h-3.5 w-3.5" strokeWidth={1.7} /> : <Moon className="h-3.5 w-3.5" strokeWidth={1.7} />}
          </motion.span>
        </AnimatePresence>
      </span>
      {!compact ? <span suppressHydrationWarning>{nextLabel}</span> : null}
    </button>
  );
}
