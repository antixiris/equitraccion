import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
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

    console.log('📧 Newsletter subscription attempt:', { email: email ? '***' : 'missing', honeypot: !!honeypot });

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
    if (!email) {
      console.error('❌ Email missing in request');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email es requerido'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validation = validateEmail(email);
    if (!validation.isValid) {
      console.error('❌ Email validation failed:', validation.errors);
      return new Response(
        JSON.stringify({
          success: false,
          message: validation.errors[0] || 'Email inválido'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si ya está suscrito
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .select('email, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, que es lo esperado si no existe
      console.error('Error checking existing subscription:', checkError);
    }

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
        const { error: updateError } = await supabaseAdmin
          .from('newsletter_subscriptions')
          .update({
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('email', email.toLowerCase().trim());

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
    const { data: newSubscription, error: insertError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .insert({
        email: email.toLowerCase().trim(),
        status: 'active'
        // Note: created_at will be auto-populated by Supabase
      })
      .select()
      .single();

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

    console.log(`📧 New newsletter subscription: ${email}`);

    // TODO: Enviar email de confirmación
    // Aquí deberías integrar con tu servicio de email (SendGrid, Mailgun, etc.)
    // Ejemplo:
    /*
    await sendConfirmationEmail(email, {
      subject: 'Confirmación de suscripción - Equitracción Newsletter',
      message: '¡Gracias por suscribirte! Recibirás nuestro boletín mensual con artículos y novedades.'
    });
    */

    // Éxito
    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Gracias por suscribirte! Recibirás nuestro próximo boletín mensual.'
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
