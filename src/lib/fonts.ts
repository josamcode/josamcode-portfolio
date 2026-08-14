import { Newsreader, JetBrains_Mono, IBM_Plex_Sans_Arabic, Jomhuria } from "next/font/google";

/** English display face — the serif the design is built around. */
export const serif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
  preload: true,
});

/** Labels, metrics, eyebrows — everything technical. */
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono-jb",
  preload: true,
});

/** Arabic body copy. */
export const arabicBody = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arabic-body",
  preload: false,
});

/** Arabic display face for the oversized headlines. */
export const arabicDisplay = Jomhuria({
  subsets: ["arabic", "latin"],
  weight: "400",
  display: "swap",
  variable: "--font-arabic-title",
  preload: false,
});

export const fontVariables = [
  serif.variable,
  mono.variable,
  arabicBody.variable,
  arabicDisplay.variable,
].join(" ");
