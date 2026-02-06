import type { APIRoute } from 'astro';
import { db } from '../../../../lib/firebase';
import { isAuthenticated } from '../../../../lib/auth/jwt';
import { nowISO } from '../../../../lib/firestore-helpers';

/**
 * Toggle post published status
 * POST /api/admin/posts/toggle-published
 * Body: { id: string, currentStatus: boolean }
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

    if (!id || currentStatus === undefined) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID y estado actual son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find post by UUID id
    const querySnapshot = await db.collection('blog_posts')
      .where('id', '==', id)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return new Response(
        JSON.stringify({ success: false, message: 'Post no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newStatus = !currentStatus;
    const updateData: Record<string, any> = {
      published: newStatus,
      updated_at: nowISO(),
    };

    // Set published_at when publishing for the first time
    if (newStatus && !querySnapshot.docs[0].data().published_at) {
      updateData.published_at = nowISO();
    }

    await querySnapshot.docs[0].ref.update(updateData);

    console.log(`Post ${id} published status toggled to ${newStatus}`);

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
