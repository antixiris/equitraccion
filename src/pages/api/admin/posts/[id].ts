import type { APIRoute } from 'astro';
import { db } from '../../../../lib/firebase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Get single blog post by ID
 * GET /api/admin/posts/[id]
 */
export const GET: APIRoute = async (context) => {
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

    // Search by UUID id field (not doc ID which is slug)
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

    const doc = querySnapshot.docs[0];
    const post = { id: doc.data().id || doc.id, ...doc.data() };

    return new Response(
      JSON.stringify({ success: true, data: post }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get post error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
