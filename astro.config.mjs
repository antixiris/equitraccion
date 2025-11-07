// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://equitraccion.com',
  output: 'server', // SSR mode para API routes
  adapter: vercel({
    webAnalytics: {
      enabled: false
    },
    edgeMiddleware: false
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  trailingSlash: 'ignore'
});