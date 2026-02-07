import { Resend } from 'resend';
import { generateWelcomeEmailHTML, generateWelcomeEmailText } from './welcome-template';

// Inicialización lazy: Resend lanza error si no hay API key,
// pero el email no es crítico — no debe crashear el módulo entero
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!_resend) {
    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured — emails will be skipped');
      return null;
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

/**
 * Envía email de bienvenida a nuevo suscriptor
 */
export async function sendWelcomeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResend();
    if (!resend) return { success: false, error: 'Email service not configured' };

    const baseUrl = import.meta.env.VERCEL_URL
      ? `https://${import.meta.env.VERCEL_URL}`
      : import.meta.env.SITE_URL || process.env.SITE_URL || 'https://equitraccion.com';

    const { data, error } = await resend.emails.send({
      from: 'Equitracción <newsletter@equitraccion.iasanmiguel.com>',
      to: [email],
      subject: 'Bienvenido a Equitracción',
      html: generateWelcomeEmailHTML(email, baseUrl),
      text: generateWelcomeEmailText(email, baseUrl),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Welcome email sent:', data?.id);
    return { success: true };

  } catch (error) {
    console.error('Exception sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Envía newsletter mensual a todos los suscriptores
 * (Para usar con el endpoint /api/newsletter/send)
 */
export async function sendNewsletterBatch(
  subscribers: string[],
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  const resend = getResend();
  if (!resend) return { success: false, sent: 0, failed: subscribers.length, errors: ['Email service not configured'] };

  for (const email of subscribers) {
    try {
      const personalizedHTML = html.replace('{{email}}', encodeURIComponent(email));
      const personalizedText = text.replace('{{email}}', encodeURIComponent(email));

      const { error } = await resend.emails.send({
        from: 'Equitracción <newsletter@equitraccion.iasanmiguel.com>',
        to: [email],
        subject: subject,
        html: personalizedHTML,
        text: personalizedText,
      });

      if (error) {
        console.error(`Failed to send to ${email}:`, error);
        failed++;
        errors.push(`${email}: ${error.message}`);
      } else {
        sent++;
      }

      // Rate limiting: pequeña pausa entre emails
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`Exception sending to ${email}:`, error);
      failed++;
      errors.push(`${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return { success: sent > 0, sent, failed, errors };
}

/**
 * Envía notificación de nuevo mensaje de contacto al admin
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  category: string;
}): Promise<void> {
  try {
    const resend = getResend();
    if (!resend) {
      console.warn('Email service not configured — contact notification skipped');
      return;
    }

    const categoryLabels: Record<string, string> = {
      'forestales': 'Servicios Forestales',
      'desarrollo': 'Desarrollo Personal',
      'formacion': 'Formación',
      'general': 'Consulta General'
    };

    await resend.emails.send({
      from: 'Equitracción Web <noreply@equitraccion.iasanmiguel.com>',
      to: 'roberto@equitraccion.com',
      subject: `Nuevo mensaje de contacto: ${data.subject}`,
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
                  <div class="value"><span class="badge">${categoryLabels[data.category] || data.category}</span></div>
                </div>
                <div class="field">
                  <div class="label">Asunto:</div>
                  <div class="value">${data.subject}</div>
                </div>
                <div class="field">
                  <div class="label">Nombre:</div>
                  <div class="value">${data.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${data.email}" style="color: #78350f;">${data.email}</a></div>
                </div>
                ${data.phone ? `
                <div class="field">
                  <div class="label">Teléfono:</div>
                  <div class="value">${data.phone}</div>
                </div>` : ''}
                <div class="field">
                  <div class="label">Mensaje:</div>
                  <div class="message-box">${data.message}</div>
                </div>
                <div style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #78350f;">
                  <strong>Accede al panel de administración</strong><br>
                  <a href="https://equitraccion.com/admin/messages" style="color: #78350f;">Ver todos los mensajes</a>
                </div>
              </div>
              <div class="footer">
                <p>Este email fue generado automáticamente desde el formulario de contacto de Equitracción.</p>
                <p><strong>No respondas a este email.</strong> Para responder al cliente, utiliza su dirección: ${data.email}</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    console.log('Contact notification email sent to roberto@equitraccion.com');
  } catch (error) {
    console.error('Error sending contact notification email:', error);
  }
}
