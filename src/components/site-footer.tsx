import Link from "next/link";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line/70">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-[5px] border border-hazard/50 bg-hazard/10 font-mono text-xs font-bold text-hazard">
                P
              </span>
              <span className="text-sm font-semibold text-chalk">
                {site.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-chalk-faint">
              A living record of a game being built — the decisions, the dead ends,
              and the bugs that only showed up when two systems met.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="label text-chalk-faint">Site</p>
              <ul className="mt-4 space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-chalk-dim transition-colors hover:text-hazard"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-chalk-faint">Elsewhere</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={site.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-chalk-dim transition-colors hover:text-hazard"
                  >
                    Source
                  </a>
                </li>
                <li>
                  <span className="text-sm text-chalk-faint">
                    {site.engine}
                  </span>
                </li>
                <li>
                  <span className="text-sm text-chalk-faint">
                    {site.language}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-chalk-faint">
            {/* Hardcoded: new Date() is rejected during prerender (cacheComponents). */}
            © 2026 {site.name}
          </p>
          <p className="font-mono text-[11px] text-chalk-faint">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}