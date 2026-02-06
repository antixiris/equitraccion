import type { APIRoute } from 'astro';
import { db } from '../../../../lib/firebase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Mark message as read/unread
 * PATCH /api/admin/messages/[id]
 */
export const PATCH: APIRoute = async (context) => {
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

    const status = body.read ? 'read' : 'new';
    const docRef = db.collection('contact_submissions').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response(
        JSON.stringify({ success: false, message: 'Mensaje no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await docRef.update({ status });

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

    const docRef = db.collection('contact_submissions').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response(
        JSON.stringify({ success: false, message: 'Mensaje no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await docRef.delete();

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
