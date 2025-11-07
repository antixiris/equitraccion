import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Get all blog posts (including drafts)
 * GET /api/admin/posts/list
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
    const { data: posts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading posts:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al cargar posts' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: posts || []
      }),
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
