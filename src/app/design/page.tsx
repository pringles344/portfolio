import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Markdown } from "@/components/markdown";

export const metadata: Metadata = {
  title: "Design",
  description:
    "The Valet Overdrive design document — turn economy, scoring, tile grid, pathfinding and design principles.",
};

function loadDesignDoc(): string {
  const file = path.join(process.cwd(), "content", "design", "design-doc.md");
  const raw = readFileSync(file, "utf8");
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "");
}

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
      <header className="border-b border-line/70 pb-8">
        <p className="label text-hazard">Design document</p>
        <h1 className="display mt-4 text-4xl text-chalk sm:text-5xl">
          How the game works
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-chalk-dim">
          Turn economy, scoring, the tile grid, and the pathfinding that ties them
          together.
        </p>
      </header>

      <div className="mt-10">
        <Markdown>{loadDesignDoc()}</Markdown>
      </div>
    </div>
  );
}