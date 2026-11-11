<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Valet Overdrive dev log — project rules

## Start Here

> **Session catch-up.** Last updated 2026-11-11.

**Live:** https://valet-overdrive-portfolio.vercel.app
**Vercel project:** `pringles1/valet-overdrive-portfolio`, connected to
`github.com/pringles344/portfolio`.

**State:** built, deployed, and verified. Four routes (`/`, `/devlog`, `/roadmap`,
`/design`) plus one static page per dev log entry. Six entries published. Pushing to
`main` auto-deploys.

**Verify before trusting any of the above:**

```bash
npm run build
```

Must pass. Takes about 15 seconds.

**Where things live:**

| Path | What |
|---|---|
| `content/devlog/*.md` | Dev log entries. One file per entry. |
| `content/design/design-doc.md` | The design document. |
| `src/lib/roadmap.ts` | Milestone data, mirrors the game repo. |
| `/Volumes/PRITOMUSB/RiderData/skills/portfolio-content/` | The workflow for adding entries. |

**Standing gotchas:**

- `new Date()` is rejected during prerender. Hardcode values.
- exFAT leaves `._*` files in `.next/cache/turbopack/`, which breaks the build cache.
  `predev` and `prebuild` clean them automatically.
- exFAT leaves `._*` files everywhere else too. `find . -name '._*' -delete` before
  committing.

## What this repo is

The portfolio site and living development record for **Valet Overdrive**, a turn-based
2D valet parking puzzle game built in Godot 4.7. The game lives in a **separate
repository** (`Valet/Game/`). This repo only documents it.

## Non-negotiables

- **Content is data, not code.** Adding a dev log entry must mean adding one file to
  `content/devlog/`. Never create a route by hand for a new entry.
- **The roadmap is the source of truth.** `src/lib/roadmap.ts` mirrors the game
  repository's milestone list. When a milestone ships in the engine, update it here in
  the same change.
- **Write from what actually happened.** Entries describe real decisions and real
  failures from the game's development. No invented post-mortems.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4,
`react-markdown` + `remark-gfm`. Deployed on Vercel.

## Conventions

- Server components by default. `"use client"` only where interactivity requires it
  (currently: `site-header.tsx`, for `usePathname`).
- Design tokens live in `src/app/globals.css` under `@theme`. Use the semantic names
  (`bg-lot-900`, `text-chalk-dim`, `text-hazard`) rather than raw hex in components.
- Route params are `Promise`-wrapped in this Next version — always `await params`.
- New dev log entry: frontmatter keys are `title`, `date` (ISO `YYYY-MM-DD`), `summary`,
  `tags` (array), `status` (`shipped` | `in-progress` | `planned`).

## Commands

```bash
npm run dev     # dev server
npm run build   # production build — must pass before committing
npm run lint    # eslint
```

Always go through npm. `predev` and `prebuild` strip the `._*` files that exFAT leaves
in `.next/`; running `next build` directly will hit `invalid digit found in string`.

## Environment note

This repo sits on an exFAT volume. macOS writes `._*` resource-fork files, which are
gitignored. Two consequences:

- Inside `.git/objects/pack/` they break pack reads with `non-monotonic index`.
- Inside `.next/cache/turbopack/` they break the build cache, because Turbopack parses
  cache filenames as numbers. One build creates ~400 of them.

Clean up with:

```bash
find . -name '._*' -delete
```