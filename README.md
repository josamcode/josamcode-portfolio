# Jo Sam Code — portfolio

Bilingual (English / Arabic) portfolio for **Gerges Samuel**, built on Next.js 16
with the App Router. Every page is statically pre-rendered in both languages.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm run start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` before deploying —
canonical URLs, hreflang, the sitemap, OG image URLs and JSON-LD all derive from it.

---

## Why Next.js

The brief asked for the option that is better for SEO. This site is server-rendered
and pre-generated, so crawlers receive complete HTML — headings, copy and structured
data — without executing JavaScript:

- **Static generation** for all 8 routes (`/en`, `/ar`, `/{locale}/work`, and three
  case studies per locale).
- **Per-page metadata** via `generateMetadata` — title, description, keywords,
  canonical, Open Graph and Twitter cards.
- **hreflang** on every page (`en`, `ar`, `x-default`) plus `<xhtml:link>` alternates
  in `sitemap.xml`, so the two languages are understood as translations rather than
  duplicates.
- **JSON-LD** graph: `Person`, `WebSite`, `ProfessionalService`, `BreadcrumbList`,
  `ItemList` on listings and `CreativeWork` on each case study.
- **Dynamic OG images** rendered at `/api/og` in the site's own typography.
- `robots.txt`, `sitemap.xml` and a web manifest generated from the same source of truth.
- Locale negotiation in `src/proxy.ts`: `/` and any unprefixed path redirect to the
  visitor's language (cookie, then `Accept-Language`, then English).

## Structure

```
src/
├── app/
│   ├── [locale]/                 root layout (html/lang/dir), home, work, case studies, 404
│   ├── api/contact/              form endpoint — validation, rate limit, mail or mailto fallback
│   ├── api/og/                   dynamic Open Graph image
│   ├── icon.tsx, apple-icon.tsx  generated favicons
│   └── sitemap.ts robots.ts manifest.ts
├── components/
│   ├── layout/                   nav, footer, theme + language switches
│   ├── motion/                   the animation system (see below)
│   ├── sections/                 hero, signals, work, services, about, teaching, contact, case study
│   ├── providers/                theme provider
│   └── ui/                       buttons, kicker, JSON-LD, interface mockups
├── content/                      en/ar dictionaries and project data (typed, kept in sync)
├── hooks/                        useMediaQuery, useIsHydrated
└── lib/                          i18n, SEO builders, fonts, site constants
```

Adding a language means adding a dictionary in `src/content` and a locale in
`src/lib/i18n.ts`. `ar.ts` is typed against `en.ts`, so a missing key is a build error.

## Motion

Animation is a system rather than per-component one-offs — shared easing and variants
live in `src/components/motion/variants.ts`.

| Piece | What it does |
| --- | --- |
| `Preloader` | First-visit curtain, four panels lifting in sequence, once per session |
| `SplitText` | Line-mask headline reveals and word-by-word 3D flips |
| `Reveal` | Scroll-triggered entrances with direction, blur and stagger variants |
| `Parallax` | Depth on the hero portrait and case-study galleries (desktop only) |
| `Counter` | Metrics counting up when scrolled into view |
| `Marquee` | Capability band whose speed and direction follow scroll velocity |
| `TiltCard` | 3D tilt with a cursor-tracking spotlight on the service cards |
| `Magnetic` | Buttons and the logo drift toward the pointer |
| `Cursor` | Two-part custom cursor that grows to "View" over work rows |
| `WorkList` | Live interface preview that follows the cursor across work rows |
| `SmoothScroll` | Lenis momentum scrolling with smooth in-page anchors |
| `ScrollProgress` / `BackToTop` | Reading progress bar and a progress-ring return control |
| `PageTransition` | Route-level fade and rise |

Everything is gated on `prefers-reduced-motion`; when it is set, decorative motion is
removed and content appears immediately. Parallax is disabled below `lg`, where the
layout stacks.

## Interface mockups

The case studies show the products through stylised interface illustrations drawn in
the site's own design language (`src/components/ui/MockScreen.tsx`) — no real customer
data appears anywhere. Each renders at a fixed design width and is scaled to its
container, so the typography holds its proportions from a 440px preview to a
full-width hero.

## Bilingual details

- `dir` is set on `<html>`; layout uses logical properties (`ps`/`pe`, `ms`/`me`,
  `start`/`end`) so RTL mirrors without duplicated CSS.
- Arabic uses IBM Plex Sans Arabic for body copy and Jomhuria for display headings;
  English uses Newsreader with JetBrains Mono for labels.
- The `.label` / `.label-plain` classes drop letter-spacing and uppercase under
  `[dir="rtl"]` — both are meaningless for cursive Arabic — and swap in the Arabic face.
- Latin runs inside Arabic sentences (handles, metrics, domains) are wrapped in `<bdi>`
  so bidi reordering does not scramble them.
- The language switch keeps the visitor on the same page in the other language.

## Contact form

`POST /api/contact` validates input, applies a per-IP rate limit and includes a
honeypot field. With `RESEND_API_KEY` set it sends the message; without it, it
responds `{ ok: true, fallback: true }` and the client opens the visitor's mail client
with everything pre-filled — so the form is never a dead end.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

Verified across 320–1536px in both languages and both themes: no horizontal overflow,
no hydration mismatches, no console errors.
