import type { APIRoute } from 'astro';
import { clearAuthCookie } from '../../../lib/auth/jwt';

/**
 * Endpoint de logout para administradores
 * POST /api/auth/logout
 */
export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Limpiar la cookie de autenticación
    clearAuthCookie({ cookies } as any);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sesión cerrada exitosamente',
        redirect: '/admin/login'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al cerrar sesión'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
