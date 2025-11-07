import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Get all contact messages
 * GET /api/admin/messages/list
 */
export const GET: APIRoute = async (context) => {
  // Check authentication
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { data: messages, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading messages:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al cargar mensajes' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: messages || []
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('List messages error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
