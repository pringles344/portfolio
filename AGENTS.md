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

Must pass. Takes about a dozen seconds.

**Where things live:**

| Path | What |
|---|---|
| `content/devlog/*.md` | Dev log entries. One file per entry. |
| `content/design/design-doc.md` | The design document. |
| `src/lib/roadmap.ts` | Milestone data, mirrors the game repo. |
| `/Volumes/PRITOMUSB/RiderData/skills/portfolio-content/` | The workflow for adding entries. |

**Standing gotchas:**

- `new Date()` is rejected during prerender. Hardcode values.
- The volume was exFAT until 2026-11-16 and is now APFS. The AppleDouble `._*` problems
  described in the older dev log entries are historical — there is no cleanup step
  anymore, and `predev`/`prebuild` have been removed.
- ESLint is 10.x. `eslint-plugin-react`, `eslint-plugin-import`, and
  `eslint-plugin-jsx-a11y` still declare a `<=9` peer range, so `npm ci` prints
  `ERESOLVE overriding peer dependency` warnings. This is expected — the TS,
  `react-hooks`, `jsx-a11y`, and `@next/next` rules all pass under 10. Do not downgrade
  ESLint to silence the warnings.

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

Always go through npm, so the scripts in `package.json` stay the documented entry points.

## Environment note

The repo lives on an APFS volume (`/Volumes/PRITOMUSB`), reformatted from exFAT on
2026-11-16. The `._*` AppleDouble files that used to corrupt `.git/objects/pack/` and
`.next/cache/turbopack/` are no longer created, so the old
`find . -name '._*' -delete` cleanup and the `predev`/`prebuild` hooks are gone.

Measured on this volume with a warm npm cache:

| Step | Time |
|---|---|
| `npm ci` (22,821 files, 472 MB) | ~10 s |
| `npm run build` | ~12 s |

Node is not in this repo: it lives at `/Volumes/PRITOMUSB/RiderData/nodejs/bin`
(Node 26, npm 12) and is not on PATH in non-interactive shells.