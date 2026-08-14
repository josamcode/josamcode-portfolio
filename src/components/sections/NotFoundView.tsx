"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { href, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

export function NotFoundView() {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";

  return (
    <section className="relative grid min-h-[78vh] place-items-center overflow-hidden py-24">
      <span aria-hidden="true" className="grid-lines absolute inset-0" />
      <div className="shell relative text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mono text-[clamp(5rem,18vw,12rem)] leading-none tracking-[-0.04em] text-line-5"
        >
          {dict.notFound.code}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          className={cn(
            "mt-4 text-balance text-txt",
            isAr
              ? "font-ar-display text-[clamp(2.4rem,6vw,4rem)]"
              : "font-display text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold tracking-[-0.025em]",
          )}
        >
          {dict.notFound.heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className={cn(
            "mx-auto mt-4 max-w-[44ch] text-pretty text-muted",
            isAr ? "text-[16px] leading-[1.85] font-light" : "text-[17px] leading-[1.62]",
          )}
        >
          {dict.notFound.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
          className="mt-10 flex flex-wrap justify-center gap-3.5"
        >
          <ButtonLink href={href(locale)}>{dict.notFound.cta}</ButtonLink>
          <Link
            href={href(locale, "/work")}
            className="mono inline-flex items-center border border-line-5 px-6 py-3.5 text-[13px] text-txt transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            {dict.notFound.secondary}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
