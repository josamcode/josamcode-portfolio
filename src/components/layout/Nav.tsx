"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { href, stripLocale, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitch } from "./LanguageSwitch";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { EASE } from "@/components/motion/variants";

const SECTIONS = ["work", "services", "about", "teaching"] as const;

export function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() ?? "/";
  const relative = stripLocale(pathname);
  const onHome = relative === "/";

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Reset-on-navigation, done during render rather than in an effect.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // The indicator only means anything on the single-page home route.
  const active = onHome ? section : null;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 12);
    if (menuOpen) return;
    setHidden(latest > previous && latest > 220);
  });

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Scroll spy for the section indicator on the home page.
  useEffect(() => {
    if (!onHome) return;

    const nodes = SECTIONS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => Boolean(node),
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setSection(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [onHome, pathname]);

  const linkFor = (id: string) => (onHome ? `#${id}` : `${href(locale)}#${id}`);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-[70] border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-line-2 bg-[var(--nav)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <nav className="shell flex items-center justify-between gap-6 py-3.5 lg:py-4">
          <Magnetic strength={0.2}>
            <Link
              href={href(locale)}
              className="group font-display text-[19px] font-semibold tracking-tight text-txt lg:text-[21px]"
              aria-label={dict.nav.home}
            >
              <span className="inline-flex items-center">
                Jo Sam Code
                <motion.span
                  className="text-accent"
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  .
                </motion.span>
              </span>
            </Link>
          </Magnetic>

          <div className="flex items-center gap-5 lg:gap-7">
            <div className="hidden items-center gap-6 lg:flex">
              {SECTIONS.map((id) => (
                <Link
                  key={id}
                  href={linkFor(id)}
                  className={cn(
                    "label-plain relative py-1 text-[12px] transition-colors duration-300 rtl:text-[14px]",
                    active === id ? "text-txt" : "text-muted-2 hover:text-txt",
                  )}
                >
                  {dict.nav[id]}
                  {active === id ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-0 -bottom-0.5 h-px bg-accent"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                </Link>
              ))}
              <Link
                href={href(locale, "/work")}
                className={cn(
                  "mono relative py-1 text-[12px] tracking-[0.08em] transition-colors duration-300",
                  relative.startsWith("/work") ? "text-txt" : "text-muted-2 hover:text-txt",
                )}
              >
                {dict.nav.allWork}
              </Link>
            </div>

            <ThemeToggle labels={dict.theme} className="hidden sm:inline-flex" />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={dict.nav.openMenu}
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center border border-line-4 transition-colors duration-300 hover:border-accent lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-4 bg-txt" />
                <span className="block h-px w-4 bg-txt" />
              </span>
            </button>

            <div className="hidden items-center gap-4 border-line-4 ps-5 lg:flex lg:border-s">
              <LanguageSwitch locale={locale} label={dict.lang.switchTo} ariaLabel={dict.lang.switchAria} />
              <ButtonLink href={href(locale, "/#contact")} size="sm" variant="primary">
                {dict.nav.cta}
              </ButtonLink>
            </div>
          </div>
        </nav>
      </motion.header>

      <MobileSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        dict={dict}
        linkFor={linkFor}
      />
    </>
  );
}

function MobileSheet({
  open,
  onClose,
  locale,
  dict,
  linkFor,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
  linkFor: (id: string) => string;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const items = [
    ...SECTIONS.map((id) => ({ label: dict.nav[id], href: linkFor(id) })),
    { label: dict.nav.allWork, href: href(locale, "/work") },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[95] flex flex-col bg-bg lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: EASE }}
          role="dialog"
          aria-modal="true"
        >
          <div className="shell flex items-center justify-between py-3.5">
            <span className="font-display text-[19px] font-semibold text-txt">
              Jo Sam Code<span className="text-accent">.</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={dict.nav.closeMenu}
              className="grid h-10 w-10 place-items-center border border-line-4 text-xl leading-none text-txt transition-colors hover:border-accent hover:text-accent"
            >
              ×
            </button>
          </div>

          <motion.div
            className="shell mt-8 flex flex-1 flex-col"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } } }}
          >
            <ul className="border-y border-line-2">
              {items.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                  }}
                  className="border-b border-line-2 last:border-b-0"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-[62px] items-center justify-between text-2xl text-txt transition-colors hover:text-accent"
                  >
                    {item.label}
                    <span className="mono text-sm text-dim rtl:rotate-180">→</span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8 flex items-center justify-between gap-4"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
              }}
            >
              <LanguageSwitch
                locale={locale}
                label={dict.lang.switchTo}
                ariaLabel={dict.lang.switchAria}
                className="text-base"
              />
              <ThemeToggle labels={dict.theme} />
            </motion.div>

            <motion.div
              className="mb-8 mt-auto"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
              }}
            >
              <ButtonLink
                href={href(locale, "/#contact")}
                size="lg"
                className="w-full"
                magnetic={false}
                onClick={onClose}
              >
                {dict.nav.cta}
                <span className="rtl:rotate-180">→</span>
              </ButtonLink>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
