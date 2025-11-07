import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { isAuthenticated } from '../../../../lib/auth/jwt';

/**
 * Get single blog post by ID
 * GET /api/admin/posts/[id]
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
    const id = context.params.id;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: 'ID es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error loading post:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Error al cargar el post' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!post) {
      return new Response(
        JSON.stringify({ success: false, message: 'Post no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: post
      }),
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
