import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { validateEmail } from '../../../lib/validation/sanitize';
import { checkContactFormRateLimit, getClientIP, createRateLimitResponse } from '../../../lib/security/rate-limiter';
import { sendWelcomeEmail } from '../../../lib/email/resend-client';

/**
 * Endpoint de suscripción al newsletter
 * POST /api/newsletter/subscribe
 * Body: { email: string }
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, honeypot } = body;

    console.log('Newsletter subscription attempt:', { email: email ? '***' : 'missing', honeypot: !!honeypot });

    // Honeypot field - Si está lleno, es un bot
    if (honeypot) {
      console.warn('Bot detected via honeypot field in newsletter');
      return new Response(
        JSON.stringify({ success: true, message: '¡Gracias por suscribirte!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkContactFormRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for newsletter subscription from IP: ${clientIP}`);
      return createRateLimitResponse(rateLimitResult);
    }

    // Validar email
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validation = validateEmail(email);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ success: false, message: validation.errors[0] || 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    // email normalizado = doc ID → unicidad garantizada + O(1) lookup
    const docRef = db.collection('newsletter_subscriptions').doc(normalizedEmail);
    const existing = await docRef.get();

    if (existing.exists) {
      const existingData = existing.data()!;

      if (existingData.status === 'active') {
        return new Response(
          JSON.stringify({ success: false, message: 'Este email ya está suscrito al newsletter' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Reactivar suscripción
        await docRef.update({
          status: 'active',
          updated_at: new Date().toISOString(),
        });

        console.log(`Newsletter subscription reactivated: ${email}`);

        const emailResult = await sendWelcomeEmail(email);
        if (!emailResult.success) {
          console.error('Failed to send welcome email on reactivation:', emailResult.error);
        }

        return new Response(
          JSON.stringify({ success: true, message: '¡Suscripción reactivada! Revisa tu email.' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Crear nueva suscripción
    const now = new Date().toISOString();
    await docRef.set({
      id: crypto.randomUUID(),
      email: normalizedEmail,
      status: 'active',
      created_at: now,
    });

    console.log(`New newsletter subscription: ${email}`);

    const emailResult = await sendWelcomeEmail(email);
    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
    }

    return new Response(
      JSON.stringify({ success: true, message: '¡Gracias por suscribirte! Revisa tu email para confirmar.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
