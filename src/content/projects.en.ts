import type { Project } from "./types";

export const projectsEn: Project[] = [
  {
    slug: "ara-financial",
    index: "01",
    caseLabel: "Case 01",
    category: "Cloud accounting SaaS",
    title: "ARA Financial",
    meta: "Cloud accounting SaaS · Gulf client · Live",
    year: "2025",
    summary:
      "A full double-entry accounting platform for the Saudi market, multi-tenant from day one: AR/AP, inventory, procurement, sales, bank reconciliation, POS, fixed assets, payroll, approval workflows, subscription billing and a gated AI action layer. Arabic-first and RTL end to end.",
    lede: "A double-entry accounting platform for the Saudi market, built multi-tenant from day one and Arabic-first end to end. In production with a Gulf client.",
    tags: ["83 modules", "108 data models", "231 test suites"],
    stack: ["Node.js", "MongoDB", "React", "Multi-tenant", "RTL", "Stripe-style billing"],
    heroAlt: "ARA Financial — the main dashboard in Arabic",
    facts: [
      { label: "Role", value: "Architecture & full build" },
      { label: "Market", value: "Saudi Arabia · MENA" },
      { label: "Model", value: "Multi-tenant SaaS" },
      { label: "Status", value: "Live in production", accent: true },
    ],
    blocks: [
      {
        type: "prose",
        heading: "The problem",
        paragraphs: [
          "Accounting software sold into the Gulf tends to be either an English product with Arabic pasted over it, or a local tool that stops at invoicing. Companies end up running the ledger in one place, inventory in another, payroll in a spreadsheet, and approvals over WhatsApp.",
          "The brief was a single platform where the books, the warehouse, the till and the payroll all post into the same double-entry engine — correct in Arabic, correct for the market, and able to serve many companies from one deployment without their data ever touching.",
        ],
      },
      {
        type: "cards",
        heading: "What I built",
        items: [
          {
            kicker: "Core ledger",
            body: "Full double-entry engine, chart of accounts, journals, bank reconciliation and fixed assets with depreciation.",
          },
          {
            kicker: "Operations",
            body: "AR/AP, sales, procurement, inventory and POS — every transaction posting back into the ledger rather than living beside it.",
          },
          {
            kicker: "People & control",
            body: "Payroll, multi-step approval workflows, role-based permissions, and a platform admin plane for onboarding tenants.",
          },
          {
            kicker: "Commercial & AI",
            body: "SaaS subscription billing, plus a gated AI action layer — assistants can read and propose, but only permitted actions reach the ledger.",
          },
        ],
      },
      {
        type: "decisions",
        heading: "Decisions that mattered",
        items: [
          {
            title: "Multi-tenant on day one",
            body: "Tenancy is the hardest thing to retrofit, so isolation, scoping and tenant-aware queries were part of the first data model rather than a later migration.",
          },
          {
            title: "Arabic-first, not Arabic-added",
            body: "RTL through the whole interface, and through printed documents, statements and reports — where most localisation efforts quietly fall apart.",
          },
          {
            title: "Tests on the money paths",
            body: "231 backend test suites concentrated where a mistake is expensive: posting, balancing, tax handling, approvals and permissions.",
          },
          {
            title: "AI behind a gate",
            body: "The AI layer runs through the same permission model as a user. Nothing writes to the books that a role could not have written by hand.",
          },
        ],
      },
    ],
    stats: [
      { value: "83", count: 83, label: "backend modules" },
      { value: "108", count: 108, label: "data models" },
      { value: "231", count: 231, label: "backend test suites" },
      { value: "Live", label: "running for a Gulf client", accent: true },
    ],
    gallery: [
      { alt: "Journal entry and ledger screen", hint: "journal entry / ledger" },
      { alt: "Point of sale and inventory screen", hint: "POS / inventory" },
    ],
    next: {
      slug: "raeetna",
      kicker: "Next case",
      title: "Raeetna",
      meta: "Database-per-tenant platform for 6,400 members",
    },
    seo: {
      title: "ARA Financial — multi-tenant Arabic accounting platform",
      description:
        "Case study: a double-entry cloud accounting SaaS for the Saudi market — 83 backend modules, 108 data models, 231 test suites, multi-tenant and Arabic-first from day one.",
    },
  },
  {
    slug: "raeetna",
    index: "02",
    caseLabel: "Case 02",
    category: "Multi-tenant platform",
    title: "Raeetna",
    meta: "Multi-tenant platform · 6,400 members · Live",
    year: "2025",
    summary:
      "A church management system rebuilt as a multi-tenant SaaS platform: database-per-tenant with a separate control plane, tenants resolved from the request host, custom domains per organisation, and independent backups held at a second provider. Recovery is drilled, not assumed.",
    lede: "A church management system rebuilt as a multi-tenant SaaS platform — a separate database per organisation, its own control plane, and a recovery story that has actually been tested.",
    tags: ["1,900 households", "1,675ms → 59ms", "DB per tenant"],
    stack: ["Node.js", "MongoDB", "React", "DB-per-tenant", "Offsite backups", "Custom domains"],
    heroAlt: "Raeetna — the dashboard after the rewrite",
    facts: [
      { label: "Role", value: "Architecture & full build" },
      { label: "Tenancy", value: "Database per organisation" },
      { label: "Deployed for", value: "6,400 members" },
      { label: "Status", value: "Live in production", accent: true },
    ],
    blocks: [
      {
        type: "prose",
        heading: "The problem",
        paragraphs: [
          "One church, thousands of people, and records held in a way nobody could query: households, families, services, pastoral history. The first version worked for a single organisation — but every new church meant another copy to deploy, another database to nurse, and no safe way to share a codebase between them.",
          "It also had to be fast enough for daily use and trustworthy with sensitive personal data. A dashboard that takes five seconds gets abandoned; a backup nobody has restored is not a backup.",
        ],
      },
      {
        type: "decisions",
        heading: "The architecture",
        items: [
          {
            title: "Database per tenant, plus a control plane",
            body: "Each church gets its own database; a separate control plane owns provisioning, tenant records and platform-level state. Isolation is structural, not a WHERE clause someone can forget.",
          },
          {
            title: "Tenant resolved from the request host",
            body: "The host on the incoming request decides which tenant connection is used, which makes custom domains per church a configuration step rather than a code change.",
          },
          {
            title: "Backups at a second provider",
            body: "Independent copies kept away from the primary infrastructure, so losing an account or a region does not mean losing the data.",
          },
          {
            title: "Recovery drilled, not assumed",
            body: "A full restore was rehearsed end to end: 23,717 documents brought back clean, zero failures. The drill is repeatable, which is the only reason to believe it.",
          },
        ],
      },
      {
        type: "metrics",
        heading: "Making it fast",
        intro:
          "Performance work was measured, not guessed at. The analytics behind the dashboard were the worst offender — aggregations doing far more work than the answer required.",
        rows: [
          { label: "Core analytics queries", before: "1,675ms", after: "59ms" },
          { label: "Dashboard load", before: "5.3s", after: "3.5s" },
          { label: "Restore drill", before: "23,717 docs", after: "0 failures" },
        ],
      },
    ],
    stats: [
      { value: "6,400", count: 6400, label: "members" },
      { value: "1,900", count: 1900, label: "households" },
      { value: "1,018", count: 1018, label: "families" },
      { value: "28×", count: 28, suffix: "×", label: "faster core analytics", accent: true },
    ],
    gallery: [
      { alt: "Member and household record screen", hint: "member / household record" },
      { alt: "Tenant administration and control plane", hint: "tenant admin / control plane" },
    ],
    next: {
      slug: "content-hub",
      kicker: "Next case",
      title: "JoSam Content Hub",
      meta: "Publishing to four platforms from one place",
    },
    seo: {
      title: "Raeetna — database-per-tenant SaaS for 6,400 members",
      description:
        "Case study: rebuilding a church management system as a multi-tenant platform — database per organisation, host-based tenant resolution, offsite backups and a drilled 23,717-document restore.",
    },
  },
  {
    slug: "content-hub",
    index: "03",
    caseLabel: "Case 03",
    category: "Own product",
    title: "JoSam Content Hub",
    meta: "Arabic-first SaaS · Own product",
    year: "2026",
    summary:
      "One place for creators to schedule, queue and publish video to TikTok, Instagram, YouTube and Facebook — instead of four dashboards and four upload flows. RTL-first interface with an integrated payment gateway. Designed and built end to end.",
    lede: "Arabic-first SaaS for creators who publish video across four platforms — one place to schedule, queue and post, instead of four dashboards and four upload flows.",
    tags: ["4 platform APIs", "Payments", "RTL-first"],
    stack: ["Next.js", "Node.js", "Queues", "OAuth", "Payment gateway", "RTL"],
    heroAlt: "Content Hub — the scheduling calendar in Arabic",
    facts: [
      { label: "Role", value: "Design & build, end to end" },
      { label: "Platforms", value: "TikTok · IG · YouTube · FB" },
      { label: "Interface", value: "RTL-first, Arabic" },
      { label: "Billing", value: "Payment gateway integrated", accent: true },
    ],
    blocks: [
      {
        type: "prose",
        heading: "Why I built it",
        paragraphs: [
          "I publish the same video to TikTok, Instagram, YouTube and Facebook. Four uploads, four caption boxes, four sets of rules about length and aspect ratio, and no single view of what goes out when. The existing tools that solve this are built for English-speaking teams and treat Arabic as an afterthought.",
          "So this is a product I use before I sell it. Every decision came from a real publishing week, not a feature list.",
        ],
      },
      {
        type: "cards",
        heading: "What it does",
        items: [
          {
            kicker: "One queue",
            body: "Upload once, choose destinations, and the video goes out on schedule to every platform selected — with per-platform copy where it needs to differ.",
          },
          {
            kicker: "Four APIs, one flow",
            body: "Each platform authenticates, chunks and validates differently. The interface hides that; failures retry and report instead of silently disappearing.",
          },
          {
            kicker: "RTL-first interface",
            body: "Arabic is the design language of the product — calendars, forms, upload states and notifications all read naturally right to left.",
          },
          {
            kicker: "Subscriptions",
            body: "Payment gateway integrated for plans and renewals, so it runs as a product rather than a personal script.",
          },
        ],
      },
      {
        type: "prose",
        heading: "What it proves",
        paragraphs: [
          "Third-party integrations are where most products get fragile: rate limits, expiring tokens, uploads that fail halfway. Building this taught me to design for the failure path first — the same discipline I bring to a client's ledger or a tenant's database.",
          "It is also the tool behind everything I publish as @josamcode, which means it gets tested every week by the person least willing to tolerate it breaking.",
        ],
      },
    ],
    stats: [
      { value: "4", count: 4, label: "platform APIs" },
      { value: "1", count: 1, label: "upload, four destinations" },
      { value: "RTL", label: "first, not translated" },
      { value: "Live", label: "the tool behind @josamcode", accent: true },
    ],
    gallery: [
      { alt: "Upload and destinations screen", hint: "upload / destinations" },
      { alt: "Queue and analytics view", hint: "queue / analytics" },
    ],
    next: {
      slug: null,
      kicker: "Have a system to build?",
      title: "Tell me what it has to do",
      meta: "Reply within two working days",
    },
    seo: {
      title: "JoSam Content Hub — Arabic-first multi-platform publishing",
      description:
        "Case study: an RTL-first SaaS that schedules and publishes video to TikTok, Instagram, YouTube and Facebook from one queue, with integrated subscription billing.",
    },
  },
];
