import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Dev log",
  description:
    "Every wrong turn, silent failure and design decision from building Valet Overdrive.",
};

export default function DevlogIndex() {
  const posts = getAllPosts();

  const byDate = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = post.date.slice(0, 4);
    (acc[year] ??= []).push(post);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
      <header className="max-w-2xl">
        <p className="label text-hazard">Living document</p>
        <h1 className="display mt-4 text-4xl text-chalk sm:text-5xl">Dev log</h1>
        <p className="mt-6 text-lg leading-relaxed text-chalk-dim">
          Notes taken while the problem was still open. Wrong turns, silent failures,
          and the reasoning behind decisions that later turned out to be wrong.
        </p>
      </header>

      <div className="mt-14 space-y-14">
        {Object.entries(byDate)
          .sort((a, b) => (a[0] < b[0] ? 1 : -1))
          .map(([year, yearPosts]) => (
            <section key={year}>
              <div className="flex items-center gap-4">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-chalk-faint">
                  {year}
                </h2>
                <div className="h-px flex-1 bg-line/70" />
                <span className="font-mono text-[11px] text-chalk-faint">
                  {yearPosts.length}{" "}
                  {yearPosts.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              <div className="mt-6 grid gap-5">
                {yearPosts.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            </section>
          ))}
      </div>

      <div className="mt-16 rounded-xl border border-dashed border-line bg-lot-900/60 p-8 text-center">
        <p className="text-sm text-chalk-dim">
          This page grows as the game does. New entries appear as milestones ship.
        </p>
        <Link
          href="/roadmap"
          className="mt-4 inline-block text-sm font-medium text-hazard hover:underline"
        >
          See what is coming next →
        </Link>
      </div>
    </div>
  );
}