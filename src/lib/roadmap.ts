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
    name: "Foundation & Core Loop",
    summary:
      "The lot, the cars, the turn economy, and the pathfinding that connects them.",
    milestones: [
      { id: "0.1", name: "Project setup", focus: "Scene hierarchy", status: "shipped" },
      { id: "0.2", name: "Signal bus", focus: "Event system", status: "shipped" },
      { id: "0.3", name: "Turn system", focus: "Energy & turns", status: "shipped" },
      { id: "0.4", name: "Pathfinding", focus: "Navigation", status: "shipped" },
      {
        id: "0.5",
        name: "Tile map",
        focus: "2D grid",
        status: "partial",
        note: "Placeholder grid renders; TileSet still to be authored.",
      },
      { id: "0.6", name: "Car spawner", focus: "Car generation", status: "shipped" },
      { id: "0.7", name: "Car controller", focus: "Car movement", status: "shipped" },
      { id: "0.8", name: "Park slot", focus: "Occupancy tracking", status: "next" },
      { id: "0.9", name: "Core loop", focus: "Full gameplay", status: "planned" },
    ],
  },
  {
    id: "1",
    name: "Hazards & Obstacles",
    summary:
      "Potholes become weights, oil becomes forced movement, hydrants become fines.",
    milestones: [
      { id: "1.0", name: "Hazard system", focus: "Obstacles", status: "planned" },
      { id: "1.1", name: "Hazard visuals", focus: "Visual hazards", status: "planned" },
      {
        id: "1.2",
        name: "Hazard pathfinding",
        focus: "Hazard-aware paths",
        status: "planned",
      },
    ],
  },
  {
    id: "2",
    name: "End-Shift Sweep & Scoring",
    summary:
      "Row multipliers, EV bonuses, penalties, and the presentation layer that sells it.",
    milestones: [
      { id: "2.0", name: "Sweep calculator", focus: "Scoring", status: "planned" },
      { id: "2.1", name: "Juice manager", focus: "Visual feedback", status: "planned" },
      { id: "2.2", name: "Shift summary", focus: "Results screen", status: "planned" },
    ],
  },
  {
    id: "3",
    name: "Progression & Shop",
    summary: "Spend the tips. Upgrade the lot. Carry progress between sessions.",
    milestones: [
      { id: "3.0", name: "Shop system", focus: "Upgrades", status: "planned" },
      { id: "3.1", name: "Save system", focus: "Persistence", status: "planned" },
      { id: "3.2", name: "Level select", focus: "Multiple levels", status: "planned" },
    ],
  },
  {
    id: "4",
    name: "Polish & Balance",
    summary: "Audio, particles, screen shake, and the long tail of tuning.",
    milestones: [
      { id: "4.0", name: "Audio", focus: "Sound", status: "planned" },
      { id: "4.1", name: "Visual polish", focus: "Visual effects", status: "planned" },
      { id: "4.2", name: "Balance & bugfix", focus: "Polish", status: "planned" },
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