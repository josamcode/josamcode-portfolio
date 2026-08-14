"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { href, otherLocale, stripLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Swaps the locale segment while staying on the same page, so a visitor
 * reading a case study in English lands on the same case study in Arabic.
 */
export function LanguageSwitch({
  locale,
  label,
  ariaLabel,
  className,
}: {
  locale: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const target = otherLocale(locale);
  const rest = stripLocale(pathname);

  return (
    <Link
      href={href(target, rest)}
      hrefLang={target}
      aria-label={ariaLabel}
      className={cn(
        "label-plain link-wipe text-[12px] text-muted-2 transition-colors duration-300 hover:text-txt rtl:text-[14px]",
        className,
      )}
    >
      {label}
    </Link>
  );
}
