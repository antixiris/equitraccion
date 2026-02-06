import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from './lib/auth/jwt';

/**
 * Middleware de autenticación y seguridad
 * - Protege rutas administrativas con JWT
 * - Configura headers de seguridad HTTP
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { url, redirect } = context;
  const pathname = url.pathname;

  // Lista de rutas públicas que no requieren autenticación
  const publicPaths = [
    '/admin/login',
    '/api/auth/login',
    '/api/auth/logout'
  ];

  // Verificar si la ruta es administrativa y no es pública
  const isAdminRoute = pathname.startsWith('/admin');
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isAdminRoute && !isPublicPath) {
    // Verificar autenticación
    const authenticated = isAuthenticated(context);

    if (!authenticated) {
      // Redirigir al login si no está autenticado
      console.log(`🔒 Access denied to ${pathname} - redirecting to login`);
      return redirect('/admin/login');
    }

    console.log(`✅ Authenticated access to ${pathname}`);
  }

  // Continuar con la petición
  const response = await next();

  // Configurar headers de seguridad HTTP
  // Estos headers protegen contra ataques comunes

  // Previene clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Previene XSS en navegadores antiguos
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Previene MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Política de referrer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Política de permisos (Feature Policy)
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Content Security Policy (CSP)
  // Permite contenido del mismo origen, Google Fonts, y Google Analytics
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.quilljs.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.quilljs.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://www.google-analytics.com https://*.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Strict Transport Security (HSTS) - Solo en producción con HTTPS
  if (import.meta.env.PROD) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
});
