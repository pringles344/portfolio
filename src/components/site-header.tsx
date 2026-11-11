"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-lot-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid size-9 place-items-center rounded-[7px] border border-hazard/60 bg-hazard/10">
            <span className="font-mono text-sm font-bold text-hazard">P</span>
            <span className="absolute -right-px -top-px size-1.5 bg-hazard" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-chalk">
              Valet Overdrive
            </span>
            <span className="label mt-1 text-chalk-faint">Dev log</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-lot-800 text-chalk"
                    : "text-chalk-dim hover:bg-lot-850 hover:text-chalk"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={site.repo}
            target="_blank"
            rel="noreferrer"
            className="ml-1 hidden items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-chalk-dim transition-colors hover:border-chalk/30 hover:text-chalk sm:inline-flex"
          >
            <svg viewBox="0 0 16 16" className="size-4 fill-current" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.99 7.99 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            Source
          </a>
        </nav>
      </div>
      <div className="hazard-tape h-[3px] opacity-70" aria-hidden />
    </header>
  );
}