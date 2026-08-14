import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { getProjects } from "@/content/projects";
import { buildMetadata, graph, breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";

import { Hero } from "@/components/sections/Hero";
import { Signals } from "@/components/sections/Signals";
import { CapabilityStrip } from "@/components/sections/CapabilityStrip";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Teaching } from "@/components/sections/Teaching";
import { Contact } from "@/components/sections/Contact";

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
    path: "/",
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    keywords: dict.meta.home.keywords,
    type: "profile",
    ogTitle: dict.meta.card.home,
    ogKicker: dict.meta.card.kicker,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const dict = getDictionary(locale);
  const projects = getProjects(locale);

  const structuredData = graph([
    breadcrumbSchema(locale, [{ name: dict.nav.home, path: "/" }]),
    itemListSchema(locale, projects, dict.work.heading),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <Hero locale={locale} dict={dict} />
      <Signals locale={locale} dict={dict} />
      <CapabilityStrip locale={locale} dict={dict} />
      <Work locale={locale} dict={dict} />
      <Services locale={locale} dict={dict} />
      <About locale={locale} dict={dict} />
      <Teaching locale={locale} dict={dict} />
      <Contact locale={locale} dict={dict} />
    </>
  );
}
