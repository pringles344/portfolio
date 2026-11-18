---
title: "The shift clock is one clock"
date: "2026-11-18"
summary: "M1.1 built the shift clock. The design was simple — cost and time-of-day are the same clock — but three parse errors and a wrong hand angle taught me to test the clock like machinery, not like UI."
tags: ["godot", "clock", "architecture", "testing"]
status: "shipped"
---

M1.1 was the heart of the clock-driven pivot: replace per-turn energy with one
continuous shift clock. The design had three parts.

1. **One clock.** Driving a car adds minutes to it. Cost and the displayed
   time-of-day are the same number. There is no separate "energy pool" and no
   separate "what time is it" — they are one value.
2. **A timeline of segments**, not a 50/50 day/night split: `MORNING_SHIFT` →
   `BREAK` → `EVENING_SHIFT`. `phase()` returns the current segment; you serve
   only in shift segments.
3. **Concurrency.** With `N` cars driving, the clock advances `N×` faster, so the
   combined drive cost still matches doing them serially. Concurrency serves more
   customers but burns the shift faster.

That last line — "the combined cost still matches" — is the whole mechanical point.
Layout quality becomes real: a stall near the door is cheap, a far one is expensive,
and serving many cars at once is a genuine trade, not a free action.

## The clock manager

The clock is a single float, `game_time`, in minutes, rolled forward by `advance()`:

```gdscript
func advance(minutes: float) -> float:
    if minutes <= 0.0:
        return game_time
    var previous_phase: int = phase()
    game_time = minf(game_time + minutes, total_minutes())
    if phase() != previous_phase:
        _emit_phase()
    _emit_clock()
    return game_time
```

`advance()` is the single mutation point for the clock, so segment rolling and signal
emission live in one place. `is_exhausted()` ends the shift — it does **not** fail the
run. Running out of clock just ends the shift; the only loss state is the day-7 quota.

Concurrency rides on top of that. Cars register their drive, and `_process` scales the
advance by how many are in flight:

```gdscript
func _process(delta: float) -> void:
    if active_drives > 0:
        advance(delta * active_drives * minutes_per_second_per_drive)
```

`minutes_per_second_per_drive` is a placeholder. M1.2 ties it to path length.

## Three parse errors, one at a time

The design was the easy part. The engine made me earn it.

**1. A name I gave away.** I wrote `class_name ClockManager`, then registered the
autoload under the same name in `project.godot`. Godot rejected it outright:

```
SCRIPT ERROR: Parse Error: Class "ClockManager" hides an autoload singleton.
```

A `class_name` and an autoload singleton share a global namespace. I dropped the
`class_name` and have `clock_ui.gd` look the autoload up by path instead. Lesson: don't
reuse an autoload's name as a class name.

**2. `%` is for integers only.** I wrote the minute hand as `game_time % 60.0`. In
GDScript `%` only accepts integers, so four lines failed identically:

```
SCRIPT ERROR: Invalid operands "float" and "float" for "%" operator.
```

Floats need `fmod()`. That was three of the four. The fourth was in the hour hand,
which had a real logic bug, not a syntax one:

```gdscript
// wrong: (t/60)*30 already includes the fractional hour, so this double-counts
fmod(game_time / 60.0, 12.0) * 30.0 + fmod(game_time, 60.0) * 0.5
```

The hour hand is just `(t / 60) * 30` degrees, continuously. At 1:30 it sits halfway
between 1 and 2 — the formula already accounts for that half hour; adding the minutes
again pushed it a sixth of the way to 2.

**3. A dropped block.** The first write of the file silently left out the startup
phase broadcast, so `_ready()` called a method that wasn't there:

```
SCRIPT ERROR: Parse Error: Function "_roll_phase()" not found in base self.
```

I rewrote the file rather than patch it, and stopped trusting that a successful write
meant the file was complete.

## Testing the clock like machinery

The analogue face is proof-of-display — two hands and a digital readout. But a clock is
exactly the kind of thing that looks right and is wrong, so I wrote a headless test that
treats it as machinery:

```bash
godot --headless --path Game --script /tmp/clock_test.gd
```

Twenty-two assertions. Segment rolling (`advance(180)` lands in `BREAK`, `advance(60)`
more lands in `EVENING_SHIFT`). Exhaustion and clamping at the shift total. The
`clock_string()` readout at several times. The hand angles at 0, 90 and 150 minutes —
where I had to be careful: at 1:30 the minute hand is at 180°, not 0, because
`90 % 60 == 30`. And the concurrency multiplier (`N` drives → `N×`, floored at `1×`).

All green. The test costs nothing to run and names exactly the behavior that would have
been wrong.

## Why this entry is worth writing

The clock is the thing the whole milestone hangs on, and every bug was the same kind:
correct-looking, silent, and only wrong under a specific input. A hand angle that's off
by a sixth of an hour doesn't error. A `%` on a float is a parse error you read past
because you expected syntax, not semantics.

The defence is the same one from the `AStarGrid2D` rebuild: a test that names the exact
value — `t=90 → minute hand 180°` — so the next person can't accidentally make it wrong
again.
