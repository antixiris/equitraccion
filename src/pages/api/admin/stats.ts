import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthenticated } from '../../../lib/auth/jwt';

/**
 * Get dashboard statistics
 * GET /api/admin/stats
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
    // Get blog posts count
    const { count: postsCount, error: postsError } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (postsError) {
      console.error('Error counting posts:', postsError);
    }

    // Get active courses count
    const { count: coursesCount, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    if (coursesError) {
      console.error('Error counting courses:', coursesError);
    }

    // Get active subscribers count
    const { count: subscribersCount, error: subscribersError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (subscribersError) {
      console.error('Error counting subscribers:', subscribersError);
    }

    // Get contact messages count
    const { count: messagesCount, error: messagesError } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });

    if (messagesError) {
      console.error('Error counting messages:', messagesError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          posts: postsCount || 0,
          courses: coursesCount || 0,
          subscribers: subscribersCount || 0,
          messages: messagesCount || 0
        }
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
