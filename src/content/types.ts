export type ProjectStat = {
  value: string;
  label: string;
  accent?: boolean;
  /** Numeric target for the count-up animation; omit for non-numeric values like "28×". */
  count?: number;
  prefix?: string;
  suffix?: string;
};

export type ProjectFact = { label: string; value: string; accent?: boolean };

export type ProjectBlock =
  | { type: "prose"; heading: string; paragraphs: string[] }
  | { type: "cards"; heading: string; items: { kicker: string; body: string }[] }
  | { type: "decisions"; heading: string; items: { title: string; body: string }[] }
  | {
      type: "metrics";
      heading: string;
      intro?: string;
      rows: { label: string; before: string; after: string }[];
    };

export type Project = {
  slug: string;
  index: string;
  caseLabel: string;
  category: string;
  title: string;
  meta: string;
  summary: string;
  lede: string;
  year: string;
  tags: string[];
  stack: string[];
  facts: ProjectFact[];
  blocks: ProjectBlock[];
  stats: ProjectStat[];
  gallery: { alt: string; hint: string }[];
  heroAlt: string;
  next: { slug: string | null; kicker: string; title: string; meta: string };
  seo: { title: string; description: string };
};

export type Signal = {
  value: string;
  count?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  accent?: boolean;
};
