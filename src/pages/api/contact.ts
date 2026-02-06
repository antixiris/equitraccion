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
import { Resend } from 'resend';

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

    // Enviar email de notificación a roberto@equitraccion.com
    try {
      const resend = new Resend(import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY);

      const categoryLabels: Record<string, string> = {
        'forestales': 'Servicios Forestales',
        'desarrollo': 'Desarrollo Personal',
        'formacion': 'Formación',
        'general': 'Consulta General'
      };

      await resend.emails.send({
        from: 'Equitracción Web <noreply@equitraccion.iasanmiguel.com>',
        to: 'roberto@equitraccion.com',
        subject: `Nuevo mensaje de contacto: ${sanitizedSubject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #78350f; color: white; padding: 20px; text-align: center; }
                .content { background-color: #f9fafb; padding: 30px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #78350f; margin-bottom: 5px; }
                .value { background-color: white; padding: 10px; border-left: 3px solid #78350f; }
                .message-box { background-color: white; padding: 15px; border: 1px solid #e5e7eb; border-radius: 5px; white-space: pre-wrap; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                .badge { display: inline-block; padding: 4px 12px; background-color: #fef3c7; color: #78350f; border-radius: 12px; font-size: 12px; font-weight: 600; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">Nuevo Mensaje de Contacto</h1>
                </div>

                <div class="content">
                  <div class="field">
                    <div class="label">Tipo de consulta:</div>
                    <div class="value">
                      <span class="badge">${categoryLabels[category] || category}</span>
                    </div>
                  </div>

                  <div class="field">
                    <div class="label">Asunto:</div>
                    <div class="value">${sanitizedSubject}</div>
                  </div>

                  <div class="field">
                    <div class="label">Nombre:</div>
                    <div class="value">${sanitizedName}</div>
                  </div>

                  <div class="field">
                    <div class="label">Email:</div>
                    <div class="value">
                      <a href="mailto:${sanitizedEmail}" style="color: #78350f;">${sanitizedEmail}</a>
                    </div>
                  </div>

                  ${sanitizedPhone ? `
                  <div class="field">
                    <div class="label">Teléfono:</div>
                    <div class="value">${sanitizedPhone}</div>
                  </div>
                  ` : ''}

                  <div class="field">
                    <div class="label">Mensaje:</div>
                    <div class="message-box">${sanitizedMessage}</div>
                  </div>

                  <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #78350f;">
                    <strong>💡 Accede al panel de administración</strong><br>
                    <a href="https://equitraccion.vercel.app/admin/messages" style="color: #78350f;">Ver todos los mensajes →</a>
                  </div>
                </div>

                <div class="footer">
                  <p>Este email fue generado automáticamente desde el formulario de contacto de Equitracción.</p>
                  <p><strong>No respondas a este email.</strong> Para responder al cliente, utiliza su dirección de email: ${sanitizedEmail}</p>
                </div>
              </div>
            </body>
          </html>
        `
      });

      console.log(`✅ Contact notification email sent to roberto@equitraccion.com`);
    } catch (emailError) {
      // Log error but don't fail the request - the message was saved successfully
      console.error('Error sending contact notification email:', emailError);
    }

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
