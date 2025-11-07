import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { isAuthenticated } from '../../lib/auth/jwt';

// GET - List all posts (for admin)
export const GET: APIRoute = async (context) => {
  try {
    // 🔐 Verificar autenticación
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const { data: posts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Error al cargar los posts' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: posts
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// POST - Create new post
export const POST: APIRoute = async (context) => {
  try {
    // 🔐 Verificar autenticación
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { request } = context;
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      tags,
      cover_image,
      reading_time,
      published,
      published_at
    } = body;

    // Validation
    if (!title || !slug || !excerpt || !content || !category || !author) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Insert post
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([{
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        tags: tags || [],
        cover_image: cover_image || null,
        reading_time: reading_time || 0,
        published: published || false,
        published_at: published_at || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Error al crear el post',
          code: error.code
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// PATCH - Update existing post
export const PATCH: APIRoute = async (context) => {
  try {
    // 🔐 Verificar autenticación
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { request } = context;
    const body = await request.json();
    const {
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      tags,
      cover_image,
      reading_time,
      published,
      published_at
    } = body;

    // Validation
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID del post es requerido' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!title || !slug || !excerpt || !content || !category || !author) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update post
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update({
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        tags: tags || [],
        cover_image: cover_image || null,
        reading_time: reading_time || 0,
        published: published || false,
        published_at: published_at || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({
          error: 'Error al actualizar el post',
          code: error.code
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// DELETE - Delete post
export const DELETE: APIRoute = async (context) => {
  try {
    // 🔐 Verificar autenticación
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { request } = context;
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID del post es requerido' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Error al eliminar el post' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Post eliminado correctamente'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
