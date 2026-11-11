---
title: "Valet Overdrive — design document"
summary: "The game design document, distilled from the repository's AGENTS.md."
---

## Overview

**Valet Overdrive** is a turn-based, 2D tile-based valet parking puzzle game built in
Godot 4.7. You build a parking lot tile by tile, park arriving cars, and drive them out
again before their patience expires.

The pitch: *Into the Breach meets Balatro.*

## The core loop

1. **Expand the lot.** Place tiles. The TileMap autotiles them against their neighbours.
2. **Park cars.** Each driving action costs 1 ⚡.
3. **Navigate hazards.** Potholes slow you, oil spills slide you, hydrants fine you.
4. **End the shift.** The Audit Sweep scores parked tips by row multiplier.
5. **Spend the tips.** Upgrade energy, expand the grid, buy items.

## Turn economy

| Rule | Value |
|------|-------|
| Energy per turn | 3 ⚡ |
| Turns per shift | 10 |
| Cost of any driving action | 1 ⚡ |
| End turn | Refill to 3, decay patience by 1, advance turn |
| Ending turn 10 | Triggers the Audit Sweep |

Patience pips start at 10 and decay by one each turn. A car that runs out of patience
is a stranded car, and a stranded car is a penalty.

## Scoring

```
Total = (Parked Base Tips × Row Multiplier) + Special Tile Bonuses
        + Completed Delivery Bonuses − Penalties
```

**Row multipliers:** row 0 = 1×, row 1 = 1.5×, row 2 = 2×.

**Special tiles:** EV chargers grant +50%.

**Penalties:** hydrant violation −£15, stranded aisle car −£10.

## The tile grid

- Engine: `TileMapLayer` (`TileMap2D` was removed in Godot 4.7)
- Tile size: 76 × 38 pixels
- Autotiling: `TileSet` bitmask rules, so adjacent walls merge and corners form
- Grid starts at 6 × 6 and grows as the player buys more asphalt

### Tile types

| Tile | Behaviour |
|------|-----------|
| Road | Drivable surface |
| Wall | Impassable barrier |
| Curb | Decorative border |
| Oil spill | Forces a slide one tile in the direction of travel |
| Pothole | Raises pathfinding weight to 3.0 |
| Hydrant | Parking adjacent is a violation |
| Car | Occupied — blocks pathfinding |

## Pathfinding

Built on `AStarGrid2D`, not `AStar2D`. `AStar2D` keys points by `int`; the game thinks
in `Vector2i` cells, and `AStarGrid2D` is cell-native.

- 4-neighbour movement, Manhattan heuristic, no diagonals
- Blocked cells are marked solid
- Hazard cells get a raised weight scale
- `expand_grid()` grows the region and re-applies every solid flag and weight, because
  the engine's `update()` discards them

## Vehicles

| Type | Footprint |
|------|-----------|
| Sedan | 1 × 1 |
| Limo | 1 × 2 |
| Truck | 2 × 2 |

Cars move tile by tile along an A* path at 320 world units per second.

## Signals

A single autoload (`SignalBus`) carries every cross-system event:

- `energy_changed(current, maximum)`
- `turn_ended(turn)`
- `patience_decayed(remaining_pips)`
- `trigger_row_sweep(row_index)`
- `shift_ended()`
- `ui_toast(message)`

Managers never reference each other directly. They emit, and whoever cares listens.

## Design principles

**Hazards are weights, not decoration.** If a pothole is only an image, it is set
dressing. If it is a multiplier in the search graph, it is a decision.

**Scarcity creates pressure, not timers.** Three energy per turn means every move is a
choice about what not to do.

**The lot is the level.** There is no authored maze. The player draws the maze by
deciding where the asphalt goes.

---

*Source of truth: `AGENTS.md` in the game repository. This page is a presentation
layer over that document.*