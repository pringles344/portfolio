export type MilestoneStatus = "shipped" | "partial" | "next" | "planned";

export interface Milestone {
  id: string;
  name: string;
  focus: string;
  status: MilestoneStatus;
  note?: string;
}

export interface Phase {
  id: string;
  name: string;
  summary: string;
  milestones: Milestone[];
}

export const phases: Phase[] = [
  {
    id: "0",
    name: "Foundation (pre-rewrite)",
    summary:
      "The Godot skeleton and the procedural art pipeline. Everything the old grid-era plan shipped.",
    milestones: [
      { id: "0.1", name: "Project setup", focus: "Scene hierarchy", status: "shipped" },
      { id: "0.2", name: "Signal bus", focus: "Event system", status: "shipped" },
      {
        id: "0.3",
        name: "Turn system",
        focus: "Energy & turns",
        status: "shipped",
        note: "Energy-based. Superseded by M1.1, which replaces it with the shift clock.",
      },
      { id: "0.4", name: "Pathfinding", focus: "AStarGrid2D, hazard weights", status: "shipped" },
      {
        id: "0.5",
        name: "Tile map",
        focus: "2D grid",
        status: "partial",
        note: "Placeholder grid renders; no Godot TileSet authored yet.",
      },
      { id: "0.6", name: "Car spawner", focus: "Entrance queue", status: "shipped" },
      { id: "0.7", name: "Car controller", focus: "Car movement", status: "shipped" },
      {
        id: "pre-art",
        name: "Art pipeline",
        focus: "Procedural tiles, map renderer",
        status: "shipped",
        note: "gen_hotel.mjs and render_map.mjs; 76x38 native, 2.5D oblique, albedo only.",
      },
    ],
  },
  {
    id: "1",
    name: "Core Loop (clock-driven)",
    summary:
      "Replace per-turn energy with one continuous clock, and make layout quality mechanical.",
    milestones: [
      {
        id: "M1.1",
        name: "Shift clock",
        focus: "clock_manager.gd",
        status: "shipped",
        note:
          "One continuous clock; a segment timeline (morning / break / evening) and N-car concurrency. Drives the 12-hour analogue face.",
      },
      {
        id: "M1.2",
        name: "Distance-scaled cost",
        focus: "Minutes by path length",
        status: "planned",
      },
      {
        id: "M1.3",
        name: "Park/retrieve + chip ledger stub",
        focus: "The two-action loop",
        status: "planned",
      },
      {
        id: "M1.4",
        name: "Arrivals",
        focus: "Continuous flow, patience",
        status: "planned",
      },
      {
        id: "M1.5",
        name: "Turn pacing",
        focus: "Action cap per turn",
        status: "planned",
      },
    ],
  },
  {
    id: "2",
    name: "Modules & Plot",
    summary:
      "Place multi-cell modules on an empty plot instead of single tiles, then resolve their edges.",
    milestones: [
      { id: "M2.1", name: "Plot model", focus: "Terrain + placed modules", status: "planned" },
      { id: "M2.2", name: "Module catalogue", focus: "Data-driven .tres", status: "planned" },
      { id: "M2.3", name: "Placement UX", focus: "Ghost, validity, rotate", status: "planned" },
      { id: "M2.4", name: "Autotile resolution", focus: "Module-aware edges", status: "planned" },
      { id: "M2.5", name: "Zones", focus: "Flood-filled modifiers", status: "planned" },
      {
        id: "M2.6",
        name: "Godot TileSet from art",
        focus: "Wire the PNG pipeline into the engine",
        status: "planned",
      },
      { id: "M2.7", name: "Module art", focus: "Grades I/II/III", status: "planned" },
    ],
  },
  {
    id: "3",
    name: "Scoring",
    summary:
      "Chips × Lot Mult × Trinket Mult, walked zone by zone against the day's quota.",
    milestones: [
      { id: "M3.1", name: "Chip ledger", focus: "Pending vs realised", status: "planned" },
      { id: "M3.2", name: "Lot Mult evaluator", focus: "Spatial, always on", status: "planned" },
      { id: "M3.3", name: "Trinket mult hooks", focus: "Charges and recharge", status: "planned" },
      { id: "M3.4", name: "Audit sequencing", focus: "Sweep order", status: "planned" },
      { id: "M3.5", name: "Juice", focus: "Scanlines, slams, detonation", status: "planned" },
    ],
  },
  {
    id: "4",
    name: "Economy",
    summary: "Two currencies, never shared. Stars for the week, tips for the shop.",
    milestones: [
      { id: "M4.1", name: "Stars", focus: "Earning and spending", status: "planned" },
      { id: "M4.2", name: "Shop", focus: "Modules, trinkets, upgrades", status: "planned" },
      { id: "M4.3", name: "Rarity rolls", focus: "Proportional power and price", status: "planned" },
      { id: "M4.4", name: "Grades", focus: "SAP-style merging", status: "planned" },
      { id: "M4.5", name: "Trinkets", focus: "The starting table", status: "planned" },
    ],
  },
  {
    id: "5",
    name: "The Week",
    summary: "Build at night, serve by day, hit a quota every 7th day.",
    milestones: [
      { id: "M5.1", name: "Day/night", focus: "Lighting and shift split", status: "planned" },
      { id: "M5.2", name: "Checkpoints", focus: "Between days", status: "planned" },
      { id: "M5.3", name: "Quota and boss days", focus: "Day 7", status: "planned" },
      { id: "M5.4", name: "Events", focus: "Modifiers", status: "planned" },
      { id: "M5.5", name: "Save/load", focus: "Persistence", status: "planned" },
    ],
  },
  {
    id: "6",
    name: "Content & Polish",
    summary: "Themes, module variety, audio, and the long tail of tuning.",
    milestones: [
      { id: "M6.1", name: "Themes", focus: "Visual sets", status: "planned" },
      { id: "M6.2", name: "Module variety", focus: "Roundabouts, EV, family", status: "planned" },
      { id: "M6.3", name: "Audio", focus: "Scoring moments", status: "planned" },
      { id: "M6.4", name: "Balance", focus: "Simulation-tuned", status: "planned" },
    ],
  },
];

export const allMilestones: Milestone[] = phases.flatMap((p) => p.milestones);

export const progress = {
  shipped: allMilestones.filter((m) => m.status === "shipped").length,
  partial: allMilestones.filter((m) => m.status === "partial").length,
  total: allMilestones.length,
  percent: Math.round(
    (allMilestones.filter((m) => m.status === "shipped").length /
      allMilestones.length) *
      100,
  ),
};

export const statusLabel: Record<MilestoneStatus, string> = {
  shipped: "Shipped",
  partial: "Partial",
  next: "Up next",
  planned: "Planned",
};