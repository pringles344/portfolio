---
title: "Valet Overdrive — design document"
summary: "The game design document, distilled from the repository's AGENTS.md."
---

## Overview

**Valet Overdrive** is a turn-based, 2D valet parking puzzle game built in Godot 4.7.
You shape an empty plot with multi-cell **modules**, park arriving cars, and retrieve them
again before the shift clock runs out — then score the shift and spend the takings.

The pitch: *Into the Breach meets Balatro.*

## The core loop

1. **Shape the lot.** Place multi-cell modules (stall banks, crossings, planters, kerb
   runs) on an empty plot. Module edges autotile against whatever they touch.
2. **Park cars.** Drive from the entrance to a stall. The action costs minutes scaled by
   path length, so a stall near the door is cheap and a far one is expensive.
3. **Navigate hazards.** Potholes slow you, oil spills slide you, hydrants fine you.
4. **End the shift.** The Audit Sweep scores the lot Balatro-style, zone by zone, against
   the day's quota.
5. **Spend the takings.** Buy modules and trinkets, upgrade the lot, and hit a quota
   every 7th day.

## The shift clock

The old 3 ⚡ / 10 turns economy is **superseded**. A shift is one continuous clock.

| Rule | Value |
|------|-------|
| Clock | One continuous bar, not a per-turn pool |
| Action cost | Minutes scaled by path length |
| Day / night split | At 50% of the clock |
| End of shift | Clock runs out, or the player calls it |
| Failure | Running out of clock ends the shift; it does not fail the run |
| Turn pacing | ~4 actions per turn, enforced by the clock manager |

Distance is the cost. A stall four cells from the door is cheap to reach; one across the
lot is expensive. Layout quality stops being cosmetic and becomes mechanical.

## Scoring

```
Total = Chips × Lot Mult × Trinket Mult
```

**Chips** accumulate live during the shift — base value by car type, plus adjacency
bonuses. They are *pending* on park and *realised* on retrieve.

**Lot Mult** is spatial and always on. It is derived from the lot itself, not from a
bonus table.

**Trinket Mult** detonates last. Trinkets are jokers with charges, and their recharge
rules are deliberately heterogeneous.

Zones — EV, family, disabled — are **derived** by flood-filling contiguous stalls that
share a modifier. Scoring walks zones, not tiles.

The audit sequence: chips tick up → the sweep walks zone by zone applying Lot Mult →
chain multipliers slam in → Trinket Mult detonates → the total collides with the quota bar.

## Modules and the plot

- The simulation stays grid-based (`AStarGrid2D`); cars move cell to cell.
- Freedom lives in the **placement unit**: the player places multi-cell modules, not
  single tiles.
- Module edges autotile against whatever they touch, using a 4-bit mask per edge. A stall
  bank resolves its own kerb against bare plot.
- Art is procedural: `Game/assets/tiles/gen_hotel.mjs` generates tiles,
  `render_map.mjs` composes test layouts. 76 × 38 native, 2.5D oblique register
  (Gen 5 Pokémon), albedo only — lighting is a map-level pass.

### Module catalogue (starting set)

| Module | Purpose |
|--------|---------|
| Stall bank (4 / 6 / 8) | The core parking capacity, in grades |
| Crossing | Pedestrian route across a drive aisle |
| Planter | Blocks a cell, shapes the flow |
| Kerb run | Edge treatment; autotiles against plot |

## Pathfinding

Built on `AStarGrid2D`, not `AStar2D`. `AStar2D` keys points by `int`; the game thinks
in `Vector2i` cells, and `AStarGrid2D` is cell-native.

- 4-neighbour movement, Manhattan heuristic, no diagonals
- Blocked cells are marked solid
- Hazard cells get a raised weight scale
- `expand_grid()` grows the region and re-applies every solid flag and weight, because
  the engine's `update()` discards them
- `path_length(from, to) -> int` is the basis for action cost

## Vehicles

| Type | Footprint |
|------|-----------|
| Sedan | 1 × 1 |
| Limo | 1 × 2 |
| Truck | 2 × 2 |

Cars move cell by cell along an A* path. Patience is per car; exhaustion is a walkout.

## Signals

A single autoload (`SignalBus`) carries every cross-system event:

- `clock_changed(elapsed, total)`
- `shift_phase_changed(phase)`
- `car_parked(car_id, stall_id)`
- `car_retrieved(car_id)`
- `chips_changed(running_total)`
- `patience_decayed(remaining_pips)`
- `trigger_zone_eval(zone_id)`
- `trigger_day_scored(day, total)`
- `quota_progress(total, quota)`
- `shift_ended()`
- `ui_toast(message)`

Managers never reference each other directly. They emit, and whoever cares listens.

## Design principles

**Hazards are weights, not decoration.** If a pothole is only an image, it is set
dressing. If it is a multiplier in the search graph, it is a decision.

**Distance is the cost.** A stall near the door is cheap; a far one is expensive. The
player is always trading travel time against capacity.

**The lot is the level.** There is no authored maze. The player draws the maze by
deciding where the modules go.

**Two currencies, never shared.** Stars carry across the week; tips are spent in the
shop. Mixing them would collapse two different decisions into one.

---

*Source of truth: `AGENTS.md` in the game repository. This page is a presentation
layer over that document.*