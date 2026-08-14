"use client";

import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { VelocityMarquee } from "@/components/motion/Marquee";
import { cn } from "@/lib/utils";

/** Scroll-reactive band of capabilities between the numbers and the work. */
export function CapabilityStrip({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";

  return (
    <section
      aria-label={isAr ? "المجالات" : "Capabilities"}
      className="relative z-10 overflow-hidden border-b border-line-2 bg-bg py-6 lg:py-7"
    >
      <VelocityMarquee
        items={dict.marquee}
        speed={38}
        reverse={isAr}
        itemClassName={cn(
          "text-dim-2",
          isAr ? "text-[15px] font-light" : "mono text-[13px] uppercase tracking-[0.14em]",
        )}
      />
    </section>
  );
}
