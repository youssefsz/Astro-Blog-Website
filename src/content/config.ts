import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        category: z.string(),
        date: z.string(), // Or z.date() if we want to be strict, but string is easier for display initially
        readTime: z.string(),
        image: z.string().optional(),
    }),
});

export const collections = {
    posts: postsCollection,
};
