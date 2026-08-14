import Link from "next/link";
import { href, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content";
import { getProjects } from "@/content/projects";
import { site, socialList } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const projects = getProjects(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line-2 bg-bg-2">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-8 lg:py-20">
        <Reveal>
          <Link
            href={href(locale)}
            className="font-display text-xl font-semibold tracking-tight text-txt"
          >
            Jo Sam Code<span className="text-accent">.</span>
          </Link>
          <p className="mt-4 max-w-[32ch] text-[15px] leading-relaxed text-muted">
            {dict.footer.tagline}
          </p>
          <a
            href={`mailto:${site.person.email}`}
            className="mono link-wipe mt-6 inline-block text-[12.5px] tracking-[0.04em] text-accent"
          >
            {site.person.email}
          </a>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="label text-[10.5px] text-dim rtl:text-[13px]">
            {dict.footer.columnsWork}
          </h2>
          <ul className="mt-5 space-y-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={href(locale, `/work/${project.slug}`)}
                  className="link-wipe text-[15px] text-body-2 transition-colors hover:text-txt"
                >
                  {project.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={href(locale, "/work")}
                className="link-wipe text-[15px] text-accent"
              >
                {dict.work.viewAll}
              </Link>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.12}>
          <h2 className="label text-[10.5px] text-dim rtl:text-[13px]">
            {dict.footer.columnsSite}
          </h2>
          <ul className="mt-5 space-y-3">
            {(["services", "about", "teaching", "contact"] as const).map((id) => (
              <li key={id}>
                <Link
                  href={`${href(locale)}#${id}`}
                  className="link-wipe text-[15px] text-body-2 transition-colors hover:text-txt"
                >
                  {dict.nav[id]}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.18}>
          <h2 className="label text-[10.5px] text-dim rtl:text-[13px]">
            {dict.footer.columnsElsewhere}
          </h2>
          <ul className="mt-5 space-y-3">
            {socialList.map((social) => {
              const channel = dict.teaching.channels.find((c) => c.key === social.key);
              return (
                <li key={social.key}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="link-wipe text-[15px] text-body-2 transition-colors hover:text-txt"
                  >
                    {channel?.name ?? social.key}
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-line-2">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6">
          <span className="mono text-[11px] tracking-[0.08em] text-dim-2" dir="ltr">
            josamcode.com · @{site.person.handle} · {year}
          </span>
          <span className="label-plain text-[11px] text-dim-2 rtl:text-[12.5px]">
            {dict.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  );
}
