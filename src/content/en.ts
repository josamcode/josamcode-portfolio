import type { Signal } from "./types";

export const en = {
  meta: {
    home: {
      title: "Gerges Samuel — Systems Engineer | Jo Sam Code",
      description:
        "I build the systems a business actually runs on: double-entry accounting platforms, multi-tenant SaaS and Arabic-first products in production across MENA.",
      keywords: [
        "systems engineer",
        "accounting software developer",
        "multi-tenant SaaS architect",
        "Arabic first software",
        "RTL web development",
        "MENA software engineer",
        "double-entry accounting platform",
        "Gerges Samuel",
        "Jo Sam Code",
        "josamcode",
      ],
    },
    work: {
      title: "Selected work — production systems",
      description:
        "Three systems in production: a multi-tenant Arabic accounting platform, a database-per-tenant SaaS serving 6,400 members, and an RTL-first publishing product.",
    },
    // Social cards are rendered without an Arabic shaping engine, so both
    // locales share Latin card copy.
    card: {
      home: "I build the systems a business actually runs on.",
      work: "Selected work — three systems in production",
      kicker: "Gerges Samuel · Systems Engineer",
    },
    notFound: {
      title: "Page not found",
      description:
        "That page does not exist. Head back to the work or start a project.",
    },
  },

  nav: {
    work: "Work",
    services: "Services",
    about: "About",
    teaching: "Teaching",
    contact: "Contact",
    cta: "Start a project",
    allWork: "All work",
    home: "Home",
    menu: "Menu",
    close: "Close",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
  },

  theme: {
    light: "Light",
    dark: "Dark",
    toggle: "Toggle colour theme",
  },

  lang: {
    switchTo: "العربية",
    switchAria: "Switch language to Arabic",
  },

  hero: {
    eyebrow: "Gerges Samuel · Systems Engineer",
    titleLines: ["I build the systems", "a business", "actually runs on."],
    emphasis: "actually runs on.",
    rotating: [
      "accounting platforms",
      "multi-tenant SaaS",
      "Arabic-first products",
      "recovery you can trust",
    ],
    rotatingPrefix: "Currently shipping",
    paragraph:
      "Accounting platforms, multi-tenant SaaS, Arabic-first products in production. I start from how the business works — the ledger, the approvals, the edge cases — and design the software around it. Then I teach beginners from that same work.",
    primaryCta: "Start a project",
    secondaryCta: "Selected work",
    available: "Open for new projects",
    scroll: "Scroll",
    portraitAlt: "Portrait of Gerges Samuel",
  },

  signals: [
    {
      value: "83",
      count: 83,
      label: "backend modules in one production accounting platform",
    },
    {
      value: "6,400",
      count: 6400,
      label: "members served on a single live deployment",
    },
    {
      value: "28×",
      count: 28,
      suffix: "×",
      label: "faster core analytics — 1,675ms down to 59ms",
      accent: true,
    },
    {
      value: "23,717",
      count: 23717,
      label: "documents restored clean in a drilled recovery",
    },
  ] as Signal[],

  marquee: [
    "Double-entry ledgers",
    "Multi-tenant architecture",
    "Arabic-first & RTL",
    "Database per tenant",
    "Approval workflows",
    "Payroll & inventory",
    "Query optimisation",
    "Drilled recovery",
    "Subscription billing",
    "Payment gateways",
  ],

  work: {
    kicker: "Three systems, in production",
    heading: "Selected work",
    readCase: "Read the case",
    viewAll: "View all work",
    indexHeading: "Everything, in production",
    indexLede:
      "Three systems people depend on every working day — an accounting platform, a multi-tenant church platform, and a publishing product I run my own content through.",
    // {n} is replaced with the project count at render time. Kept as a plain
    // string so the dictionary can cross the server/client boundary.
    countLabel: "{n} case studies",
  },

  services: {
    kicker: "What I take on",
    heading: "Work that has to survive contact with a real business.",
    items: [
      {
        title: "Business & accounting systems",
        body: "Double-entry ledgers, AR/AP, inventory, payroll, approval chains. The parts where being wrong costs money.",
      },
      {
        title: "Multi-tenant SaaS",
        body: "Tenant isolation, control planes, custom domains, subscription billing — architected before the first customer, not after the tenth.",
      },
      {
        title: "Arabic-first & RTL products",
        body: "Arabic as the primary language, not a translation layer bolted on at the end. Layout, data, documents and reports all read right.",
      },
      {
        title: "Performance & recovery",
        body: "Slow dashboards, heavy queries, backups nobody has ever tested. Measured before, measured after, restore drilled for real.",
      },
    ],
    processKicker: "How it goes",
    process: [
      {
        step: "01",
        title: "Understand",
        body: "I learn how the business works before writing a line of code.",
      },
      {
        step: "02",
        title: "Model",
        body: "Data model and architecture first. Most bugs are decisions made here.",
      },
      {
        step: "03",
        title: "Build",
        body: "Shipped in slices you can use, with tests on the money paths.",
      },
      {
        step: "04",
        title: "Hand over",
        body: "Documented, backed up, restorable. Your team can run it without me.",
      },
    ],
  },

  about: {
    kicker: "About",
    heading: "Engineer first. Teacher because of it.",
    facts: [
      { label: "Based in", value: "Egypt · working across MENA" },
      { label: "Languages", value: "Arabic · English" },
      { label: "Handle", value: "@josamcode" },
      { label: "Response", value: "Within two working days" },
    ],
    paragraphs: [
      "I build software for clients who need a system, not a website. An accounting platform that a Gulf company closes its books on. A church platform holding 6,400 members' records with backups that have actually been restored. A publishing tool I run my own content through.",
      "The pattern in all of it is the same: understand the business rules properly, model the data carefully, and treat production as something people depend on. Most of what goes wrong in software was decided long before anyone opened an editor.",
      "I teach from that work — in Arabic, for beginners who want to understand how real systems are put together, not how to follow along with a tutorial. Everything I explain is something I have shipped and had to maintain.",
    ],
    notFitLabel: "Not a fit for",
    notFitBody:
      "Landing-page work, throwaway prototypes, or projects where nobody can answer how the business actually operates. I do my best work where the rules are real and the consequences are too.",
  },

  teaching: {
    kicker: "Teaching",
    heading: "Arabic lessons pulled straight out of client work.",
    // {handle} is rendered inside a <bdi> so the Latin handle keeps its
    // direction when the surrounding sentence is Arabic.
    note: "Same handle everywhere: {handle}. No course funnels — just the reasoning behind decisions I had to make for real.",
    handle: "@josamcode",
    channels: [
      {
        key: "youtube",
        name: "YouTube",
        body: "Long-form walkthroughs of real systems",
      },
      { key: "tiktok", name: "TikTok", body: "One decision, one minute" },
      { key: "instagram", name: "Instagram", body: "Carousels & breakdowns" },
      { key: "github", name: "GitHub", body: "Code and open work" },
    ],
  },

  contact: {
    kicker: "Contact",
    heading: "Tell me what the system has to do.",
    paragraph:
      "A paragraph about the business problem is more useful than a spec. I reply within two working days, and I will tell you plainly if I am not the right person for it.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    form: {
      name: "Name",
      company: "Company",
      email: "Email",
      kind: "What kind of work",
      message: "The problem",
      messagePlaceholder:
        "What happens today, who it slows down, and what it should do instead.",
      optional: "optional",
      submit: "Send it",
      sending: "Sending…",
      sent: "Sent — I will reply within two working days.",
      error:
        "That did not go through. Email me directly at josamcode@gmail.com.",
      note: "No newsletter, no follow-up sequence.",
      options: [
        "Business / accounting system",
        "Multi-tenant SaaS platform",
        "Arabic-first or RTL product",
        "Performance, database or recovery work",
        "Something else",
      ],
      validation: {
        name: "Tell me your name.",
        email: "That email does not look right.",
        message: "A couple of sentences about the problem, please.",
      },
    },
  },

  caseStudy: {
    backToWork: "All work",
    inThisCase: "In this case",
    role: "Role",
    year: "Year",
    stack: "Stack",
    overview: "Overview",
    results: "Results",
    nextCase: "Next case",
    readNext: "Read next",
    shareLabel: "Share",
    heroCaption: "Interface preview",
  },

  footer: {
    tagline: "Systems for businesses that have to keep running.",
    columnsWork: "Work",
    columnsElsewhere: "Elsewhere",
    columnsSite: "Site",
    rights: "All rights reserved.",
    builtWith: "Built with Next.js",
    backToTop: "Back to top",
  },

  notFound: {
    code: "404",
    heading: "That page does not exist.",
    body: "The link may be old, or the page may have moved. The work is still here.",
    cta: "Back to home",
    secondary: "See the work",
  },

  common: {
    loading: "Loading",
    new: "New",
    live: "Live",
  },
};

export type Dictionary = typeof en;
