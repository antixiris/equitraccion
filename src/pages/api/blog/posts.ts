import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query: FirebaseFirestore.Query = db.collection('blog_posts')
      .where('published', '==', true)
      .orderBy('published_at', 'desc');

    if (category) {
      query = query.where('category', '==', category);
    }

    // Firestore no tiene offset nativo — usamos limit+offset con startAfter
    // Para simplificar y mantener paridad, obtenemos limit+offset y cortamos
    const snapshot = await query.limit(limit + offset).get();
    const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const data = allDocs.slice(offset, offset + limit);

    return new Response(JSON.stringify({ data, count: allDocs.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Blog posts API error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
