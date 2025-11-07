import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

/**
 * Endpoint de desuscripción de newsletter
 * POST /api/newsletter/unsubscribe
 * Body: { email: string }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    // Validación básica
    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email es requerido'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Formato de email inválido'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si existe la suscripción
    const { data: existingSubscription, error: checkError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (checkError || !existingSubscription) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No se encontró una suscripción activa con este email'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Si ya está inactivo, informar al usuario
    if (existingSubscription.status === 'inactive') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Este email ya estaba dado de baja de la newsletter',
          alreadyUnsubscribed: true
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Desactivar suscripción (soft delete - cambiar status a 'inactive')
    const { error: updateError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase().trim());

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw new Error('Error al procesar la desuscripción');
    }

    console.log(`📭 Newsletter unsubscribe: ${email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Te has dado de baja exitosamente de la newsletter'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error al procesar la desuscripción. Por favor, inténtalo de nuevo.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
