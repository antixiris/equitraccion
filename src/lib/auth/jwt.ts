import jwt from 'jsonwebtoken';
import type { APIContext } from 'astro';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRATION = '7d'; // 7 días

export interface TokenPayload {
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Genera un JWT para el usuario autenticado
 */
export function generateToken(email: string, role: string = 'admin'): string {
  return jwt.sign(
    { email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
}

/**
 * Verifica y decodifica un JWT
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extrae el token de las cookies de la request
 */
export function getTokenFromCookies(context: APIContext): string | null {
  const authCookie = context.cookies.get('auth_token');
  return authCookie ? authCookie.value : null;
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(context: APIContext): boolean {
  const token = getTokenFromCookies(context);
  console.log('🔐 isAuthenticated check - token exists:', !!token);
  if (!token) {
    console.log('❌ No token found in cookies');
    return false;
  }

  const payload = verifyToken(token);
  console.log('🔐 Token payload:', payload ? 'valid' : 'invalid');
  return payload !== null;
}

/**
 * Obtiene los datos del usuario autenticado
 */
export function getAuthenticatedUser(context: APIContext): TokenPayload | null {
  const token = getTokenFromCookies(context);
  if (!token) return null;
  
  return verifyToken(token);
}

/**
 * Establece la cookie de autenticación
 */
export function setAuthCookie(context: APIContext, token: string): void {
  context.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: import.meta.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/'
  });
}

/**
 * Elimina la cookie de autenticación
 */
export function clearAuthCookie(context: APIContext): void {
  context.cookies.delete('auth_token', { path: '/' });
}
