import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { isAuthenticated } from '../../../lib/auth/jwt';

/**
 * Toggle subscriber status (active <-> inactive)
 * POST /api/newsletter/toggle-status
 * Body: { id: string, currentStatus: string }
 */
export const POST: APIRoute = async (context) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await context.request.json();
    const { id, currentStatus } = body;

    if (!id || !currentStatus) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID y estado actual son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

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

    await querySnapshot.docs[0].ref.update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    });

    console.log(`Subscriber ${id} status toggled to ${newStatus}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Estado actualizado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Toggle status error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
