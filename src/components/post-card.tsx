import Link from "next/link";
import { formatDate, readingTime, type Post } from "@/lib/content";

const statusColor: Record<string, string> = {
  shipped: "text-go",
  "in-progress": "text-hazard",
  planned: "text-chalk-faint",
};

export function PostCard({ post, index }: { post: Post; index?: number }) {
  return (
    <Link
      href={`/devlog/${post.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-line bg-lot-900 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-hazard/40 hover:bg-lot-850"
    >
      <span
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hazard/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />

      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-center gap-3">
          {index !== undefined && (
            <span className="font-mono text-[11px] text-chalk-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <time className="font-mono text-[11px] uppercase tracking-[0.12em] text-chalk-faint">
            {formatDate(post.date)}
          </time>
        </div>
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.14em] ${statusColor[post.status] ?? "text-chalk-faint"}`}
        >
          {post.status}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-chalk transition-colors group-hover:text-hazard">
        {post.title}
      </h3>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-chalk-dim">
        {post.summary}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-line/60 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-line bg-lot-800 px-2 py-0.5 font-mono text-[10px] text-chalk-faint"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-chalk-faint">
          {readingTime(post.body)} min
        </span>
      </div>
    </Link>
  );
}