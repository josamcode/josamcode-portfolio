/**
 * Single source of truth for identity, contact details and canonical URLs.
 * Everything SEO-related (metadata, sitemap, JSON-LD, OG images) reads from here.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://josamcode.com"
).replace(/\/$/, "");

export const site = {
  url: siteUrl,
  name: "Jo Sam Code",
  person: {
    name: "Gerges Samuel",
    nameAr: "جرجس صموئيل",
    handle: "josamcode",
    jobTitle: "Systems Engineer",
    jobTitleAr: "مهندس أنظمة",
    email: "josamcode@gmail.com",
    phone: "+201204170940",
    phoneDisplay: "+20 120 417 0940",
    location: { city: "Cairo", country: "EG", countryName: "Egypt" },
  },
  social: {
    youtube: "https://youtube.com/@josamcode",
    tiktok: "https://tiktok.com/@josamcode",
    instagram: "https://instagram.com/josamcode",
    github: "https://github.com/josamcode",
    linkedin: "https://www.linkedin.com/in/josamcode",
  },
  brand: {
    accent: "#22C55E",
    accentHi: "#4ADE80",
    dark: "#0D1117",
    light: "#F7F8F7",
  },
} as const;

export const socialList = [
  { key: "youtube", href: site.social.youtube },
  { key: "tiktok", href: site.social.tiktok },
  { key: "instagram", href: site.social.instagram },
  { key: "github", href: site.social.github },
] as const;

export const sameAs = Object.values(site.social);
