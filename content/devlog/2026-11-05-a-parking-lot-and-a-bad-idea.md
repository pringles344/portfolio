---
title: "A parking lot, a turn counter, and a bad idea"
date: "2026-11-05"
summary: "Valet Overdrive starts as a Godot project with four scripts and a design doc that describes a much bigger game."
tags: ["origin", "godot", "design"]
status: "shipped"
---

The pitch was one sentence: *Into the Breach meets Balatro, but you are running a
parking lot.* Turn-based, tile-by-tile, 3 energy per turn, 10 turns per shift.

That sentence is doing a lot of work. It implies a tactical grid puzzle, a roguelike
run structure, a scoring system with multipliers, and a presentation layer that
celebrates every scoring event. None of that is small.

## What got written first

The project started with a design document before a single line of code. Two documents,
actually — `AGENTS.md` as the living spec and `DEV_PLAN.md` as a granular breakdown of
21 milestones across five phases.

Then came the first four scripts:

- `signal_bus.gd` — a global event bus so managers never reference each other directly
- `turn_manager.gd` — the 3 ⚡ / 10 turn economy
- `pathfinder_manager.gd` — grid navigation for the cars
- `map_tilemap.gd` — the tile grid itself

## The plan

The design leans on a few ideas that are cheap to describe and expensive to build:

**Procedural autotiling.** Place a wall next to a wall and they merge into one
continuous surface. Place three in an L and you get a corner. No manual art
authoring per configuration — the TileSet's bitmask rules handle it.

**A dynamic grid.** The lot starts at 6×6 and grows as the player buys more asphalt.
Everything — rendering, pathfinding, occupancy — has to tolerate the grid changing
size underneath it.

**Hazards as pathfinding inputs, not decoration.** A pothole isn't an image, it's a
weight multiplier. An oil spill isn't an animation, it's a forced slide. The level
design and the navigation graph are the same object.

That last one is the thesis of the whole design. If hazards are only visual, they are
set dressing. If they are weights in the search graph, they are decisions.

## Where it stopped

By the end of the first session the scripts existed, but nothing ran. The design
document described a game that was several weeks of work away, and the code described
a game that would not parse. That gap is what the next few entries are about.