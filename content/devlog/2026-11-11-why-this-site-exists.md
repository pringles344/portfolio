---
title: "Why this site exists"
date: "2026-11-11"
summary: "A game is a bad portfolio piece on its own. A game with its decisions documented is a good one."
tags: ["meta", "portfolio"]
status: "shipped"
---

A finished game tells you almost nothing about whether someone can build software. It
tells you the software works. It does not tell you how the decisions were made, what
was tried and abandoned, or what the tradeoffs were.

This site is the record of the second thing.

## The premise

Every entry here is written from something that actually happened during development.
Not a retrospective invented afterwards — a note taken while the problem was still
open.

That constraint is what makes it useful. It is easy to write a confident post-mortem
about a bug you already fixed. It is harder, and more honest, to write down what you
believed at the time and what turned out to be wrong.

## What gets documented

**Wrong turns.** The `AStar2D` pathfinder could never have worked, because `AStar2D`
keys points by integer. That is not a subtle bug, it is a category error. It is worth
writing down precisely because it is embarrassing.

**Silent failures.** The grid resize that discarded every hazard's weight. Nothing
errored. The game just quietly became wrong. Those are the bugs that matter.

**Tooling friction.** The `._*` files that made every git command print four errors.
Small, dumb, and the kind of thing that makes you distrust your own environment.

**Things the documentation got wrong.** A design doc that described a Python project,
an "isometric" game that was not isometric, a milestone count that did not match the
milestones.

## What it is not

It is not a changelog. Changelogs say what changed. This says why, and what it cost.

It is not a tutorial. If you want to know how to use `AStarGrid2D`, the Godot docs are
better than anything here.

## Living document

The roadmap page is generated from the same milestone list the game is built against.
As milestones ship, the status changes here. When the status changes, the reasoning
behind it gets an entry.

The intent is that by the time the game is done, the interesting artifact is not the
game. It is the record of building it.