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
    // includeFiles no necesario con noExternal en vite.ssr
  }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Forzar que Vite NO externalice estos paquetes y los bundlee inline
      // Esto evita "Cannot find module" en Vercel serverless
      noExternal: ['firebase-admin', '@opentelemetry/api']
    }
  },
  trailingSlash: 'ignore'
});