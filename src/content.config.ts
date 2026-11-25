// Content collections: typed data the pages can query with getCollection().
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const products = defineCollection({
  // every src/content/products/*.json file becomes one entry; the file name is its id
  loader: glob({ pattern: "*.json", base: "./src/content/products" }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    price: z.number().positive(),       // in USD, e.g. 249 -> "$249.00"
    image: z.string().startsWith("/images/"),
    imageAlt: z.string(),
    featured: z.boolean().default(false),
    featuredOrder: z.number().int().optional(),  // 1 = the large card
  }),
});

export const collections = { products };
