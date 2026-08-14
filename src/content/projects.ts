import type { Locale } from "@/lib/i18n";
import type { Project } from "./types";
import { projectsEn } from "./projects.en";
import { projectsAr } from "./projects.ar";

const byLocale: Record<Locale, Project[]> = {
  en: projectsEn,
  ar: projectsAr,
};

/** Slugs are locale-independent so the language switcher can stay on the same case study. */
export const projectSlugs = projectsEn.map((p) => p.slug);

export function getProjects(locale: Locale): Project[] {
  return byLocale[locale];
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  return byLocale[locale].find((p) => p.slug === slug);
}

export type { Project };
