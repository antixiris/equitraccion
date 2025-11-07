import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Mark message as read/unread
 * PATCH /api/admin/messages/[id]
 */
export const PATCH: APIRoute = async (context) => {
  // Check authentication
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const id = context.params.id;
    const body = await context.request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert boolean read to status value
    const status = body.read ? 'read' : 'new';

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating message:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al actualizar el mensaje' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje actualizado' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Update message error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * Delete message
 * DELETE /api/admin/messages/[id]
 */
export const DELETE: APIRoute = async (context) => {
  // Check authentication
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const id = context.params.id;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al eliminar el mensaje' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje eliminado' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Delete message error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
