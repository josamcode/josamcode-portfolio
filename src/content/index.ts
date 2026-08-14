import type { Locale } from "@/lib/i18n";
import { en, type Dictionary } from "./en";
import { ar } from "./ar";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
