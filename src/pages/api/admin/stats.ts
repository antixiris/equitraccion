import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { isAuthenticated } from '../../../lib/auth/jwt';

/**
 * Get dashboard statistics
 * GET /api/admin/stats
 */
export const GET: APIRoute = async (context) => {
  if (!isAuthenticated(context)) {
    return new Response(
      JSON.stringify({ success: false, message: 'No autorizado' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Run all count queries in parallel
    const [postsSnap, coursesSnap, subscribersSnap, messagesSnap] = await Promise.all([
      db.collection('blog_posts').count().get(),
      db.collection('courses').where('active', '==', true).count().get(),
      db.collection('newsletter_subscriptions').where('status', '==', 'active').count().get(),
      db.collection('contact_submissions').count().get(),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          posts: postsSnap.data().count,
          courses: coursesSnap.data().count,
          subscribers: subscribersSnap.data().count,
          messages: messagesSnap.data().count,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Stats error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
