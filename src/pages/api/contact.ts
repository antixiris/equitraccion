import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';
import {
  validateEmail,
  validateContactForm,
  sanitizeHTML,
} from '../../lib/validation/sanitize';
import {
  checkContactFormRateLimit,
  getClientIP,
  createRateLimitResponse,
} from '../../lib/security/rate-limiter';
import { sendContactNotification } from '../../lib/email/resend-client';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, category, honeypot } = body;

    // 🍯 Honeypot field - Si está lleno, es un bot
    if (honeypot) {
      console.warn('🤖 Bot detected via honeypot field');
      // Responder con éxito falso para confundir al bot
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Formulario enviado correctamente',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 🚦 Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkContactFormRateLimit(clientIP);

    if (!rateLimitResult.allowed) {
      console.warn(`🚫 Rate limit exceeded for contact form from IP: ${clientIP}`);
      return createRateLimitResponse(rateLimitResult);
    }

    // ✅ Validación completa del formulario
    const validation = validateContactForm({
      name,
      email,
      phone,
      message,
    });

    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          error: validation.errors[0] || 'Datos inválidos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validación de campos obligatorios
    if (!subject || !category) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Category validation
    const validCategories = ['forestales', 'desarrollo', 'formacion', 'general'];
    if (!validCategories.includes(category)) {
      return new Response(
        JSON.stringify({ error: 'Categoría inválida' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 🧹 Sanitizar inputs antes de guardar
    const sanitizedName = sanitizeHTML(name.trim());
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone ? sanitizeHTML(phone.trim()) : null;
    const sanitizedSubject = sanitizeHTML(subject.trim());
    const sanitizedMessage = sanitizeHTML(message.trim());

    // Insert into Firestore
    const now = new Date().toISOString();
    const docData = {
      id: crypto.randomUUID(),
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      category,
      status: 'new' as const,
      created_at: now,
    };

    try {
      await db.collection('contact_submissions').doc(docData.id).set(docData);
    } catch (dbError) {
      console.error('Firestore error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Error al enviar el formulario' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = docData;

    // Enviar email de notificación (no bloquea si falla)
    await sendContactNotification({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      subject: sanitizedSubject,
      message: sanitizedMessage,
      category,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Formulario enviado correctamente',
        data
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
