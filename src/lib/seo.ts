import type { Metadata } from "next";
import { site, siteUrl, sameAs } from "./site";
import { href, languageAlternates, localeMeta, type Locale } from "./i18n";
import type { Project } from "@/content/types";

type BuildArgs = {
  locale: Locale;
  /** Locale-less path, e.g. "/work/raeetna" */
  path: string;
  title: string;
  description: string;
  keywords?: readonly string[];
  /** Set true on pages that should not be indexed. */
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  /** Short headline for the social card; falls back to the page title. */
  ogTitle?: string;
  /** Small label above the headline on the social card. */
  ogKicker?: string;
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  noIndex,
  type = "website",
  publishedTime,
  ogTitle,
  ogKicker,
}: BuildArgs): Metadata {
  const canonical = `${siteUrl}${href(locale, path)}`;

  // The card renderer has no Arabic shaping, so social cards always carry
  // Latin copy — callers pass `ogTitle` for Arabic pages.
  const ogParams = new URLSearchParams({ l: locale, t: ogTitle ?? title });
  if (ogKicker) ogParams.set("k", ogKicker);
  const ogImage = `${siteUrl}/api/og?${ogParams.toString()}`;

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: {
      canonical,
      languages: languageAlternates(path, siteUrl),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      url: canonical,
      title,
      description,
      siteName: site.name,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locale === "en" ? [localeMeta.ar.ogLocale] : [localeMeta.en.ogLocale],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: `@${site.person.handle}`,
    },
  };
}

/* ------------------------------------------------------------------ *
 * JSON-LD
 * ------------------------------------------------------------------ */

export function personSchema(locale: Locale) {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: locale === "ar" ? site.person.nameAr : site.person.name,
    alternateName: locale === "ar" ? site.person.name : site.person.nameAr,
    url: `${siteUrl}${href(locale)}`,
    image: `${siteUrl}/portrait.webp`,
    jobTitle: locale === "ar" ? site.person.jobTitleAr : site.person.jobTitle,
    email: `mailto:${site.person.email}`,
    telephone: site.person.phone,
    knowsLanguage: ["ar", "en"],
    address: {
      "@type": "PostalAddress",
      addressCountry: site.person.location.country,
      addressLocality: site.person.location.city,
    },
    sameAs,
    knowsAbout: [
      "Double-entry accounting systems",
      "Multi-tenant SaaS architecture",
      "Arabic-first and RTL product design",
      "Database performance optimisation",
      "Disaster recovery and backups",
      "Node.js",
      "React",
      "Next.js",
      "MongoDB",
    ],
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}${href(locale)}`,
    name: site.name,
    inLanguage: localeMeta[locale].htmlLang,
    publisher: { "@id": `${siteUrl}/#person` },
  };
}

export function professionalServiceSchema(locale: Locale, description: string) {
  return {
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#service`,
    name: site.name,
    description,
    url: `${siteUrl}${href(locale)}`,
    image: `${siteUrl}/portrait.webp`,
    founder: { "@id": `${siteUrl}/#person` },
    areaServed: ["EG", "SA", "AE", "KW", "QA", "BH", "OM", "JO"],
    availableLanguage: ["ar", "en"],
    email: `mailto:${site.person.email}`,
    telephone: site.person.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: site.person.location.country,
      addressLocality: site.person.location.city,
    },
    sameAs,
    knowsAbout: [
      "Accounting software",
      "Multi-tenant SaaS",
      "Arabic-first products",
      "Performance engineering",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "ar" ? "الخدمات" : "Services",
      itemListElement: [
        "Business & accounting systems",
        "Multi-tenant SaaS platforms",
        "Arabic-first & RTL products",
        "Performance & recovery engineering",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };
}

export function breadcrumbSchema(
  locale: Locale,
  crumbs: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl}${href(locale, crumb.path)}`,
    })),
  };
}

export function caseStudySchema(locale: Locale, project: Project) {
  return {
    "@type": "CreativeWork",
    "@id": `${siteUrl}${href(locale, `/work/${project.slug}`)}#case`,
    name: project.title,
    headline: project.seo.title,
    description: project.seo.description,
    url: `${siteUrl}${href(locale, `/work/${project.slug}`)}`,
    inLanguage: localeMeta[locale].htmlLang,
    dateCreated: project.year,
    creator: { "@id": `${siteUrl}/#person` },
    author: { "@id": `${siteUrl}/#person` },
    keywords: project.stack.join(", "),
    about: project.category,
  };
}

export function itemListSchema(
  locale: Locale,
  projects: Project[],
  name: string,
) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: project.title,
      url: `${siteUrl}${href(locale, `/work/${project.slug}`)}`,
    })),
  };
}

/** Wraps any set of nodes in a single @graph document. */
export function graph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
