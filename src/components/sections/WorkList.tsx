"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { Project } from "@/content/types";
import type { Dictionary } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { ProjectMock } from "@/components/ui/MockScreen";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/**
 * The work index. Rows reveal on scroll; hovering one floats a live preview
 * of that product's interface alongside the cursor.
 */
export function WorkList({
  locale,
  dict,
  projects,
  showPreview = true,
}: {
  locale: Locale;
  dict: Dictionary;
  projects: Project[];
  showPreview?: boolean;
}) {
  const isAr = locale === "ar";
  const reduced = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 260, damping: 30, mass: 0.5 });
  const py = useSpring(y, { stiffness: 260, damping: 30, mass: 0.5 });

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current || reduced) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <div ref={containerRef} className="relative" onMouseMove={handleMove}>
      {projects.map((project, i) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
        >
          <Link
            href={href(locale, `/work/${project.slug}`)}
            data-cursor-state="view"
            onMouseEnter={() => setHovered(project.slug)}
            onMouseLeave={() => setHovered(null)}
            className="group relative grid gap-6 border-b border-line-3 py-9 transition-colors duration-500 hover:bg-hover lg:grid-cols-[0.42fr_0.58fr] lg:gap-14 lg:py-11"
          >
            {/* Wash that wipes in from the reading edge */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-full origin-left scale-x-0 bg-linear-to-r from-accent-soft to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100 ltr:left-0 rtl:right-0 rtl:origin-right"
            />

            <div className="relative z-10 flex items-start gap-5 lg:block">
              <span
                className={cn(
                  "mono text-[11.5px] tracking-[0.16em] text-accent transition-transform duration-500",
                  "group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
                )}
              >
                {project.index}
              </span>
              <div className="lg:mt-4">
                <h3
                  className={cn(
                    "text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-txt transition-colors duration-300 group-hover:text-accent lg:text-[31px]",
                    isAr && "font-normal",
                  )}
                >
                  {project.title}
                </h3>
                <p className={cn("mt-2.5 text-dim", isAr ? "text-[13px]" : "mono text-[12px] tracking-[0.06em]")}>
                  {project.meta}
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <p
                className={cn(
                  "text-pretty text-body-2",
                  isAr ? "text-[16px] leading-[1.85] font-light" : "text-[17px] leading-[1.66]",
                )}
              >
                {project.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "border border-line-4 px-3 py-1.5 text-muted-2 transition-colors duration-300 group-hover:border-line-5",
                      isAr ? "text-[12px]" : "mono text-[11px] tracking-[0.06em]",
                    )}
                  >
                    <bdi>{tag}</bdi>
                  </span>
                ))}
                <span
                  className={cn(
                    "inline-flex items-center gap-2 border border-accent-line bg-accent-soft px-3 py-1.5 text-accent",
                    isAr ? "text-[12px]" : "mono text-[11px] tracking-[0.06em]",
                  )}
                >
                  {dict.work.readCase}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      {/* Cursor-following preview */}
      {showPreview && !reduced ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
          style={{ x: px, y: py }}
        >
          <AnimatePresence>
            {hovered ? (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="aspect-16/10 w-[440px] -translate-x-1/2 -translate-y-1/2 shadow-[var(--shadow-lift)]"
              >
                <ProjectMock slug={hovered} variant="a" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}
