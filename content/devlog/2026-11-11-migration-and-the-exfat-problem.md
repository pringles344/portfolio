---
title: "Migrating to Rider, and the exFAT problem"
date: "2026-11-11"
summary: "The project moved from VS Code to Rider. The move surfaced a corrupt git pack, 83 junk files, and a design document that had been contaminated by another project."
tags: ["tooling", "migration", "git"]
status: "shipped"
---

The first session lived in VS Code with the Cline extension. This one is Rider. The
code came across fine. The *repository* did not.

## The pack file that wasn't

The very first `git log` printed this, four times:

```
error: non-monotonic index .git/objects/pack/._pack-aad053921f925e688c0a388944aca3145cd6c126.idx
```

Nothing was actually corrupt. The project lives on an exFAT volume, and macOS stores
resource forks for files on exFAT as `._*` companion files. A copy operation had
dragged three of those into `.git/objects/pack/`, where git tried to read them as pack
indexes.

`git fsck` was clean. Every normal command worked. But every command *also* printed
four errors, which is the kind of thing that makes you distrust your own tooling.

Deleting the `._*` files fixed it. `git fsck` went silent.

## 83 files that shouldn't exist

The same copy operation left 83 `._*` files across the working tree — 32 in the
project, 51 in `.git`. They were already covered by `.gitignore`, so nothing had been
committed. They just made every `find` and `ls` noisier than it needed to be.

Worth noting for later: **these regenerate.** Any write to that volume produces a new
`._*` companion. They are harmless outside `.git/` and actively harmful inside it. The
cleanup command is now documented in the repo so it can be re-run.

## The design document was lying

`AGENTS.md` had a section titled "Source Code Files" listing:

```
src/ainvoke.py — Main entry point
src/card.py — Card class definition
src/effects.py — Effect logic
src/game.py — Game logic
src/ui.py — UI components
```

Along with `python src/main.py`, `pytest tests/`, a `config.json`, and a fork-and-PR
contributing guide.

This is a Godot game. There is no Python. Those lines were pasted from an unrelated
card-game template and never removed.

There was also a direct contradiction: `DEV_PLAN.md` said "isometric" in five places,
`AGENTS.md` said "2D mode (NOT isometric)" twice, and the code used a plain square
grid at 76×38 pixels.

Both were fixed. The docs are now internally consistent, and the milestone table
carries a real status column instead of a comment that says 20 milestones when there
are 21.

## What this taught me

A design document that nobody has reconciled against the code is worse than no design
document. It reads as authoritative, so you trust it, so you build the wrong thing.

The fix is cheap: a status column, a milestone count that matches, and a habit of
reading the doc against the source.