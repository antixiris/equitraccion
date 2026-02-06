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
    edgeMiddleware: false,
    // Forzar inclusión de módulos que el bundler de Vercel no rastrea
    includeFiles: ['./node_modules/@opentelemetry/api/build/src/index.js']
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // firebase-admin y sus dependencias necesitan resolverse desde node_modules
      // en Vercel, no bundlearse con Vite (evita "Cannot find module" en serverless)
      external: ['firebase-admin']
    }
  },
  trailingSlash: 'ignore'
});