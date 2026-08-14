import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/content";
import { getProject, projectSlugs } from "@/content/projects";
import { buildMetadata, graph, breadcrumbSchema, caseStudySchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { CaseStudy } from "@/components/sections/CaseStudy";

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const project = getProject(raw, slug);
  if (!project) return {};
  const dict = getDictionary(raw);

  return buildMetadata({
    locale: raw,
    path: `/work/${slug}`,
    title: project.seo.title,
    description: project.seo.description,
    keywords: project.stack,
    type: "article",
    // Project names are Latin in both locales, which is what the card needs.
    ogTitle: project.title,
    ogKicker: dict.meta.card.kicker,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const project = getProject(locale, slug);
  if (!project) notFound();

  const dict = getDictionary(locale);
  const nextProject = project.next.slug ? getProject(locale, project.next.slug) ?? null : null;

  const structuredData = graph([
    breadcrumbSchema(locale, [
      { name: dict.nav.home, path: "/" },
      { name: dict.nav.allWork, path: "/work" },
      { name: project.title, path: `/work/${slug}` },
    ]),
    caseStudySchema(locale, project),
  ]);

  return (
    <>
      <JsonLd data={structuredData} />
      <CaseStudy locale={locale} dict={dict} project={project} nextProject={nextProject} />
    </>
  );
}
