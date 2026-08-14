"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Kicker } from "@/components/ui/Kicker";
import { SplitWords } from "@/components/motion/SplitText";
import { brandIcons, GitHubIcon } from "@/components/ui/BrandIcons";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

const links: Record<string, string> = {
  youtube: site.social.youtube,
  tiktok: site.social.tiktok,
  instagram: site.social.instagram,
  github: site.social.github,
};

export function Teaching({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";

  return (
    <section
      id="teaching"
      className="relative z-10 scroll-mt-24 border-y border-line-2 bg-surface py-20 lg:py-28"
    >
      <div className="shell grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-18">
        <div>
          <Kicker>{dict.teaching.kicker}</Kicker>
          <h2
            className={cn(
              "mt-5 text-balance text-txt",
              isAr
                ? "font-ar-display text-[clamp(2.6rem,5.2vw,4rem)]"
                : "font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.025em]",
            )}
          >
            <SplitWords text={dict.teaching.heading} />
          </h2>
          <p
            className={cn(
              "mt-5 max-w-[46ch] text-pretty text-muted",
              isAr ? "text-[15.5px] leading-[1.85] font-light" : "text-[16.5px] leading-[1.66]",
            )}
          >
            {(() => {
              const [before, after = ""] = dict.teaching.note.split("{handle}");
              return (
                <>
                  {before}
                  <bdi className="text-txt-2">{dict.teaching.handle}</bdi>
                  {after}
                </>
              );
            })()}
          </p>
        </div>

        <div className="grid gap-px border border-line-2 bg-line-2">
          {dict.teaching.channels.map((channel, i) => {
            const Icon = brandIcons[channel.key as keyof typeof brandIcons] ?? GitHubIcon;
            return (
              <motion.a
                key={channel.key}
                href={links[channel.key]}
                target="_blank"
                rel="noopener noreferrer me"
                initial={{ opacity: 0, x: isAr ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="group relative flex items-center justify-between gap-6 overflow-hidden bg-bg px-6 py-6 transition-colors duration-500 hover:bg-hover sm:px-7"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-1 bg-accent transition-transform duration-500 ltr:left-0 ltr:-translate-x-full ltr:group-hover:translate-x-0 rtl:right-0 rtl:translate-x-full rtl:group-hover:translate-x-0"
                />
                <span className="relative flex items-center gap-4">
                  <Icon className="h-4.5 w-4.5 text-dim transition-colors duration-300 group-hover:text-accent" />
                  <span
                    className={cn(
                      "text-txt transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
                      isAr ? "text-[17px]" : "text-[19px] tracking-[-0.01em]",
                    )}
                  >
                    {channel.name}
                  </span>
                </span>
                <span
                  className={cn(
                    "relative hidden items-center gap-2 text-dim sm:flex",
                    isAr ? "text-[13px]" : "mono text-[12px]",
                  )}
                >
                  {channel.body}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
