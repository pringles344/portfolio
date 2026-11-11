import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { progress, phases } from "@/lib/roadmap";
import { site } from "@/lib/site";
import { PostCard } from "@/components/post-card";

const stats = [
  { value: "3", unit: "⚡", label: "Energy per turn" },
  { value: "10", unit: "", label: "Turns per shift" },
  { value: "76×38", unit: "px", label: "Tile size" },
  { value: String(progress.total), unit: "", label: "Milestones planned" },
];

const pillars = [
  {
    title: "The lot is the level",
    body: "You do not drive through a designed maze. You buy asphalt one tile at a time and live with the shape it makes.",
  },
  {
    title: "Hazards are weights",
    body: "A pothole is not a picture. It is a multiplier in the search graph. The navigation mesh and the art are the same object.",
  },
  {
    title: "Every action is a decision",
    body: "Three energy, three moves, ten turns. The pressure comes from scarcity, not from a timer.",
  },
];

export default function Home() {
  const posts = getAllPosts();
  const latest = posts.slice(0, 3);
  const nextUp = phases
    .flatMap((p) => p.milestones.map((m) => ({ ...m, phase: p.name })))
    .filter((m) => m.status === "next" || m.status === "partial")
    .slice(0, 3);

  return (
    <>
      {/* --- Hero ------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-line/70">
        <div className="bay-lines pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-hazard/10 blur-[110px]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-28">
          <div className="rise">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-go/40 bg-go/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-go">
                <span className="size-1.5 animate-pulse rounded-full bg-go" aria-hidden />
                {site.status}
              </span>
              <span className="label text-chalk-faint">
                {site.engine} · Since {new Date(site.started).getFullYear()}
              </span>
            </div>

            <h1 className="display mt-8 text-[clamp(2.75rem,7vw,4.75rem)] text-chalk">
              Valet
              <br />
              <span className="text-hazard">Overdrive</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-chalk-dim">
              A turn-based parking puzzle about scarcity. You build the lot, you park
              the cars, and you try to get them out again before their patience runs
              out — on three energy a turn.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/devlog"
                className="inline-flex items-center gap-2 rounded-lg bg-hazard px-5 py-3 text-sm font-semibold text-lot-950 transition-transform hover:-translate-y-0.5"
              >
                Read the dev log
                <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-lot-900 px-5 py-3 text-sm font-medium text-chalk transition-colors hover:border-chalk/30 hover:bg-lot-850"
              >
                See the roadmap
              </Link>
            </div>
          </div>

          {/* Status board */}
          <div className="rise [animation-delay:120ms]">
            <div className="relative overflow-hidden rounded-xl border border-line bg-lot-900/90 shadow-2xl shadow-black/40">
              <div className="hazard-tape h-1.5 opacity-80" aria-hidden />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="label text-chalk-faint">Shift status</p>
                  <span className="font-mono text-[10px] text-chalk-faint">
                    PHASE {phases[0].id}
                  </span>
                </div>

                <p className="mt-4 text-2xl font-semibold tracking-tight text-chalk">
                  {phases[0].name}
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="display text-4xl text-hazard">
                      {progress.shipped}
                    </span>
                    <span className="display text-2xl text-chalk-faint">
                      /{progress.total}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-chalk-dim">
                    milestones shipped
                  </span>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-lot-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-hazard-deep to-hazard"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>

                <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line/70 pt-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-chalk-faint">
                        {s.label}
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-chalk">
                        {s.value}
                        {s.unit && (
                          <span className="ml-0.5 text-xs font-normal text-chalk-faint">
                            {s.unit}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Pillars ---------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="label text-hazard">The pitch</p>
        <h2 className="display mt-4 max-w-2xl text-3xl text-chalk sm:text-4xl">
          Three ideas the whole design hangs on
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="relative rounded-xl border border-line bg-lot-900 p-6"
            >
              <span className="font-mono text-[11px] text-hazard-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-chalk">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-chalk-dim">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Latest entries --------------------------------------------- */}
      <section className="border-y border-line/70 bg-lot-900/40">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-hazard">From the lot</p>
              <h2 className="display mt-4 text-3xl text-chalk sm:text-4xl">
                Latest entries
              </h2>
            </div>
            <Link
              href="/devlog"
              className="group inline-flex items-center gap-2 text-sm text-chalk-dim transition-colors hover:text-hazard"
            >
              All {posts.length} entries
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {latest.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Roadmap snapshot ------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="label text-hazard">Roadmap</p>
            <h2 className="display mt-4 text-3xl text-chalk sm:text-4xl">
              What is next
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-chalk-dim">
              Five phases, {progress.total} milestones. The list is the same one the
              game is built against — when something ships here, it shipped there.
            </p>
            <Link
              href="/roadmap"
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line bg-lot-900 px-5 py-3 text-sm font-medium text-chalk transition-colors hover:border-chalk/30 hover:bg-lot-850"
            >
              Full roadmap
            </Link>
          </div>

          <ul className="divide-y divide-line/70 overflow-hidden rounded-xl border border-line bg-lot-900">
            {nextUp.map((m) => (
              <li
                key={m.id}
                className="flex items-start justify-between gap-4 p-5 transition-colors hover:bg-lot-850"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-hazard-deep">
                      {m.id}
                    </span>
                    <span className="text-sm font-medium text-chalk">
                      {m.name}
                    </span>
                  </div>
                  <p className="mt-1.5 pl-9 text-xs text-chalk-faint">
                    {m.note ?? m.focus}
                  </p>
                </div>
                <span
                  className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    m.status === "partial"
                      ? "border-hazard/40 bg-hazard/10 text-hazard"
                      : "border-chalk/25 bg-chalk/5 text-chalk"
                  }`}
                >
                  {m.status === "partial" ? "Partial" : "Up next"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}