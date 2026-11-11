import type { Metadata } from "next";
import { phases, progress, type MilestoneStatus } from "@/lib/roadmap";
import { StatusPill } from "@/components/status-pill";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "The full milestone plan for Valet Overdrive — five phases, 21 milestones, tracked against the code.",
};

const counts: Record<MilestoneStatus, number> = {
  shipped: 0,
  partial: 0,
  next: 0,
  planned: 0,
};

for (const phase of phases) {
  for (const m of phase.milestones) counts[m.status] += 1;
}

const summary = [
  { label: "Shipped", value: counts.shipped, tone: "text-go" },
  { label: "Partial", value: counts.partial, tone: "text-hazard" },
  { label: "Up next", value: counts.next, tone: "text-chalk" },
  { label: "Planned", value: counts.planned, tone: "text-chalk-faint" },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
      <header className="max-w-2xl">
        <p className="label text-hazard">Plan of record</p>
        <h1 className="display mt-4 text-4xl text-chalk sm:text-5xl">Roadmap</h1>
        <p className="mt-6 text-lg leading-relaxed text-chalk-dim">
          {progress.total} milestones across five phases. The status here is the status
          in the repository — not a projection, not a wish.
        </p>
      </header>

      {/* Summary strip */}
      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="bg-lot-900 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-chalk-faint">
              {s.label}
            </p>
            <p className={`mt-2 text-2xl font-semibold ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-chalk-faint">
          <span>Overall</span>
          <span className="text-chalk-dim">{progress.percent}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-lot-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-hazard-deep to-hazard"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="mt-16 space-y-14">
        {phases.map((phase) => {
          const done = phase.milestones.filter(
            (m) => m.status === "shipped",
          ).length;
          return (
            <section key={phase.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line/70 pb-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-hazard-deep">
                    PHASE {phase.id}
                  </span>
                  <h2 className="text-xl font-semibold tracking-tight text-chalk">
                    {phase.name}
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-chalk-faint">
                  {done}/{phase.milestones.length} done
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-chalk-dim">
                {phase.summary}
              </p>

              <ul className="mt-6 divide-y divide-line/60 overflow-hidden rounded-xl border border-line bg-lot-900">
                {phase.milestones.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start justify-between gap-4 p-5 transition-colors hover:bg-lot-850"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[11px] text-hazard-deep">
                          {m.id}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            m.status === "planned"
                              ? "text-chalk-dim"
                              : "text-chalk"
                          }`}
                        >
                          {m.name}
                        </span>
                      </div>
                      <p className="mt-1.5 pl-9 text-xs text-chalk-faint">
                        {m.note ?? m.focus}
                      </p>
                    </div>
                    <StatusPill status={m.status} className="mt-0.5" />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-16 rounded-xl border border-dashed border-line bg-lot-900/60 p-6 text-center text-sm text-chalk-dim">
        The game and this page share a source of truth. When a milestone ships in the
        engine, it ships here.
      </p>
    </div>
  );
}