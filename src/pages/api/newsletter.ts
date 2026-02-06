import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email es obligatorio' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    // email normalizado = doc ID → unicidad garantizada
    const docRef = db.collection('newsletter_subscriptions').doc(normalizedEmail);
    const existing = await docRef.get();

    if (existing.exists) {
      return new Response(
        JSON.stringify({ error: 'Este email ya está suscrito' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date().toISOString();
    const data = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      source: source || 'website',
      status: 'active' as const,
      created_at: now,
    };

    await docRef.set(data);

    return new Response(
      JSON.stringify({ success: true, message: 'Suscripción exitosa', data }),
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
