import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    year: z.string(),
    url: z.string().url().optional(),
    repo: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, projects };
