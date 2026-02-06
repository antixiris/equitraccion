import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';

/**
 * Endpoint de desuscripción de newsletter
 * POST /api/newsletter/unsubscribe
 * Body: { email: string }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Formato de email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const docRef = db.collection('newsletter_subscriptions').doc(normalizedEmail);
    const doc = await docRef.get();

    if (!doc.exists) {
      return new Response(
        JSON.stringify({ success: false, message: 'No se encontró una suscripción activa con este email' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = doc.data()!;

    if (data.status === 'inactive') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Este email ya estaba dado de baja de la newsletter',
          alreadyUnsubscribed: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await docRef.update({
      status: 'inactive',
      updated_at: new Date().toISOString(),
    });

    console.log(`Newsletter unsubscribe: ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Te has dado de baja exitosamente de la newsletter' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error al procesar la desuscripción. Por favor, inténtalo de nuevo.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
