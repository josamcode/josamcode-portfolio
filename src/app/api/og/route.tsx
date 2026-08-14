import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

/** Fonts are fetched once per server instance and reused across requests. */
const fontCache = new Map<string, ArrayBuffer | null>();

/**
 * Satori cannot parse woff2. Requesting the CSS with a pre-woff2 user-agent
 * makes Google serve a TrueType URL instead. Returns null on any failure.
 */
async function loadFont(family: string, weight: number, text: string) {
  const key = `${family}:${weight}:${text}`;
  const cached = fontCache.get(key);
  if (cached !== undefined) return cached;

  let data: ArrayBuffer | null = null;
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
      {
        // No modern UA token, so Google responds with format('truetype').
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64)" },
        cache: "force-cache",
      },
    ).then((res) => (res.ok ? res.text() : ""));

    const url = css.match(/src:\s*url\((https:[^)]+)\)\s*format\('(?:truetype|opentype|woff)'\)/)?.[1];
    if (url) {
      const response = await fetch(url, { cache: "force-cache" });
      if (response.ok) data = await response.arrayBuffer();
    }
  } catch {
    data = null;
  }

  fontCache.set(key, data);
  return data;
}

/**
 * The image renderer has no Arabic shaping engine — Arabic glyphs make it
 * throw rather than degrade. Callers pass Latin card copy for Arabic pages;
 * this is the backstop if anything slips through.
 */
const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const latinOnly = (value: string, fallback: string) =>
  ARABIC.test(value) ? fallback : value;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("l") === "ar" ? "ar" : "en";
  const isAr = locale === "ar";

  const title = latinOnly((searchParams.get("t") ?? site.name).slice(0, 120), site.person.name);
  const kicker = latinOnly(
    searchParams.get("k") ?? `${site.person.name} · ${site.person.jobTitle}`,
    `${site.person.name} · ${site.person.jobTitle}`,
  );

  const family = "Newsreader";
  const monoText = "josamcode.com · @josamcode";
  const wordmark = "Jo Sam Code.";

  // Google subsets by `text`, so every glyph drawn in a given face has to be
  // listed — a missing glyph makes the renderer throw rather than fall back.
  const [titleFont, monoFont] = await Promise.all([
    loadFont(family, 600, `${title}${kicker}${wordmark}`),
    loadFont("JetBrains+Mono", 500, monoText),
  ]);

  const fonts = [
    ...(titleFont ? [{ name: "Title", data: titleFont, weight: 600 as const, style: "normal" as const }] : []),
    ...(monoFont ? [{ name: "Mono", data: monoFont, weight: 500 as const, style: "normal" as const }] : []),
  ];

  const card = (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 76px",
          background: "#0D1117",
          backgroundImage:
            "radial-gradient(900px circle at 12% 0%, rgba(34,197,94,0.20), transparent 55%), radial-gradient(700px circle at 100% 100%, rgba(34,197,94,0.10), transparent 60%)",
          // The renderer's bidi support cannot handle `direction: rtl`, so
          // Arabic cards are right-aligned instead; the text itself still
          // shapes correctly.
          alignItems: isAr ? "flex-end" : "flex-start",
          textAlign: isAr ? "right" : "left",
        }}
      >
        {/* top rule + kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            flexDirection: isAr ? "row-reverse" : "row",
          }}
        >
          <div style={{ width: 44, height: 2, background: "#22C55E" }} />
          <div
            style={{
              fontFamily: fonts.length ? "Title" : undefined,
              fontSize: 24,
              letterSpacing: isAr ? 0 : 3,
              textTransform: isAr ? "none" : "uppercase",
              color: "#22C55E",
            }}
          >
            {kicker}
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            fontFamily: fonts.length ? "Title" : undefined,
            fontSize: title.length > 60 ? 60 : title.length > 38 ? 72 : 88,
            lineHeight: 1.08,
            letterSpacing: isAr ? 0 : -2.5,
            color: "#E6EDF3",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(230,237,243,0.12)",
            paddingTop: 28,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: fonts.length ? "Title" : undefined,
              fontSize: 30,
              color: "#E6EDF3",
            }}
          >
            {wordmark.slice(0, -1)}
            <span style={{ color: "#22C55E" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: monoFont ? "Mono" : undefined,
              fontSize: 20,
              letterSpacing: 1.5,
              color: "#6D7986",
            }}
          >
            {monoText}
          </div>
        </div>
      </div>
  );

  // Satori needs at least one usable font. If the network is unavailable,
  // hand back a real static image rather than failing the request.
  if (!fonts.length) {
    return Response.redirect(new URL("/portrait.webp", request.url), 302);
  }

  return new ImageResponse(card, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
