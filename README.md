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

## Storage note

The repo lives on an APFS volume at `/Volumes/PRITOMUSB`. Until 2026-11-16 it was
exFAT, which caused two failures that are written up in the dev log:

**Git pack reads.** `._*` AppleDouble files inside `.git/objects/pack/` made every git
command print `non-monotonic index`.

**Next's build cache.** Turbopack names its cache files numerically (`00000001.sst`),
and `._00000001.sst` failed to parse as a number:

```
Failed to open database
  Loading persistence directory failed
  invalid digit found in string
```

APFS does not create those files, so the `predev` and `prebuild` cleanup hooks were
removed from `package.json` and the `._*` ignore rule was dropped from `.gitignore`.

Measured on the current volume: `npm ci` ~10 s (22,821 files, 472 MB), `npm run build`
~12 s. The same install took 10 minutes on exFAT.