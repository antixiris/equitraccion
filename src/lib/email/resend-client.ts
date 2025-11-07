import { Resend } from 'resend';
import { generateWelcomeEmailHTML, generateWelcomeEmailText } from './welcome-template';

// Inicializar cliente de Resend
const resend = new Resend(import.meta.env.RESEND_API_KEY);

/**
 * Envía email de bienvenida a nuevo suscriptor
 */
export async function sendWelcomeEmail(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const baseUrl = import.meta.env.SITE_URL || 'https://equitraccion.com';

    const { data, error } = await resend.emails.send({
      from: 'Equitracción <newsletter@equitraccion.com>',
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

  for (const email of subscribers) {
    try {
      // Personalizar HTML con el email del suscriptor
      const personalizedHTML = html.replace('{{email}}', encodeURIComponent(email));
      const personalizedText = text.replace('{{email}}', encodeURIComponent(email));

      const { error } = await resend.emails.send({
        from: 'Equitracción <newsletter@equitraccion.com>',
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
