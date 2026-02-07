import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/auth/jwt';
import { checkLoginRateLimit, getClientIP, createRateLimitResponse } from '../../../lib/security/rate-limiter';

/**
 * Endpoint de login para administradores
 * POST /api/auth/login
 * Body: { email: string, password: string }
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Rate limiting - prevenir ataques de fuerza bruta
    const clientIP = getClientIP(request);
    const rateLimitResult = checkLoginRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      console.warn(`🚫 Rate limit exceeded for IP: ${clientIP}`);
      return createRateLimitResponse(rateLimitResult);
    }

    // Parsear el body de la request
    const body = await request.json();
    const { email, password } = body;

    // Validación básica de inputs
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email y contraseña son requeridos'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Formato de email inválido'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener credenciales de administrador desde variables de entorno
    const adminEmail = import.meta.env.ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error de configuración del servidor'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar email
    if (email !== adminEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Credenciales inválidas'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar contraseña
    // Si la contraseña en .env está hasheada, usar bcrypt.compare
    // Si está en texto plano (solo para desarrollo), comparar directamente
    let passwordMatch = false;

    if (adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$')) {
      // Contraseña hasheada con bcrypt
      passwordMatch = await bcrypt.compare(password, adminPassword);
    } else {
      // Contraseña en texto plano (solo desarrollo)
      passwordMatch = password === adminPassword;
      console.warn('⚠️  ADVERTENCIA: Usando contraseña en texto plano. Hashear antes de producción.');
    }

    if (!passwordMatch) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Credenciales inválidas'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generar token JWT
    const token = generateToken(email, 'admin');

    // Establecer cookie segura
    cookies.set('auth_token', token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/'
    });

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Autenticación exitosa',
        redirect: '/admin'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
