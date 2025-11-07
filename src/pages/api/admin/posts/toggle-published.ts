import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Toggle post published status
 * POST /api/admin/posts/toggle-published
 * Body: { id: string, currentStatus: boolean }
 */
export const POST: APIRoute = async (context) => {
  // Check authentication
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await context.request.json();
    const { id, currentStatus } = body;

    if (!id || currentStatus === undefined) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID y estado actual son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Toggle published status
    const newStatus = !currentStatus;

    const { error } = await supabaseAdmin
      .from('blog_posts')
      .update({
        published: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error toggling post published status:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al actualizar el estado' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Post ${id} published status toggled to ${newStatus}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Estado actualizado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Toggle published error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
