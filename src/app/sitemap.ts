import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { locales, href, languageAlternates } from "@/lib/i18n";
import { projectSlugs } from "@/content/projects";

const paths: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/work", priority: 0.9, changeFrequency: "monthly" },
  ...projectSlugs.map((slug) => ({
    path: `/work/${slug}`,
    priority: 0.8,
    changeFrequency: "yearly" as const,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    paths.map(({ path, priority, changeFrequency }) => ({
      url: `${siteUrl}${href(locale, path)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: languageAlternates(path, siteUrl) },
    })),
  );
}
