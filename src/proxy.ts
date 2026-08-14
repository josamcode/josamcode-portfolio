import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

const LOCALE_COOKIE = "josam-locale";

/**
 * Every page lives under /en or /ar. Anything else is redirected into the
 * best-matching locale, so `/` and `/work/raeetna` both land somewhere real.
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    const current = pathname.split("/")[1];
    const response = NextResponse.next();
    // Remember the choice so the next bare visit goes straight there.
    if (request.cookies.get(LOCALE_COOKIE)?.value !== current) {
      response.cookies.set(LOCALE_COOKIE, current, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const target = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  url.search = search;

  return NextResponse.redirect(url, 307);
}

function detectLocale(request: NextRequest): string {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && locales.includes(saved as (typeof locales)[number])) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("en")) return "en";
  }

  return defaultLocale;
}

export const config = {
  // Skip Next internals, API routes and anything that looks like a file.
  matcher: ["/((?!_next/static|_next/image|api/|.*\\.).*)"],
};
