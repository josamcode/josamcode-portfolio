import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Trailing slashes off keeps canonical URLs unambiguous for crawlers.
  trailingSlash: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },

  async headers() {
    // Next already sets immutable caching on /_next/static; only the security
    // headers need adding here.
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
