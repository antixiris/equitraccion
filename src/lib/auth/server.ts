import type { AstroGlobal } from 'astro';
import { verifyJWT, createJWT } from './jwt';

const AUTH_COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Check if the current request is authenticated
 */
export function isAuthenticated(Astro: AstroGlobal): boolean {
  const token = Astro.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    const payload = verifyJWT(token);
    return !!payload && payload.admin === true;
  } catch (error) {
    return false;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export function requireAuth(Astro: AstroGlobal): void {
  if (!isAuthenticated(Astro)) {
    return Astro.redirect('/admin/login');
  }
}

/**
 * Set authentication cookie
 */
export function setAuthCookie(Astro: AstroGlobal): void {
  const token = createJWT({ admin: true });

  Astro.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(Astro: AstroGlobal): void {
  Astro.cookies.delete(AUTH_COOKIE_NAME, {
    path: '/',
  });
}
