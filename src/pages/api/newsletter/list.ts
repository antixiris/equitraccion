import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { isAuthenticated } from '../../../lib/auth/jwt';

/**
 * Endpoint para listar suscriptores de newsletter (solo admin)
 * GET /api/newsletter/list
 */
export const GET: APIRoute = async (context) => {
  try {
    if (!isAuthenticated(context)) {
      return new Response(
        JSON.stringify({ success: false, message: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(context.request.url);
    const status = url.searchParams.get('status');

    let query: FirebaseFirestore.Query = db.collection('newsletter_subscriptions')
      .orderBy('created_at', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const subscribers = snapshot.docs.map(doc => ({ id: doc.data().id || doc.id, ...doc.data() }));

    return new Response(
      JSON.stringify({ success: true, data: subscribers }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter list error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Error interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
