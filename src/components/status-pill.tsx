import type { MilestoneStatus } from "@/lib/roadmap";

const styles: Record<MilestoneStatus, string> = {
  shipped: "border-go/40 bg-go/10 text-go",
  partial: "border-hazard/40 bg-hazard/10 text-hazard",
  next: "border-chalk/25 bg-chalk/5 text-chalk",
  planned: "border-line bg-lot-800 text-chalk-faint",
};

const labels: Record<MilestoneStatus, string> = {
  shipped: "Shipped",
  partial: "Partial",
  next: "Up next",
  planned: "Planned",
};

export function StatusPill({
  status,
  className = "",
}: {
  status: MilestoneStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${styles[status]} ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {labels[status]}
    </span>
  );
}