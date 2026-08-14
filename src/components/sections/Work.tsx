import Link from "next/link";
import type { Dictionary } from "@/content";
import { getProjects } from "@/content/projects";
import { href, type Locale } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitText";
import { WorkList } from "./WorkList";
import { cn } from "@/lib/utils";

export function Work({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";
  const projects = getProjects(locale);

  return (
    <section id="work" className="relative z-10 scroll-mt-24 py-20 lg:py-28">
      <div className="shell">
        <Reveal className="flex flex-col gap-3 border-b border-line-3 pb-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <h2
            className={cn(
              "text-txt",
              isAr
                ? "font-ar-display text-[clamp(2.8rem,6vw,4.6rem)]"
                : "font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.025em]",
            )}
          >
            <SplitWords text={dict.work.heading} />
          </h2>
          <span
            className={cn(
              "text-dim",
              isAr ? "text-[14px]" : "mono text-[11.5px] uppercase tracking-[0.16em]",
            )}
          >
            {dict.work.kicker}
          </span>
        </Reveal>

        <WorkList locale={locale} dict={dict} projects={projects} />

        <Reveal className="mt-10 flex justify-center" delay={0.1}>
          <Link
            href={href(locale, "/work")}
            className={cn(
              "link-wipe inline-flex items-center gap-2 text-accent transition-colors hover:text-accent-hi",
              isAr ? "text-[15px]" : "mono text-[12.5px] uppercase tracking-[0.14em]",
            )}
          >
            {dict.work.viewAll}
            <span className="rtl:rotate-180">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
