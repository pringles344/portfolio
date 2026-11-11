# Valet Overdrive — dev log

The portfolio site and living development record for **Valet Overdrive**, a turn-based
2D valet parking puzzle game built in Godot 4.7.

The game lives in a separate repository; this site documents it.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4**
- Markdown content rendered with `react-markdown` + `remark-gfm`
- Deployed on **Vercel**

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Content

Everything that renders is a file in this repo.

| Path | What it is |
|------|-----------|
| `content/devlog/*.md` | Dev log entries. Frontmatter: `title`, `date`, `summary`, `tags`, `status` |
| `content/design/design-doc.md` | The design document |
| `src/lib/roadmap.ts` | Milestones and their status |

To add an entry, drop a `.md` file in `content/devlog/` with frontmatter:

```md
---
title: "Something worth writing down"
date: "2026-11-12"
summary: "One or two sentences for the card and the meta description."
tags: ["godot", "debugging"]
status: "shipped"
---

Body in Markdown.
```

It appears on `/devlog` and the home page automatically. No route files to touch.

## Structure

```
content/
  devlog/           # dated entries
  design/           # design document
src/
  app/
    page.tsx        # home
    devlog/         # index + [slug]
    roadmap/
    design/
  components/       # header, footer, cards, markdown
  lib/
    content.ts      # frontmatter parsing + post queries
    roadmap.ts      # milestone data
    site.ts         # site config
```

## Note on the exFAT volume

This repo lives on an exFAT volume, so macOS writes `._*` AppleDouble resource-fork
files alongside every file. Two things break because of it.

**Git pack reads.** If `._*` files land inside `.git/objects/pack/`, every git command
prints `non-monotonic index`. Clean with:

```bash
find . -name '._*' -delete
```

**Next's build cache.** Turbopack names its cache files numerically (`00000001.sst`),
and `._00000001.sst` fails to parse as a number:

```
Failed to open database
  Loading persistence directory failed
  invalid digit found in string
```

One build produces ~400 of these in `.next/`. The `predev` and `prebuild` scripts in
`package.json` delete them before every run, so `npm run dev` and `npm run build` work
without manual intervention. If you ever run `next build` directly instead of through
npm, clear the cache first:

```bash
find .next -name '._*' -delete
```

Measured on this volume: `npm install` 10 minutes (one-time, travels with the drive),
`npm run build` 14 seconds.