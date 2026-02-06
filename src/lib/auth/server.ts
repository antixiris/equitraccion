import type { AstroGlobal } from 'astro';
import { verifyToken, generateToken } from './jwt';

const AUTH_COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Check if the current request is authenticated (AstroGlobal version)
 */
export function isAuthenticated(Astro: AstroGlobal): boolean {
  const token = Astro.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const payload = verifyToken(token);
  return payload !== null;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export function requireAuth(Astro: AstroGlobal): void {
  if (!isAuthenticated(Astro)) {
    return Astro.redirect('/admin/login');
  }
}
