import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export type PostStatus = "shipped" | "in-progress" | "planned";

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  status: PostStatus;
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "devlog");

function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  body: string;
} {
  if (!raw.startsWith("---")) {
    return { data: {}, body: raw };
  }

  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: raw };
  }

  const head = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\s*\n/, "");
  const data: Record<string, string | string[]> = {};

  for (const line of head.split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const rawValue = line.slice(idx + 1).trim();

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      data[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }

  return { data, body };
}

function toPost(slug: string, raw: string): Post {
  const { data, body } = parseFrontmatter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? "1970-01-01"),
    summary: String(data.summary ?? ""),
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: (data.status as PostStatus) ?? "shipped",
    body,
  };
}

export function getAllPosts(): Post[] {
  let files: string[];
  try {
    files = readdirSync(CONTENT_DIR);
  } catch {
    return [];
  }

  return files
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      return toPost(slug, readFileSync(path.join(CONTENT_DIR, file), "utf8"));
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}