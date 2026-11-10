import { defineCollection, z } from "astro:content";

const devLog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    milestone: z.string(),
    phase: z.string(),
    status: z.enum(["completed", "in-progress", "pending"]),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.string().optional(),
  }),
});

export const collections = {
  "dev-log": devLog,
};