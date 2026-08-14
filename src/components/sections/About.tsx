"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitText";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

export function About({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";

  return (
    <section id="about" className="relative z-10 scroll-mt-24 py-20 lg:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-18">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Kicker>{dict.about.kicker}</Kicker>
          <h2
            className={cn(
              "mt-5 text-balance text-txt",
              isAr
                ? "font-ar-display text-[clamp(2.6rem,5.2vw,4rem)]"
                : "font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.025em]",
            )}
          >
            <SplitWords text={dict.about.heading} />
          </h2>

          <dl className="mt-8 border-t border-line-3 pt-6">
            {dict.about.facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
                className={cn(
                  "flex items-baseline justify-between gap-4 border-b border-line-1 py-3 last:border-b-0",
                  isAr ? "text-[13.5px]" : "mono text-[12px] tracking-[0.04em]",
                )}
              >
                <dt className="text-dim">{fact.label}</dt>
                {/* bdi keeps Latin values like @josamcode reading correctly
                    inside an otherwise right-to-left line. */}
                <dd className="text-end text-txt-2">
                  <bdi>{fact.value}</bdi>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>

        <div>
          {dict.about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.06} direction="blur">
              <p
                className={cn(
                  "text-pretty",
                  i === 0 ? "text-txt-2" : "mt-6 text-muted",
                  isAr
                    ? i === 0
                      ? "text-[18px] leading-[1.85] font-light"
                      : "text-[16.5px] leading-[1.85] font-light"
                    : i === 0
                      ? "text-[19px] leading-[1.66]"
                      : "text-[17px] leading-[1.7]",
                )}
              >
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.12} className="mt-9">
            <div className="group relative overflow-hidden border border-line-3 bg-surface p-7 sm:p-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-y-full bg-linear-to-b from-accent-soft to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-y-0"
              />
              <div className="relative">
                <div
                  className={cn(
                    "text-dim",
                    isAr ? "text-[12.5px]" : "mono text-[11px] uppercase tracking-[0.16em]",
                  )}
                >
                  {dict.about.notFitLabel}
                </div>
                <p
                  className={cn(
                    "mt-3 text-pretty text-body-2",
                    isAr ? "text-[15.5px] leading-[1.85] font-light" : "text-[16px] leading-[1.62]",
                  )}
                >
                  {dict.about.notFitBody}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
