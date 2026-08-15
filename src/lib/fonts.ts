import localFont from "next/font/local";

/**
 * The four brand faces are vendored into `src/assets/fonts` and loaded from
 * disk rather than through `next/font/google`.
 *
 * `next/font/google` resolves the woff2 binaries over the network during
 * `next build`. Google rotates those hashed fonts.gstatic.com URLs whenever it
 * re-cuts a family, and the fonts.googleapis.com edge can serve stale CSS
 * pointing at the previous generation — a build that lands in that window gets
 * a 404 per file. Next.js downgrades that to a *warning*, so the deploy
 * succeeds and silently ships without the face. That is how JetBrains Mono
 * dropped out of production. Loading from disk takes the network out of the
 * build entirely.
 *
 * Regenerate the binaries with `python3 scripts/vendor-fonts.py` — the weight
 * ranges declared here have to match the axis limits in that script.
 */

/** English display face — the serif the design is built around. */
export const newsreader = localFont({
  src: [
    {
      path: "../assets/fonts/Newsreader-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Newsreader-latin-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-serif",
  preload: true,
  adjustFontFallback: "Times New Roman",
});

/** Labels, metrics, eyebrows — everything technical. */
export const jetbrainsMono = localFont({
  src: [
    {
      path: "../assets/fonts/JetBrainsMono-latin.woff2",
      weight: "400 600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-mono-jb",
  preload: true,
  adjustFontFallback: "Arial",
});

/**
 * Arabic body copy. Static weights — IBM Plex Sans Arabic ships no variable
 * cut. Each file carries both the Arabic and Latin subsets, because Arabic
 * copy is threaded with Latin product names and numerals and `next/font/local`
 * has no per-source `unicode-range` to split them across files.
 */
export const ibmPlexSansArabic = localFont({
  src: [
    {
      path: "../assets/fonts/IBMPlexSansArabic-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansArabic-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansArabic-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansArabic-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/IBMPlexSansArabic-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-arabic-body",
  preload: false,
  adjustFontFallback: "Arial",
});

/** Arabic display face for the oversized headlines. */
export const jomhuria = localFont({
  src: [
    {
      path: "../assets/fonts/Jomhuria-400.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-arabic-title",
  preload: false,
  adjustFontFallback: "Arial",
});

export const fontVariables = [
  newsreader.variable,
  jetbrainsMono.variable,
  ibmPlexSansArabic.variable,
  jomhuria.variable,
].join(" ");
