import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { SplitWords } from "@/components/motion/SplitText";
import { ContactForm } from "./ContactForm";
import { cn } from "@/lib/utils";

export function Contact({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";

  return (
    <section id="contact" className="relative z-10 scroll-mt-24 py-20 lg:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-18">
        <div>
          <Kicker>{dict.contact.kicker}</Kicker>
          <h2
            className={cn(
              "mt-5 text-balance text-txt",
              isAr
                ? "font-ar-display text-[clamp(2.8rem,6vw,4.6rem)]"
                : "font-display text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.025em]",
            )}
          >
            <SplitWords text={dict.contact.heading} />
          </h2>

          <Reveal delay={0.08}>
            <p
              className={cn(
                "mt-5 max-w-[48ch] text-pretty text-muted",
                isAr ? "text-[15.5px] leading-[1.85] font-light" : "text-[16.5px] leading-[1.66]",
              )}
            >
              {dict.contact.paragraph}
            </p>

            <div className="mt-8 grid gap-4 border-t border-line-3 pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-[11px] text-dim rtl:text-[13px]">
                  {dict.contact.emailLabel}
                </span>
                <a
                  href={`mailto:${site.person.email}`}
                  dir="ltr"
                  className="mono link-wipe text-[13px] tracking-[0.04em] text-accent"
                >
                  {site.person.email}
                </a>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-[11px] text-dim rtl:text-[13px]">
                  {dict.contact.phoneLabel}
                </span>
                <a
                  href={`tel:${site.person.phone}`}
                  dir="ltr"
                  className="mono link-wipe text-[13px] tracking-[0.04em] text-txt-2"
                >
                  {site.person.phoneDisplay}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <ContactForm locale={locale} dict={dict} />
      </div>
    </section>
  );
}
