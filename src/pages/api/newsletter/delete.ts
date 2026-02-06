import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { isAuthenticated } from '../../../lib/auth/jwt';

/**
 * Delete subscriber permanently
 * DELETE /api/newsletter/delete
 * Body: { id: string }
 */
export const DELETE: APIRoute = async (context) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await context.request.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find subscriber by UUID id
    const querySnapshot = await db.collection('newsletter_subscriptions')
      .where('id', '==', id)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return new Response(
        JSON.stringify({ success: false, message: 'Suscriptor no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await querySnapshot.docs[0].ref.delete();

    console.log(`Subscriber ${id} deleted successfully`);

    return new Response(
      JSON.stringify({ success: true, message: 'Suscriptor eliminado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Delete subscriber error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
