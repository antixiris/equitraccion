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
    plugins: [tailwindcss()],
    ssr: {
      // Externalizar firebase-admin y sus dependencias para que Vite/Rollup
      // no intente bundlearlas. Se resuelven en runtime desde node_modules.
      // Esto evita el error "Cannot find module @opentelemetry/api" porque
      // nft (Vercel's file tracer) las incluye correctamente como externals.
      external: ['firebase-admin', '@google-cloud/firestore', '@opentelemetry/api']
    }
  },
  trailingSlash: 'ignore'
});
