import type { APIRoute } from 'astro';
import { db } from '../../../../lib/firebase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Get all blog posts (including drafts)
 * GET /api/admin/posts/list
 */
export const GET: APIRoute = async (context) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const snapshot = await db.collection('blog_posts')
      .orderBy('created_at', 'desc')
      .get();

    const posts = snapshot.docs.map(doc => ({ id: doc.data().id || doc.id, ...doc.data() }));

    return new Response(
      JSON.stringify({ success: true, data: posts }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('List posts error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
