import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthenticated } from '../../../lib/auth/jwt';

/**
 * Endpoint para listar suscriptores de newsletter (solo admin)
 * GET /api/newsletter/list
 */
export const GET: APIRoute = async (context) => {
  try {
    // Verificar autenticación
    if (!isAuthenticated(context)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No autorizado'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener parámetros de query
    const url = new URL(context.request.url);
    const status = url.searchParams.get('status'); // 'active', 'inactive', o null para todos

    // Construir query
    let query = supabaseAdmin
      .from('newsletter_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtrar por status si se especifica
    if (status) {
      query = query.eq('status', status);
    }

    const { data: subscribers, error } = await query;

    if (error) {
      console.error('Error fetching newsletter subscribers:', error);
      throw new Error('Error al obtener suscriptores');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: subscribers || []
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter list error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
