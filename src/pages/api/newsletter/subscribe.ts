import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { validateEmail } from '../../../lib/validation/sanitize';
import { checkContactFormRateLimit, getClientIP, createRateLimitResponse } from '../../../lib/security/rate-limiter';

/**
 * Endpoint de suscripción al newsletter
 * POST /api/newsletter/subscribe
 * Body: { email: string }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Parsear body
    const body = await request.json();
    const { email, honeypot } = body;

    // 🍯 Honeypot field - Si está lleno, es un bot
    if (honeypot) {
      console.warn('🤖 Bot detected via honeypot field in newsletter');
      // Responder con éxito falso para confundir al bot
      return new Response(
        JSON.stringify({
          success: true,
          message: '¡Gracias por suscribirte!',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkContactFormRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      console.warn(`🚫 Rate limit exceeded for newsletter subscription from IP: ${clientIP}`);
      return createRateLimitResponse(rateLimitResult);
    }

    // Validar email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: validation.errors[0] || 'Email inválido'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si ya está suscrito
    const { data: existing } = await supabase
      .from('newsletter_subscriptions')
      .select('email, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Este email ya está suscrito al newsletter'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Reactivar suscripción
        const { error: updateError } = await supabase
          .from('newsletter_subscriptions')
          .update({
            status: 'active'
          })
          .eq('email', email);

        if (updateError) {
          console.error('Error reactivating newsletter subscription:', updateError);
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Error al reactivar la suscripción'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: '¡Suscripción reactivada! Recibirás nuestro próximo boletín.'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Crear nueva suscripción
    const { error: insertError } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: email.toLowerCase().trim(),
        status: 'active'
      });

    if (insertError) {
      console.error('Error creating newsletter subscription:', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error al procesar la suscripción. Intenta de nuevo.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Éxito
    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Gracias por suscribirte! Recibirás un email de confirmación pronto.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
