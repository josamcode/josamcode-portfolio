"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/variants";

/* ------------------------------------------------------------------ *
 * Stylised interface illustrations.
 *
 * These are abstract representations of the products, drawn in the site's
 * own design language rather than screenshots — no real customer data is
 * shown anywhere.
 * ------------------------------------------------------------------ */

/**
 * Renders its child at a fixed design width, then scales the whole thing to
 * fill the container. Without this the mock's type and controls would stretch
 * with the box and read as a different design at every size.
 */
function FitBox({
  baseWidth,
  children,
}: {
  baseWidth: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 1, height: 0, base: baseWidth });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = (width: number, height: number) => {
      if (!width || !height) return;
      // On narrow screens a full-size design width would scale down to
      // unreadable type, so the design width shrinks toward the container.
      const base = Math.max(360, Math.min(baseWidth, width * 1.4));
      setBox({ scale: width / base, height: (height / width) * base, base });
    };

    const rect = node.getBoundingClientRect();
    measure(rect.width, rect.height);

    const observer = new ResizeObserver(([entry]) => {
      measure(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [baseWidth]);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {/* Absolutely positioned so the fixed design width never leaks into
          intrinsic sizing — otherwise a grid or flex track would size itself
          to the mock's min-content and overflow narrow viewports. */}
      <div
        className="absolute left-0 top-0"
        style={{
          width: box.base,
          height: box.height || "100%",
          transform: `scale(${box.scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Chrome({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full w-full flex-col bg-bg-2", className)}>
      <div className="flex shrink-0 items-center gap-3 border-b border-line-2 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line-6" />
          <span className="h-2 w-2 rounded-full bg-line-5" />
          <span className="h-2 w-2 rounded-full bg-line-4" />
        </div>
        <div className="mono mx-auto truncate rounded-sm bg-surface px-3 py-1 text-[9.5px] tracking-[0.06em] text-dim">
          {title}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

const rowIn = {
  hidden: { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EASE, delay: 0.12 + i * 0.08 },
  }),
};

/** Left rail of an application window — only drawn at hero size. */
function Sidebar({
  brand,
  items,
  active = 0,
}: {
  brand: string;
  items: string[];
  active?: number;
}) {
  return (
    <aside className="flex w-[124px] shrink-0 flex-col gap-1 border-e border-line-2 bg-bg-2 p-2.5">
      <div className="mono mb-2 flex items-center gap-1.5 px-1.5 py-1 text-[9.5px] tracking-[0.06em] text-txt-2">
        <span className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
        {brand}
      </div>
      {items.map((item, i) => (
        <motion.div
          key={item}
          custom={i}
          variants={rowIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className={cn(
            "mono flex items-center gap-1.5 rounded-[2px] px-1.5 py-1.5 text-[9px]",
            i === active ? "bg-accent-soft text-accent" : "text-dim-2",
          )}
        >
          <span
            className={cn(
              "h-1 w-1 rounded-full",
              i === active ? "bg-accent" : "bg-line-5",
            )}
          />
          <span className="truncate">{item}</span>
        </motion.div>
      ))}
      <div className="mono mt-auto rounded-[2px] border border-line-2 px-1.5 py-1.5 text-[8.5px] text-dim-2">
        v2.4.0
      </div>
    </aside>
  );
}

function Bar({ value, delay, accent }: { value: number; delay: number; accent?: boolean }) {
  return (
    <div className="flex h-full w-full items-end">
      <motion.div
        className={cn("w-full rounded-t-[2px]", accent ? "bg-accent" : "bg-line-5")}
        initial={{ height: "4%" }}
        whileInView={{ height: `${value}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      />
    </div>
  );
}

/* --------------------------- ARA Financial --------------------------- */

function LedgerMock({ dense }: { dense?: boolean }) {
  const allRows = [
    { code: "1100", name: "Accounts receivable", debit: "48,200.00", credit: "—" },
    { code: "4000", name: "Sales revenue", debit: "—", credit: "42,000.00" },
    { code: "2200", name: "VAT payable", debit: "—", credit: "6,200.00" },
    { code: "1000", name: "Cash on hand", debit: "12,750.00", credit: "—" },
    { code: "5100", name: "Cost of goods sold", debit: "18,400.00", credit: "—" },
    { code: "1300", name: "Inventory", debit: "—", credit: "18,400.00" },
    { code: "2100", name: "Accounts payable", debit: "—", credit: "9,350.00" },
  ];
  // Drop rows in the compact preview so nothing gets clipped mid-table.
  const rows = dense ? allRows.slice(0, 3) : allRows;

  return (
    <Chrome title="ara.financial / journal-entry">
      <div className="flex h-full">
        {!dense ? (
          <Sidebar
            brand="ARA"
            items={["Dashboard", "Journals", "AR / AP", "Inventory", "Payroll", "Reports", "Settings"]}
            active={1}
          />
        ) : null}
        <div className={cn("flex min-w-0 flex-1 flex-col gap-3 p-4", dense && "gap-2 p-3")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="mono text-[10px] uppercase tracking-[0.14em] text-dim">JE-2041</span>
            <span className="mono rounded-sm border border-accent-line bg-accent-soft px-1.5 py-0.5 text-[9px] tracking-[0.08em] text-accent">
              balanced
            </span>
          </div>
          <span className="mono text-[9.5px] text-dim-2">قيد يومية</span>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-[2px] border border-line-2">
          <div className="mono grid grid-cols-[auto_1fr_88px_88px] gap-x-3 border-b border-line-2 bg-surface px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-dim-2">
            <span>Code</span>
            <span>Account</span>
            <span className="text-right">Debit</span>
            <span className="text-right">Credit</span>
          </div>
          {rows.map((row, i) => (
            <motion.div
              key={row.code}
              custom={i}
              variants={rowIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className={cn(
                "mono grid grid-cols-[auto_1fr_88px_88px] items-center gap-x-3 border-b border-line-1 px-3 text-[10px] text-body-2 last:border-b-0",
                dense ? "py-1.5" : "py-2",
              )}
            >
              <span className="text-dim">{row.code}</span>
              <span className="truncate text-txt-2">{row.name}</span>
              <span className="text-right tabular-nums text-txt">{row.debit}</span>
              <span className="text-right tabular-nums text-txt">{row.credit}</span>
            </motion.div>
          ))}
        </div>

          <div className="mono flex items-center justify-between rounded-[2px] border border-line-2 bg-surface px-3 py-2 text-[10px]">
            <span className="text-dim-2">Totals</span>
            <span className="flex gap-4 tabular-nums text-accent">
              <span>79,350.00</span>
              <span>79,350.00</span>
            </span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function PosMock() {
  const items = [
    { name: "Item 24-A", qty: "×2", price: "310.00" },
    { name: "Item 18-C", qty: "×1", price: "145.50" },
    { name: "Item 07-B", qty: "×4", price: "620.00" },
  ];

  return (
    <Chrome title="ara.financial / point-of-sale">
      <div className="grid h-full grid-cols-[1.15fr_0.85fr] gap-0">
        <div className="grid grid-cols-3 content-start gap-2 border-e border-line-2 p-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.05 * i }}
              className={cn(
                "aspect-4/3 rounded-[2px] border border-line-2 bg-surface",
                i === 4 && "border-accent-line bg-accent-soft",
              )}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2 p-3">
          <span className="mono text-[9px] uppercase tracking-[0.14em] text-dim-2">Ticket</span>
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={rowIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="mono flex items-center justify-between border-b border-line-1 pb-1.5 text-[9.5px] text-body-2"
            >
              <span className="text-txt-2">{item.name}</span>
              <span className="tabular-nums text-dim">{item.qty}</span>
              <span className="tabular-nums text-txt">{item.price}</span>
            </motion.div>
          ))}
          <div className="mono mt-auto flex items-center justify-between border-t border-line-3 pt-2 text-[11px]">
            <span className="text-dim-2">Total</span>
            <span className="tabular-nums text-accent">1,075.50</span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ------------------------------ Raeetna ------------------------------ */

function DirectoryMock({ dense }: { dense?: boolean }) {
  const bars = [42, 68, 55, 88, 61, 74, 96, 52];

  return (
    <Chrome title="raeetna.app / dashboard">
      <div className="flex h-full">
        {!dense ? (
          <Sidebar
            brand="Raeetna"
            items={["Dashboard", "Members", "Households", "Services", "Attendance", "Tenants", "Backups"]}
            active={0}
          />
        ) : null}
        <div
          className={cn(
            "grid min-w-0 flex-1 grid-rows-[auto_1fr] gap-3 p-4",
            dense && "gap-2 p-3",
          )}
        >
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Members", v: "6,400" },
            { k: "Households", v: "1,900" },
            { k: "Families", v: "1,018" },
          ].map((stat, i) => (
            <motion.div
              key={stat.k}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 * i }}
              className="rounded-[2px] border border-line-2 bg-surface px-3 py-2"
            >
              <div className="mono text-[9px] uppercase tracking-[0.12em] text-dim-2">{stat.k}</div>
              <div className="mono mt-1 text-[15px] tabular-nums text-txt">{stat.v}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid min-h-0 grid-cols-[1fr_0.75fr] gap-3">
          <div className="flex flex-col rounded-[2px] border border-line-2 bg-surface p-3">
            <div className="mono mb-2 flex items-center justify-between text-[9px] uppercase tracking-[0.12em] text-dim-2">
              <span>Attendance</span>
              <span className="text-accent">59ms</span>
            </div>
            <div className="flex min-h-0 flex-1 items-end gap-1.5">
              {bars.map((bar, i) => (
                <Bar key={i} value={bar} delay={0.2 + i * 0.06} accent={i === bars.length - 2} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 rounded-[2px] border border-line-2 bg-surface p-3">
            <div className="mono mb-1 text-[9px] uppercase tracking-[0.12em] text-dim-2">Tenants</div>
            {(dense
              ? ["st-mark", "st-george", "st-mary"]
              : ["st-mark", "st-george", "st-mary", "st-antony", "st-bishoy", "st-takla"]
            ).map((tenant, i) => (
              <motion.div
                key={tenant}
                custom={i}
                variants={rowIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                className="mono flex items-center justify-between gap-2 text-[9.5px] text-body-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="truncate">{tenant}.raeetna.app</span>
                </span>
                <span className="shrink-0 text-dim-2">ok</span>
              </motion.div>
            ))}
            <div className="mono mt-auto flex items-center gap-2 border-t border-line-2 pt-2 text-[9px] text-dim-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>db per tenant</span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function RecordMock() {
  return (
    <Chrome title="raeetna.app / household">
      <div className="grid h-full grid-cols-[0.9fr_1.1fr] gap-0">
        <div className="flex flex-col gap-2 border-e border-line-2 p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={rowIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className={cn(
                "flex items-center gap-2 rounded-[2px] border border-line-2 px-2 py-1.5",
                i === 1 ? "border-accent-line bg-accent-soft" : "bg-surface",
              )}
            >
              <span className="h-4 w-4 shrink-0 rounded-full bg-line-4" />
              <span className="h-1.5 w-full rounded-full bg-line-3" />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-2 p-3">
          <span className="mono text-[9px] uppercase tracking-[0.14em] text-dim-2">Record</span>
          {[92, 74, 60, 84, 46].map((w, i) => (
            <motion.span
              key={i}
              className="block h-1.5 rounded-full bg-line-3"
              initial={{ width: 0 }}
              whileInView={{ width: `${w}%` }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.08 }}
            />
          ))}
          <div className="mono mt-auto flex items-center justify-between rounded-[2px] border border-line-2 bg-surface px-2 py-1.5 text-[9px]">
            <span className="text-dim-2">restore drill</span>
            <span className="text-accent">23,717 / 0 fail</span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

/* ---------------------------- Content Hub ---------------------------- */

const platforms = [
  { key: "tiktok", label: "TT" },
  { key: "instagram", label: "IG" },
  { key: "youtube", label: "YT" },
  { key: "facebook", label: "FB" },
];

const WEEKDAYS_AR = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

function CalendarMock({ dense }: { dense?: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const cols = dense ? 6 : 7;
  const rows = dense ? 3 : 4;

  // Scheduled posts across the week: [column, row, platform index, time].
  const slots = dense
    ? [
        { col: 0, row: 1, p: 0, t: "09:00" },
        { col: 1, row: 0, p: 1, t: "12:30" },
        { col: 2, row: 2, p: 2, t: "17:00" },
        { col: 3, row: 1, p: 3, t: "20:15" },
        { col: 4, row: 0, p: 0, t: "08:45" },
        { col: 5, row: 2, p: 1, t: "21:00" },
      ]
    : [
        { col: 0, row: 0, p: 0, t: "09:00" },
        { col: 0, row: 2, p: 2, t: "18:30" },
        { col: 1, row: 1, p: 1, t: "12:30" },
        { col: 2, row: 0, p: 3, t: "08:15" },
        { col: 2, row: 3, p: 0, t: "21:00" },
        { col: 3, row: 1, p: 2, t: "13:45" },
        { col: 4, row: 0, p: 1, t: "10:00" },
        { col: 4, row: 2, p: 0, t: "19:20" },
        { col: 5, row: 3, p: 3, t: "22:00" },
        { col: 6, row: 1, p: 0, t: "11:30" },
        { col: 6, row: 2, p: 1, t: "16:10" },
      ];

  return (
    <Chrome title="hub.josamcode.com / تقويم النشر">
      <div className="flex h-full" dir="rtl">
        {!dense ? (
          <Sidebar
            brand="Hub"
            items={["اللوحة", "التقويم", "الطابور", "الحسابات", "التحليلات", "الاشتراك", "الإعدادات"]}
            active={1}
          />
        ) : null}
        <div className={cn("flex min-w-0 flex-1 flex-col gap-3 p-4", dense && "gap-2 p-3")}>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {platforms.map((platform, i) => (
              <motion.span
                key={platform.key}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.08 * i }}
                className={cn(
                  "mono grid h-5 w-7 place-items-center rounded-[2px] border text-[8.5px] tracking-[0.04em]",
                  i === 0
                    ? "border-accent-line bg-accent-soft text-accent"
                    : "border-line-3 bg-surface text-dim",
                )}
              >
                {platform.label}
              </motion.span>
            ))}
          </div>
          <span className="mono text-[9px] text-dim-2">أسبوع 12</span>
        </div>

        {!dense ? (
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {WEEKDAYS_AR.map((day) => (
              <span key={day} className="truncate text-center text-[9px] text-dim-2">
                {day}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="grid min-h-0 flex-1 gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: cols * rows }).map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const slot = slots.find((s) => s.col === col && s.row === row);
            return (
              <div key={i} className="relative rounded-[2px] border border-line-1 bg-surface/60">
                {slot ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.2 + slot.col * 0.06 }}
                    className={cn(
                      "mono absolute inset-1 flex flex-col items-center justify-center gap-0.5 rounded-[2px] text-[8px] leading-none",
                      slot.p === 0
                        ? "bg-accent text-on-accent"
                        : "border border-line-3 bg-bg-2 text-dim",
                    )}
                  >
                    <span className="font-medium">{platforms[slot.p].label}</span>
                    {!dense ? (
                      <span dir="ltr" className="opacity-70">
                        {slot.t}
                      </span>
                    ) : null}
                  </motion.div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mono flex items-center justify-between rounded-[2px] border border-line-2 bg-surface px-3 py-2 text-[9.5px]">
          <span className="text-dim-2">في الطابور</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              {!reduced ? (
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-[pulse-ring_2.6s_ease-out_infinite]" />
              ) : null}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="text-accent">{slots.length} منشورات</span>
          </div>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

function UploadMock() {
  return (
    <Chrome title="hub.josamcode.com / رفع">
      <div className="flex h-full flex-col gap-3 p-3" dir="rtl">
        <div className="grid flex-1 place-items-center rounded-[2px] border border-dashed border-line-4 bg-surface/50">
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mono flex flex-col items-center gap-1.5 text-[9.5px] text-dim"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line-4 text-accent">
              ↑
            </span>
            <span>اسحب الفيديو هنا</span>
          </motion.div>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.08 * i }}
              className="rounded-[2px] border border-line-2 bg-surface p-2"
            >
              <div className="mono mb-1.5 text-[8.5px] text-dim-2">{platform.label}</div>
              <motion.div
                className="h-1 rounded-full bg-accent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: [0.1, 0.6, 1][i % 3] }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 + i * 0.08 }}
                style={{ transformOrigin: "right" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function QueueMock() {
  return (
    <Chrome title="hub.josamcode.com / الطابور">
      <div className="flex h-full flex-col gap-1.5 p-3" dir="rtl">
        {[
          { t: "09:00", s: "published", p: "TT" },
          { t: "12:30", s: "published", p: "IG" },
          { t: "17:00", s: "queued", p: "YT" },
          { t: "20:15", s: "queued", p: "FB" },
          { t: "22:00", s: "draft", p: "TT" },
        ].map((row, i) => (
          <motion.div
            key={row.t}
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 }}
            className="mono flex items-center justify-between rounded-[2px] border border-line-2 bg-surface px-2.5 py-2 text-[9.5px]"
          >
            <span className="tabular-nums text-txt-2">{row.t}</span>
            <span className="text-dim">{row.p}</span>
            <span className={cn(row.s === "published" ? "text-accent" : "text-dim-2")}>{row.s}</span>
          </motion.div>
        ))}
      </div>
    </Chrome>
  );
}

/* ------------------------------ dispatcher ------------------------------ */

export type MockVariant = "hero" | "a" | "b";

/** Design width per usage — keeps type legible whatever the container does. */
const BASE_WIDTH: Record<MockVariant, number> = { hero: 880, a: 460, b: 460 };

export function ProjectMock({
  slug,
  variant = "hero",
  className,
}: {
  slug: string;
  variant?: MockVariant;
  className?: string;
}) {
  const content = (() => {
    if (slug === "ara-financial") {
      if (variant === "b") return <PosMock />;
      return <LedgerMock dense={variant !== "hero"} />;
    }
    if (slug === "raeetna") {
      if (variant === "b") return <RecordMock />;
      return <DirectoryMock dense={variant !== "hero"} />;
    }
    if (variant === "b") return <QueueMock />;
    if (variant === "a") return <UploadMock />;
    return <CalendarMock dense={variant !== "hero"} />;
  })();

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden border border-line-3 bg-surface",
        className,
      )}
    >
      <FitBox baseWidth={BASE_WIDTH[variant]}>{content}</FitBox>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/45 via-transparent to-transparent"
      />
    </div>
  );
}
