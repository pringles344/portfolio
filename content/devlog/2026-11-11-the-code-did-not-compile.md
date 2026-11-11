---
title: "The code did not compile"
date: "2026-11-11"
summary: "The first headless run produced 25 parse errors. Two of them were unfixable without changing engine API, and one revealed that a core class had been deleted from Godot entirely."
tags: ["godot", "debugging", "godot-4.7"]
status: "shipped"
---

Before touching anything, I ran the project headless:

```bash
Godot --headless --path . --quit
```

Godot printed 25 parse errors and then died on a runtime error. The scripts had never
been executed. Not once.

## The engine had moved on

The most interesting failure was in `map_tilemap.gd`:

```
extends TileMap2D
```

`TileMap2D` does not exist in Godot 4.7. It was deprecated in 4.3 in favour of
`TileMapLayer`, and then removed. I confirmed it with `ClassDB.class_exists()`:

```
TileMap2D exists: false
TileMapLayer exists: true
```

No amount of code fixing helps when the class is gone from the engine. The file had to
be rewritten against `TileMapLayer`.

## AStar2D cannot do what the code asked

`pathfinder_manager.gd` had roughly fifteen errors. They all reduced to one mistake:

```gdscript
astar.add_point(cell, Vector2(cell.x, cell.y))   # cell is Vector2i
```

`AStar2D` keys its points by **`int`**. The game thinks in `Vector2i` cells. There is
no version of this that works — every `add_point`, `has_point`, `get_point_path` call
was passing the wrong type.

The fix was to stop using `AStar2D` entirely and move to `AStarGrid2D`, which is
cell-native, takes a region, and supports per-cell solid flags and weight scales.
Those last two are exactly what the hazard system needs.

Three more errors fell out of the same file:

- `add_child(astar)` — `AStar2D` is `RefCounted`, not a `Node`. You cannot add it to
  the tree.
- `get_path()` overrides `Node.get_path()`. Godot treats the warning as an error. The
  method is now `find_path()`.
- `neighbor` was used without `var`, and `connect_points()` was called with four
  arguments when it takes three.

## The signal bus could not parse

```gdscript
signal ui_toast(message: string)
```

`string` is not a type. `String` is. One lowercase letter, and the entire event system
failed to load — which meant `turn_manager` could not find `energy_changed` at runtime,
even though its own code was fine.

That is the failure mode that wastes the most time. The error points at
`turn_manager.gd:16`, but the bug is in a file that `turn_manager` never mentions.

## What I changed about how I work

I stopped reading the code and started running it. A headless import plus a smoke test
that asserts actual behaviour found all of this in about ten minutes. Reading the same
files had not found any of it.