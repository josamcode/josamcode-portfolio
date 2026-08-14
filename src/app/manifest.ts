import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.person.name} — ${site.name}`,
    short_name: site.name,
    description:
      "Systems engineer building accounting platforms, multi-tenant SaaS and Arabic-first products.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    background_color: site.brand.dark,
    theme_color: site.brand.dark,
    orientation: "portrait-primary",
    categories: ["business", "productivity", "developer"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
