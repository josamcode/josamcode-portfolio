"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/content/types";
import type { Dictionary } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/SplitText";
import { Parallax } from "@/components/motion/Parallax";
import { Counter } from "@/components/motion/Counter";
import { ProjectMock } from "@/components/ui/MockScreen";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

export function CaseStudy({
  locale,
  dict,
  project,
  nextProject,
}: {
  locale: Locale;
  dict: Dictionary;
  project: Project;
  nextProject: Project | null;
}) {
  const isAr = locale === "ar";

  return (
    <article>
      {/* ------------------------------ header ------------------------------ */}
      <header className="relative overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-16">
        <span aria-hidden="true" className="grid-lines absolute inset-0" />
        <div className="shell-narrow relative">
          <Reveal direction="none">
            <Link
              href={href(locale, "/work")}
              className="label link-wipe inline-flex items-center gap-2 text-[11.5px] text-muted-2 transition-colors hover:text-accent rtl:text-[13.5px]"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" strokeWidth={1.7} />
              {dict.caseStudy.backToWork}
            </Link>
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="label text-[11.5px] text-accent rtl:text-[13.5px]">
              {project.caseLabel}
            </span>
            <motion.span
              aria-hidden="true"
              className="block h-px w-6 bg-line-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              style={{ transformOrigin: isAr ? "right" : "left" }}
            />
            <span className="label text-[11.5px] text-dim rtl:text-[13px]">{project.category}</span>
          </div>

          <h1
            className={cn(
              "mt-6 text-balance text-txt",
              isAr
                ? "font-ar-display text-[clamp(3.4rem,8vw,6rem)]"
                : "font-display text-[clamp(2.4rem,5vw,4.3rem)] font-semibold leading-[1.03] tracking-[-0.03em]",
            )}
          >
            <MaskLines lines={[project.title]} delay={0.15} />
          </h1>

          <Reveal delay={0.3} className="mt-6 max-w-[62ch]">
            <p
              className={cn(
                "text-pretty text-body-2",
                isAr ? "text-[18px] leading-[1.85] font-light" : "text-[19.5px] leading-[1.6]",
              )}
            >
              {project.lede}
            </p>
          </Reveal>

          <RevealGroup
            className="mt-12 grid grid-cols-2 gap-px border border-line-2 bg-line-2 lg:grid-cols-4"
            stagger={0.07}
          >
            {project.facts.map((fact) => (
              <RevealItem key={fact.label} className="bg-surface px-5 py-5 sm:px-6 sm:py-6">
                <div className="label text-[10.5px] text-dim rtl:text-[12.5px]">{fact.label}</div>
                <div
                  className={cn(
                    "mt-2 text-[15px] sm:text-[16px]",
                    fact.accent ? "text-accent" : "text-txt",
                  )}
                >
                  <bdi>{fact.value}</bdi>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </header>

      {/* ------------------------------- hero -------------------------------- */}
      <div className="shell">
        {/* No scroll-zoom here: the mock is a real layout, so cropping its
            edges would read as a rendering bug rather than an effect. */}
        <Reveal direction="scale" amount={0.1}>
          <div className="relative aspect-4/3 w-full sm:aspect-16/9">
            <ProjectMock slug={project.slug} variant="hero" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-3 flex items-center justify-between gap-4">
          <span className="label text-[10.5px] text-dim-2 rtl:text-[12.5px]">
            {dict.caseStudy.heroCaption}
          </span>
          <span className="mono text-[10.5px] uppercase tracking-[0.16em] text-dim-2" dir="ltr">
            {project.year}
          </span>
        </Reveal>
      </div>

      {/* ------------------------------ content ------------------------------ */}
      <div className="shell-narrow py-20 lg:py-28">
        <div className="grid gap-14 lg:gap-20">
          {project.blocks.map((block, index) => (
            <section key={`${block.type}-${index}`} className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr] lg:gap-14">
              <Reveal>
                <h2
                  className={cn(
                    "text-txt lg:sticky lg:top-28",
                    isAr
                      ? "font-ar-display text-[clamp(2rem,4vw,2.9rem)]"
                      : "font-display text-[24px] font-semibold leading-[1.12] tracking-[-0.02em] lg:text-[27px]",
                  )}
                >
                  {block.heading}
                </h2>
              </Reveal>

              <div>
                {block.type === "prose" ? (
                  <div>
                    {block.paragraphs.map((paragraph, i) => (
                      <Reveal key={i} delay={i * 0.06} direction="blur">
                        <p
                          className={cn(
                            "text-pretty",
                            i === 0 ? "text-body" : "mt-5 text-muted",
                            isAr
                              ? i === 0
                                ? "text-[17.5px] leading-[1.85] font-light"
                                : "text-[16.5px] leading-[1.85] font-light"
                              : i === 0
                                ? "text-[18.5px] leading-[1.68]"
                                : "text-[17px] leading-[1.7]",
                          )}
                        >
                          {paragraph}
                        </p>
                      </Reveal>
                    ))}
                  </div>
                ) : null}

                {block.type === "cards" ? (
                  <RevealGroup className="grid gap-px border border-line-2 bg-line-2" stagger={0.08}>
                    {block.items.map((item) => (
                      <RevealItem key={item.kicker} className="group bg-surface px-6 py-6 sm:px-7 sm:py-7">
                        <div className="label text-[11px] text-accent rtl:text-[13px]">
                          {item.kicker}
                        </div>
                        <p
                          className={cn(
                            "mt-3 text-pretty text-body",
                            isAr ? "text-[15.5px] leading-[1.85] font-light" : "text-[16.5px] leading-[1.6]",
                          )}
                        >
                          {item.body}
                        </p>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                ) : null}

                {block.type === "decisions" ? (
                  <RevealGroup className="grid gap-8" stagger={0.1}>
                    {block.items.map((item) => (
                      <RevealItem
                        key={item.title}
                        className="group relative border-accent-line ps-6 ltr:border-l rtl:border-r"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute top-1.5 h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100 ltr:-left-[3.5px] rtl:-right-[3.5px]"
                        />
                        <h3
                          className={cn(
                            "text-[19px] font-semibold tracking-[-0.015em] text-txt lg:text-[20px]",
                            isAr && "text-[20px]",
                          )}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={cn(
                            "mt-3 text-pretty text-muted",
                            isAr ? "text-[15.5px] leading-[1.85] font-light" : "text-[16.5px] leading-[1.64]",
                          )}
                        >
                          {item.body}
                        </p>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                ) : null}

                {block.type === "metrics" ? (
                  <div>
                    {block.intro ? (
                      <Reveal>
                        <p
                          className={cn(
                            "mb-7 text-pretty text-body",
                            isAr ? "text-[17px] leading-[1.85] font-light" : "text-[18.5px] leading-[1.68]",
                          )}
                        >
                          {block.intro}
                        </p>
                      </Reveal>
                    ) : null}
                    <RevealGroup className="grid gap-px border border-line-2 bg-line-2" stagger={0.09}>
                      {block.rows.map((row) => (
                        <RevealItem
                          key={row.label}
                          className="group flex flex-wrap items-center justify-between gap-3 bg-surface px-6 py-5"
                        >
                          <span className={cn("text-txt-2", isAr ? "text-[15.5px]" : "text-[17px]")}>
                            {row.label}
                          </span>
                          <span className="mono flex items-center gap-3 text-[13.5px]" dir="ltr">
                            <span className="text-dim line-through decoration-line-5">{row.before}</span>
                            <span className="text-dim-2">→</span>
                            <span className="text-accent">{row.after}</span>
                          </span>
                        </RevealItem>
                      ))}
                    </RevealGroup>
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ------------------------------ results ------------------------------ */}
      <section className="shell pb-20 lg:pb-28">
        <RevealGroup
          className="grid grid-cols-2 gap-px border border-line-2 bg-line-2 lg:grid-cols-4"
          stagger={0.08}
        >
          {project.stats.map((stat) => (
            <RevealItem key={stat.label} className="bg-bg px-6 py-8 sm:px-7 sm:py-9">
              <div
                className={cn(
                  "text-[32px] leading-none tracking-[-0.03em] sm:text-[40px]",
                  stat.accent ? "text-accent" : "text-txt",
                )}
              >
                <Counter
                  value={stat.value}
                  count={stat.count}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  locale={locale}
                />
              </div>
              <div
                className={cn(
                  "mt-3 max-w-[24ch] text-dim",
                  isAr ? "text-[13px] leading-[1.75] font-light" : "mono text-[11.5px] leading-[1.6] tracking-[0.06em]",
                )}
              >
                {stat.label}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {project.gallery.map((shot, i) => (
            <Reveal key={shot.alt} delay={i * 0.1} direction="scale">
              <Parallax distance={i === 0 ? 18 : 30}>
                <div className="relative aspect-4/3 w-full" title={shot.alt}>
                  <ProjectMock slug={project.slug} variant={i === 0 ? "a" : "b"} />
                </div>
              </Parallax>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-wrap items-center gap-2.5 border-t border-line-2 pt-8">
            <span className="label text-[10.5px] text-dim rtl:text-[12.5px]">
              {dict.caseStudy.stack}
            </span>
            {project.stack.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "border border-line-4 px-3 py-1.5 text-muted-2 transition-colors duration-300 hover:border-accent hover:text-accent",
                  isAr ? "text-[12.5px]" : "mono text-[11px] tracking-[0.06em]",
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------- next -------------------------------- */}
      <section className="shell pb-24 lg:pb-32">
        <Reveal direction="scale">
          <Link
            href={
              nextProject
                ? href(locale, `/work/${nextProject.slug}`)
                : href(locale, "/#contact")
            }
            data-cursor-state="view"
            className="group relative flex items-center justify-between gap-8 overflow-hidden border border-line-2 bg-surface px-7 py-9 transition-colors duration-500 hover:border-accent sm:px-10 sm:py-11"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-accent-soft transition-transform duration-700 ease-out group-hover:scale-x-100 rtl:origin-right"
            />
            <div className="relative">
              <div className="label text-[11px] text-dim rtl:text-[13px]">{project.next.kicker}</div>
              <div
                className={cn(
                  "mt-3 text-[24px] font-semibold tracking-[-0.02em] text-txt transition-colors duration-300 group-hover:text-accent sm:text-[30px]",
                  isAr && "font-normal",
                )}
              >
                {project.next.title}
              </div>
              <div
                className={cn(
                  "mt-2 text-muted-2",
                  isAr ? "text-[13.5px]" : "mono text-[12px]",
                )}
              >
                {project.next.meta}
              </div>
            </div>
            <span className="relative text-[28px] text-accent transition-transform duration-500 group-hover:translate-x-2 sm:text-[34px] rtl:rotate-180 rtl:group-hover:-translate-x-2">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </article>
  );
}
