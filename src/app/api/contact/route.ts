import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  company?: string;
  email?: string;
  kind?: string;
  message?: string;
  locale?: string;
};

/** Naive in-memory throttle — enough to blunt casual abuse on a single instance. */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const company = clean(body.company, 160);
  const kind = clean(body.kind, 120);
  const message = clean(body.message, 5000);

  if (name.length < 2 || message.length < 20 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO ?? site.person.email;

  // No transport configured: acknowledge and let the client open a mail draft.
  if (!apiKey) {
    return NextResponse.json({ ok: true, fallback: true });
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "—"}`,
    `Type: ${kind || "—"}`,
    `Locale: ${clean(body.locale, 8) || "en"}`,
    "",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Project enquiry — ${name}`,
        text,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ ok: true, fallback: true });
    }

    return NextResponse.json({ ok: true, fallback: false });
  } catch {
    return NextResponse.json({ ok: true, fallback: true });
  }
}
