"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitText";
import { TiltCard } from "@/components/motion/TiltCard";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

export function Services({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";

  return (
    <section id="services" className="relative z-10 scroll-mt-24 py-20 lg:py-28">
      <div className="shell">
        <div className="max-w-[62ch]">
          <Kicker>{dict.services.kicker}</Kicker>
          <h2
            className={cn(
              "mt-5 text-balance text-txt",
              isAr
                ? "font-ar-display text-[clamp(2.8rem,6vw,4.6rem)]"
                : "font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.025em]",
            )}
          >
            <SplitWords text={dict.services.heading} />
          </h2>
        </div>

        {/* Capability cards — hairline grid, 3D tilt, cursor spotlight */}
        <RevealGroup className="mt-12 grid gap-px border border-line-2 bg-line-2 md:grid-cols-2" stagger={0.09}>
          {dict.services.items.map((item, i) => (
            <RevealItem key={item.title} className="bg-surface">
              <TiltCard intensity={5} className="h-full">
                <div className="group relative h-full p-7 sm:p-9">
                  <div className="mono mb-6 flex items-center justify-between text-[10.5px] tracking-[0.16em] text-dim-2">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <motion.span
                      aria-hidden="true"
                      className="block h-px w-8 bg-line-4 transition-colors duration-500 group-hover:bg-accent"
                    />
                  </div>
                  <h3
                    className={cn(
                      "text-[20px] font-semibold tracking-[-0.015em] text-txt transition-colors duration-300 group-hover:text-accent lg:text-[21px]",
                      isAr && "font-semibold",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3.5 text-pretty text-muted",
                      isAr ? "text-[15.5px] leading-[1.85] font-light" : "text-[16px] leading-[1.62]",
                    )}
                  >
                    {item.body}
                  </p>
                </div>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Process rail */}
        <div className="mt-16 lg:mt-20">
          <Reveal>
            <Kicker tone="dim">{dict.services.processKicker}</Kicker>
          </Reveal>

          <div className="relative mt-8">
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 hidden h-px bg-line-3 lg:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: EASE }}
              style={{ transformOrigin: isAr ? "right" : "left" }}
            />

            <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" stagger={0.1}>
              {dict.services.process.map((step) => (
                <RevealItem key={step.step} className="relative lg:pt-8">
                  <motion.span
                    aria-hidden="true"
                    className="absolute -top-1 hidden h-2 w-2 rounded-full bg-accent lg:block ltr:left-0 rtl:right-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
                  />
                  <div className="mono text-[11px] tracking-[0.16em] text-accent">{step.step}</div>
                  <h3 className={cn("mt-3 text-[18px] font-semibold text-txt", isAr && "text-[19px]")}>
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2.5 max-w-[34ch] text-muted-2",
                      isAr ? "text-[14.5px] leading-[1.8] font-light" : "text-[15px] leading-[1.6]",
                    )}
                  >
                    {step.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
