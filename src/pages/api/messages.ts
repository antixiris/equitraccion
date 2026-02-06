import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';

export const GET: APIRoute = async ({ request }) => {
  try {
    const snapshot = await db.collection('contact_submissions')
      .orderBy('created_at', 'desc')
      .get();

    const messages = snapshot.docs.map(doc => ({ id: doc.data().id || doc.id, ...doc.data() }));

    return new Response(
      JSON.stringify({ success: true, data: messages }),
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

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return new Response(
        JSON.stringify({ error: 'Faltan parámetros' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Estado inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const docRef = db.collection('contact_submissions').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response(
        JSON.stringify({ error: 'Mensaje no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await docRef.update({ status });

    const updatedDoc = await docRef.get();
    const data = { id: updatedDoc.data()?.id || updatedDoc.id, ...updatedDoc.data() };

    return new Response(
      JSON.stringify({ success: true, data }),
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
