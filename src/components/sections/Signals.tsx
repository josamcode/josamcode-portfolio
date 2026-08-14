"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { Counter } from "@/components/motion/Counter";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/** The four headline numbers, each with a hairline that draws in behind it. */
export function Signals({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";

  return (
    <section
      className="relative z-10 border-y border-line-2 bg-bg-2"
      aria-label={isAr ? "أرقام" : "Key numbers"}
    >
      <div className="shell grid grid-cols-2 lg:grid-cols-4">
        {dict.signals.map((signal, i) => (
          <motion.div
            key={signal.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
            className={cn(
              "group relative border-line-2 py-8 sm:py-10 lg:py-11",
              // Column rules: 2-up on small screens, 4-up from lg.
              i % 2 === 1 && "border-s ps-5 sm:ps-7",
              i >= 2 && "border-t lg:border-t-0",
              i > 0 ? "lg:border-s lg:ps-8" : "lg:border-s-0 lg:ps-0",
              i < 3 && "lg:pe-8",
            )}
          >
            <div
              className={cn(
                "text-[34px] leading-none tracking-[-0.03em] sm:text-[40px]",
                signal.accent ? "text-accent" : "text-txt",
              )}
            >
              <Counter
                value={signal.value}
                count={signal.count}
                suffix={signal.suffix}
                prefix={signal.prefix}
                locale={locale}
              />
            </div>
            <p
              className={cn(
                "mt-3 max-w-[30ch] text-dim",
                isAr ? "text-[13px] leading-[1.75] font-light" : "mono text-[11.5px] leading-[1.6] tracking-[0.06em]",
              )}
            >
              {signal.label}
            </p>

            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 h-px bg-accent ltr:left-0 rtl:right-0"
              initial={{ width: 0 }}
              whileInView={{ width: "36%" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.08 }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
