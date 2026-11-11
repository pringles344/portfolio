export const site = {
  name: "Valet Overdrive",
  tagline: "A turn-based valet parking puzzle, built in the open.",
  description:
    "Dev log and design record for Valet Overdrive — a 2D tile-based parking puzzle game built in Godot 4.7.",
  url: "https://valet-overdrive.vercel.app",
  repo: "https://github.com/pringles344/Valet",
  author: "pringles344",
  status: "In development",
  started: "2026-11-05",
  engine: "Godot 4.7.2",
  language: "GDScript",
} as const;

export const nav = [
  { href: "/devlog", label: "Dev log" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/design", label: "Design" },
] as const;