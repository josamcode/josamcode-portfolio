"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, LoaderCircle } from "lucide-react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const fieldBase =
  "peer w-full border border-line-4 bg-surface px-4 pb-3 pt-6 text-[14px] text-txt outline-hidden transition-[border-color,box-shadow] duration-300 placeholder:text-transparent focus:border-accent focus:shadow-[0_0_0_1px_var(--accent)]";

const labelBase =
  "label pointer-events-none absolute top-4 text-[11px] text-dim transition-all duration-300 ltr:left-4 rtl:right-4 rtl:text-[12.5px] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px] peer-placeholder-shown:rtl:text-[14px] peer-focus:top-4 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:rtl:text-[12.5px] peer-focus:text-accent";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isAr = locale === "ar";
  const t = dict.contact.form;

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [count, setCount] = useState(0);

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = t.validation.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = t.validation.email;
    if (message.length < 20) next.message = t.validation.message;
    return next;
  }

  function openMailClient(data: FormData) {
    const body = [
      `${t.name}: ${data.get("name")}`,
      `${t.company}: ${data.get("company") || "—"}`,
      `${t.kind}: ${data.get("kind")}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");

    window.location.href = `mailto:${site.person.email}?subject=${encodeURIComponent(
      `${isAr ? "طلب مشروع" : "Project enquiry"} — ${data.get("name")}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot — real people never fill this.
    if (String(data.get("website") ?? "")) return;

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 1200);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          kind: data.get("kind"),
          message: data.get("message"),
          locale,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        fallback?: boolean;
      };

      if (!response.ok || !result.ok) throw new Error("send failed");

      // No mail transport configured server-side: hand off to the mail client.
      if (result.fallback) openMailClient(data);

      setStatus("sent");
      form.reset();
      setCount(0);
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE }}
      animate={status === "error" && Object.keys(errors).length ? { x: [0, -8, 8, -5, 5, 0] } : {}}
      className="grid gap-4"
    >
      {/* Honeypot */}
      <label className="sr-only" aria-hidden="true">
        <span>Website</span>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label={t.name}
          error={errors.name}
          autoComplete="name"
          required
          isAr={isAr}
        />
        <Field
          name="company"
          label={`${t.company} · ${t.optional}`}
          autoComplete="organization"
          isAr={isAr}
        />
      </div>

      <Field
        name="email"
        type="email"
        label={t.email}
        error={errors.email}
        autoComplete="email"
        dir="ltr"
        required
        isAr={isAr}
      />

      <label className="relative block">
        <span className="label absolute top-3 z-10 text-[11px] text-dim ltr:left-4 rtl:right-4 rtl:text-[12.5px]">
          {t.kind}
        </span>
        <select
          name="kind"
          defaultValue={t.options[0]}
          className={cn(
            "w-full appearance-none border border-line-4 bg-surface px-4 pb-3 pt-8 text-[14px] text-txt outline-hidden transition-colors duration-300 focus:border-accent",
            isAr ? "" : "mono",
          )}
        >
          {t.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 text-dim ltr:right-4 rtl:left-4"
        >
          ▾
        </span>
      </label>

      <label className="relative block">
        <textarea
          name="message"
          rows={5}
          required
          placeholder={t.messagePlaceholder}
          onChange={(event) => setCount(event.target.value.length)}
          className={cn(fieldBase, "resize-y leading-[1.65]", isAr ? "" : "mono", errors.message && "border-red-500/70")}
        />
        <span className={cn(labelBase, "top-3")}>{t.message}</span>
        <span
          className="mono pointer-events-none absolute bottom-3 text-[10px] tabular-nums text-dim-2 ltr:right-7 rtl:left-7"
          dir="ltr"
        >
          {count}
        </span>
        <FieldError message={errors.message} />
      </label>

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "label-tight group relative inline-flex min-w-[170px] items-center justify-center gap-2 overflow-hidden px-7 py-4 text-[13px] font-medium transition-colors duration-300 disabled:cursor-wait max-sm:w-full rtl:text-[14.5px]",
            status === "sent" ? "bg-accent-hi text-on-accent" : "bg-accent text-on-accent",
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  {t.sending}
                </>
              ) : status === "sent" ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                  {isAr ? "تم" : "Sent"}
                </>
              ) : (
                <>
                  {t.submit}
                  <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "label-plain text-[12.5px] rtl:text-[13.5px]",
              status === "sent" ? "text-accent" : status === "error" ? "text-red-400" : "text-dim",
            )}
            role={status === "error" ? "alert" : "status"}
          >
            {status === "sent" ? t.sent : status === "error" ? t.error : t.note}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.form>
  );
}

function Field({
  name,
  label,
  type = "text",
  error,
  isAr,
  ...rest
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  isAr: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative block">
      <input
        type={type}
        name={name}
        placeholder={label}
        className={cn(fieldBase, isAr ? "" : "mono", error && "border-red-500/70")}
        {...rest}
      />
      <span className={labelBase}>{label}</span>
      <FieldError message={error} />
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="mono mt-1.5 block text-[11px] text-red-400"
          role="alert"
        >
          {message}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}
