import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			tags: z.array(z.string()).default([]),
            categories: z.array(z.string()).default([]),
            author: z.string().optional(),
            excerpt: z.string().optional(),
            slug: z.string().optional(),
            // Recovered HTML is author-controlled content, never visitor input.
            legacyHtml: z.boolean().default(false),
            legacyPath: z.string().optional(),
            math: z.boolean().default(false),
            sourceRepository: z.string().optional(),
            sourceCommit: z.string().optional(),
			draft: z.boolean().default(false),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog };
