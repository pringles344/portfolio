import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  getAllPosts,
  getAllSlugs,
  getPost,
  readingTime,
} from "@/lib/content";
import { Markdown } from "@/components/markdown";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const newer = index > 0 ? posts[index - 1] : undefined;
  const older = index < posts.length - 1 ? posts[index + 1] : undefined;

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <Link
        href="/devlog"
        className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-chalk-faint transition-colors hover:text-hazard"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
          <path
            d="M13 8H3M7 4L3 8l4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Dev log
      </Link>

      <header className="mt-8 border-b border-line/70 pb-8">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-chalk-faint">
          <time>{formatDate(post.date)}</time>
          <span className="text-line">/</span>
          <span>{readingTime(post.body)} min read</span>
          <span className="text-line">/</span>
          <span className="text-go">{post.status}</span>
        </div>

        <h1 className="display mt-5 text-[clamp(2rem,5vw,3rem)] text-chalk">
          {post.title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-chalk-dim">
          {post.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-line bg-lot-800 px-2 py-0.5 font-mono text-[10px] text-chalk-faint"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-10">
        <Markdown>{post.body}</Markdown>
      </div>

      <nav className="mt-16 grid gap-3 border-t border-line/70 pt-8 sm:grid-cols-2">
        {older ? (
          <Link
            href={`/devlog/${older.slug}`}
            className="group rounded-lg border border-line bg-lot-900 p-5 transition-colors hover:border-hazard/40 hover:bg-lot-850"
          >
            <span className="label text-chalk-faint">← Earlier</span>
            <p className="mt-2 text-sm font-medium text-chalk group-hover:text-hazard">
              {older.title}
            </p>
          </Link>
        ) : (
          <span />
        )}

        {newer ? (
          <Link
            href={`/devlog/${newer.slug}`}
            className="group rounded-lg border border-line bg-lot-900 p-5 text-right transition-colors hover:border-hazard/40 hover:bg-lot-850"
          >
            <span className="label text-chalk-faint">Later →</span>
            <p className="mt-2 text-sm font-medium text-chalk group-hover:text-hazard">
              {newer.title}
            </p>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}