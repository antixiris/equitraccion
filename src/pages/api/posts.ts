import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';
import { isAuthenticated } from '../../lib/auth/jwt';
import { calculateReadingTime, nowISO } from '../../lib/firestore-helpers';

// GET - List all posts (for admin)
export const GET: APIRoute = async (context) => {
  try {
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const snapshot = await db.collection('blog_posts')
      .orderBy('created_at', 'desc')
      .get();

    const posts = snapshot.docs.map(doc => ({ id: doc.data().id || doc.id, ...doc.data() }));

    return new Response(
      JSON.stringify({ success: true, data: posts }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST - Create new post
export const POST: APIRoute = async (context) => {
  try {
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const { title, slug, excerpt, content, category, author, tags, cover_image, published, published_at } = body;

    if (!title || !slug || !excerpt || !content || !category || !author) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check slug uniqueness (slug = doc ID)
    const existing = await db.collection('blog_posts').doc(slug).get();
    if (existing.exists) {
      return new Response(
        JSON.stringify({ error: 'Ya existe un post con ese slug', code: '23505' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = nowISO();
    const id = crypto.randomUUID();
    const postData = {
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      tags: tags || [],
      cover_image: cover_image || null,
      reading_time: calculateReadingTime(content),
      published: published || false,
      published_at: published_at || null,
      created_at: now,
      updated_at: now,
    };

    await db.collection('blog_posts').doc(slug).set(postData);

    return new Response(
      JSON.stringify({ success: true, data: postData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PATCH - Update existing post
export const PATCH: APIRoute = async (context) => {
  try {
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const { id, title, slug, excerpt, content, category, author, tags, cover_image, published, published_at } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID del post es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!title || !slug || !excerpt || !content || !category || !author) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find existing post by UUID id
    const existingQuery = await db.collection('blog_posts')
      .where('id', '==', id)
      .limit(1)
      .get();

    if (existingQuery.empty) {
      return new Response(
        JSON.stringify({ error: 'Post no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingDoc = existingQuery.docs[0];
    const existingSlug = existingDoc.id;

    const updateData = {
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      tags: tags || [],
      cover_image: cover_image || null,
      reading_time: calculateReadingTime(content),
      published: published || false,
      published_at: published_at || null,
      updated_at: nowISO(),
      created_at: existingDoc.data().created_at,
    };

    if (slug !== existingSlug) {
      // Slug changed → create new doc + delete old doc in a batch
      const batch = db.batch();
      batch.set(db.collection('blog_posts').doc(slug), updateData);
      batch.delete(existingDoc.ref);
      await batch.commit();
    } else {
      await existingDoc.ref.update(updateData);
    }

    return new Response(
      JSON.stringify({ success: true, data: updateData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE - Delete post
export const DELETE: APIRoute = async (context) => {
  try {
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'ID del post es requerido' }),
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
        JSON.stringify({ error: 'Post no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await querySnapshot.docs[0].ref.delete();

    return new Response(
      JSON.stringify({ success: true, message: 'Post eliminado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
