---
title: "Restructuring into Game/"
date: "2026-11-11"
summary: "The Godot project moved into its own folder, leaving the repository root for documentation. The tricky part was deciding what counts as project versus what counts as repository."
tags: ["structure", "tooling"]
status: "shipped"
---

The repository had accumulated two kinds of thing in one flat directory: the Godot
project, and the documentation *about* the project.

That works right up until you want to open the folder in Godot, at which point the
engine sees a project root that is full of markdown files it does not care about.

## The split

```
Valet/                    ← repo root
├── AGENTS.md
├── README.md
├── DEV_PLAN.md
├── CI-CLINE-SETUP.md
├── Game/                 ← Godot project root
│   ├── project.godot
│   ├── main.tscn
│   ├── icon.png
│   ├── scripts/
│   └── scenes/
└── .gitignore
```

The rule I used: **if the engine needs it, it goes in `Game/`. If a human reads it, it
stays at the root.**

## What deliberately did not move

**`AGENTS.md` stayed at the root.** Agent tooling discovers instructions by walking up
from the working directory looking for `AGENTS.md`. Burying it inside `Game/` would
mean the agent silently stops reading the design document.

**`.gitignore` stayed at the root.** A `.gitignore` only applies to its own directory
and below. Moving it into `Game/` would leave the root unguarded.

**`.idea/` stayed at the root.** Rider's project config points at the repository, not
at the Godot project. Moving it would make Rider open the wrong directory.

## The part that could have gone wrong

`git mv` preserves history. A plain `mv` followed by `git add` would have recorded the
whole thing as delete-plus-add, and `git log --follow` would have lost the trail.

After the move, `git status` showed `R` for every file — rename detected, history
intact.

## One loose end

`.godot/` is generated. It now lives at `Game/.godot/` instead of the repo root. The
root `.gitignore` uses `.godot/`, which git matches at any depth, so it is still
ignored without any change.