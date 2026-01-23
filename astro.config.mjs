// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import remarkBreaks from 'remark-breaks';
import { rehypeLazyImage } from './src/lib/rehype-lazy-image.mjs';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.youssef.tn',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkBreaks],
    rehypePlugins: [rehypeLazyImage],
  },
  integrations: [
    react(),
    sitemap({
      // Sitemap is generated dynamically on every build
      // All pages and posts are automatically included
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Customize entries for better SEO
      serialize(item) {
        // Give homepage highest priority
        if (item.url === 'https://blog.youssef.tn/') {
          item.priority = 1.0;
        }
        // Give posts high priority
        if (item.url.includes('/posts/')) {
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
});