import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { getProjects } from "@/content/projects";
import { buildMetadata, graph, breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { MaskLines } from "@/components/motion/SplitText";
import { WorkList } from "@/components/sections/WorkList";
import { Contact } from "@/components/sections/Contact";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);

  return buildMetadata({
    locale: raw,
    path: "/work",
    title: dict.meta.work.title,
    description: dict.meta.work.description,
    ogTitle: dict.meta.card.work,
    ogKicker: dict.meta.card.kicker,
  });
}

export default async function WorkIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const dict = getDictionary(locale);
  const projects = getProjects(locale);
  const isAr = locale === "ar";

  const structuredData = graph([
    breadcrumbSchema(locale, [
      { name: dict.nav.home, path: "/" },
      { name: dict.nav.allWork, path: "/work" },
    ]),
    itemListSchema(locale, projects, dict.work.indexHeading),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />

      <header className="relative overflow-hidden pt-32 pb-14 lg:pt-40 lg:pb-20">
        <span aria-hidden="true" className="grid-lines absolute inset-0" />
        <div className="shell relative">
          <Kicker>{dict.work.kicker}</Kicker>
          <h1
            className={cn(
              "mt-6 max-w-[18ch] text-balance text-txt",
              isAr
                ? "font-ar-display text-[clamp(3.2rem,8vw,6rem)]"
                : "font-display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[1.03] tracking-[-0.03em]",
            )}
          >
            <MaskLines lines={[dict.work.indexHeading]} delay={0.12} />
          </h1>
          <Reveal delay={0.25} className="mt-6 max-w-[58ch]">
            <p
              className={cn(
                "text-pretty text-muted",
                isAr ? "text-[17px] leading-[1.85] font-light" : "text-[18px] leading-[1.62]",
              )}
            >
              {dict.work.indexLede}
            </p>
          </Reveal>
          <Reveal delay={0.35} className="mt-8">
            <span className="label text-[11px] text-dim rtl:text-[13px]">
              {dict.work.countLabel.replace("{n}", String(projects.length))}
            </span>
          </Reveal>
        </div>
      </header>

      <section className="relative z-10 pb-20 lg:pb-28">
        <div className="shell border-t border-line-3">
          <WorkList locale={locale} dict={dict} projects={projects} />
        </div>
      </section>

      <Contact locale={locale} dict={dict} />
    </>
  );
}
