---
title: "Rebuilding on AStarGrid2D"
date: "2026-11-11"
summary: "The pathfinder was rewritten on a cell-native grid. The interesting part was not the rewrite — it was discovering that resizing the grid silently discarded all hazard data."
tags: ["godot", "pathfinding", "architecture"]
status: "shipped"
---

With `AStarGrid2D` the pathfinder became straightforward. Cells map directly to
`Vector2i` IDs, so the entire translation layer the old code needed simply disappears.

```gdscript
astar = AStarGrid2D.new()
astar.cell_shape = AStarGrid2D.CELL_SHAPE_SQUARE
astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_NEVER
astar.default_compute_heuristic = AStarGrid2D.HEURISTIC_MANHATTAN
```

Four-neighbour movement, Manhattan heuristic, no diagonals. That matches a parking lot:
you drive along aisles, not across them.

## The bug I almost shipped

The grid is dynamic. The player buys more asphalt and it grows. So `expand_grid()` has
to grow the `AStarGrid2D` region:

```gdscript
astar.region = Rect2i(0, 0, new_width, new_height)
astar.update()
```

`update()` rebuilds the internal graph. It does not preserve the solid flags or the
weight scales that were set on individual cells.

Which means: place a hazard, then expand the lot, and every hazard silently stops
affecting pathfinding. Cars start driving through potholes.

Nothing errors. Nothing warns. The game just quietly becomes wrong.

## The fix

Keep the state ourselves, and re-apply it after every resize:

```gdscript
var _solid: Dictionary = {}    # Vector2i -> bool
var _weights: Dictionary = {}  # Vector2i -> float

func _resize(new_width: int, new_height: int) -> void:
    grid_width = new_width
    grid_height = new_height
    astar.region = Rect2i(0, 0, grid_width, grid_height)
    astar.update()

    for point in _solid:
        if astar.is_in_boundsv(point):
            astar.set_point_solid(point, _solid[point])
    for point in _weights:
        if astar.is_in_boundsv(point):
            astar.set_point_weight_scale(point, _weights[point])
```

The engine's copy of the state is now a cache. Our dictionary is the source of truth.

I added a smoke test that asserts a blocked cell is still blocked after `expand_grid()`.
It passes. It would have failed before.

## Why this is worth a whole entry

This is the class of bug that survives code review, passes type checking, and looks
correct in the editor. It only appears when a specific sequence of gameplay events
happens in a specific order — buy a hazard, then buy asphalt.

The defence is not more careful reading. It is a test that names the sequence.