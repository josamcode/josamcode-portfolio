"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Dictionary } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/Button";
import { MaskLines, FadeIn } from "@/components/motion/SplitText";
import { RotatingWords } from "@/components/motion/RotatingWords";
import { EASE } from "@/components/motion/variants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  // Below lg the hero stacks, so opposing parallax would collide the text
  // block with the portrait. Depth is a two-column effect only.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const parallax = isDesktop && !reduced;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  // The fade holds until the hero is well on its way out, so the headline
  // never looks washed out while it is still the thing you are reading.
  const textY = useTransform(smooth, [0, 1], [0, 80]);
  const textOpacity = useTransform(smooth, [0, 0.55, 1], [1, 1, 0]);
  const portraitY = useTransform(smooth, [0, 1], [0, -56]);
  const portraitScale = useTransform(smooth, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pt-28 lg:pt-36"
      aria-labelledby="hero-title"
    >
      <span aria-hidden="true" className="grid-lines absolute inset-0" />

      <div className="shell relative grid items-center gap-14 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-28">
        <motion.div style={parallax ? { y: textY, opacity: textOpacity } : undefined}>
          {/* Eyebrow */}
          <FadeIn delay={0.1} className="mb-7 flex items-center gap-3">
            <motion.span
              aria-hidden="true"
              className="block h-px w-7 bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              style={{ transformOrigin: isAr ? "right" : "left" }}
            />
            <span className="label text-[11px] text-accent sm:text-[11.5px] rtl:text-[13.5px]">
              {dict.hero.eyebrow}
            </span>
          </FadeIn>

          {/* Headline */}
          <h1
            id="hero-title"
            className={cn(
              "text-balance font-semibold text-txt",
              isAr
                ? "font-ar-display text-[clamp(3.2rem,9vw,6.6rem)] leading-[0.94] font-normal"
                : "font-display text-[clamp(2.3rem,5.2vw,4.4rem)] leading-[1.04] tracking-[-0.03em]",
            )}
          >
            <MaskLines
              lines={dict.hero.titleLines}
              delay={0.25}
              stagger={0.1}
              lineClassName={isAr ? "pb-[0.08em]" : undefined}
            />
          </h1>

          {/* Rotating status line */}
          <FadeIn
            delay={0.55}
            className="label-plain mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[12px] text-dim rtl:text-[14px]"
          >
            <span>{dict.hero.rotatingPrefix}</span>
            <RotatingWords words={dict.hero.rotating} />
          </FadeIn>

          <FadeIn
            delay={0.65}
            as="p"
            className={cn(
              "mt-7 max-w-[56ch] text-pretty text-muted",
              isAr ? "text-[17px] leading-[1.85] font-light" : "text-[18px] leading-[1.62]",
            )}
          >
            {dict.hero.paragraph}
          </FadeIn>

          <FadeIn delay={0.78} className="mt-10 flex flex-wrap gap-3.5">
            <ButtonLink href={href(locale, "/#contact")} size="lg" className="max-sm:flex-1">
              {dict.hero.primaryCta}
              <span className="rtl:rotate-180">→</span>
            </ButtonLink>
            <ButtonLink href={href(locale, "/#work")} variant="outline" size="lg" className="max-sm:flex-1">
              {dict.hero.secondaryCta}
            </ButtonLink>
          </FadeIn>
        </motion.div>

        {/* Portrait */}
        <motion.div
          className="relative mx-auto w-full max-w-[420px] lg:max-w-none"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          style={parallax ? { y: portraitY } : undefined}
        >
          <div className="group relative aspect-4/5 w-full overflow-hidden border border-line-3 bg-surface">
            <motion.div
              className="relative h-full w-full"
              style={parallax ? { scale: portraitScale } : undefined}
            >
              <Image
                src="/portrait.webp"
                alt={dict.hero.portraitAlt}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-cover object-top transition-[filter,transform] duration-700 group-hover:scale-[1.03]"
              />
            </motion.div>

            {/* Scanline sweep on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-y-full bg-linear-to-b from-transparent via-accent/25 to-transparent opacity-0 transition-all duration-[1400ms] ease-out group-hover:translate-y-full group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/70 via-transparent to-transparent"
            />
          </div>

          {/* Corner marks */}
          {(
            [
              "-top-px -start-px border-t border-s",
              "-top-px -end-px border-t border-e",
              "-bottom-px -start-px border-b border-s",
              "-bottom-px -end-px border-b border-e",
            ] as const
          ).map((position, i) => (
            <motion.span
              key={position}
              aria-hidden="true"
              className={cn("absolute h-5 w-5 border-accent", position)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.9 + i * 0.08 }}
            />
          ))}

          {/* Availability badge */}
          <motion.div
            className="absolute -bottom-px flex items-center gap-2.5 border border-line-3 bg-bg px-4 py-3 ltr:-start-px rtl:-start-px"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.05 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              {!reduced ? (
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 animate-[pulse-ring_2.6s_ease-out_infinite]" />
              ) : null}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="label text-[11px] text-txt-2 rtl:text-[12.5px]">
              {dict.hero.available}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 hidden flex-col items-center gap-2 lg:flex ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="label text-[9.5px] text-dim-2 rtl:text-[12px]">
          {dict.hero.scroll}
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-line-3">
          <span className="absolute inset-x-0 top-0 h-4 bg-accent animate-[scroll-hint_2.2s_ease-in-out_infinite]" />
        </span>
      </motion.div>
    </section>
  );
}
