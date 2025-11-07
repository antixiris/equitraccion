/**
 * Plantilla de email de bienvenida para nuevos suscriptores
 * Estilo minimalista inspirado en Medium, similar a la newsletter mensual
 */
export function generateWelcomeEmailHTML(
  email: string,
  baseUrl: string = 'https://equitraccion.com'
): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Bienvenido a Equitracción!</title>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Crimson Text', Georgia, serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="680" cellpadding="0" cellspacing="0" style="max-width: 680px;">

          <!-- Logo -->
          <tr>
            <td align="left" style="padding-bottom: 32px;">
              <img src="https://equitraccion.vercel.app/images/logo-equitraccion.png" alt="Equitracción" width="240" height="auto" style="display: block;" />
            </td>
          </tr>

          <!-- Título -->
          <tr>
            <td>
              <h1 style="margin: 0 0 32px 0; font-size: 42px; font-weight: 400; color: #1a1a1a; letter-spacing: -0.5px; font-family: 'Crimson Pro', Georgia, serif; line-height: 1.2;">
                Bienvenido
              </h1>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 0 40px 0;">
              <div style="width: 100%; height: 1px; background-color: #e0e0e0;"></div>
            </td>
          </tr>

          <!-- Contenido principal -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <p style="margin: 0 0 24px 0; font-size: 19px; line-height: 1.7; color: #1a1a1a; font-family: 'Crimson Text', Georgia, serif;">
                Gracias por unirte a la comunidad de Equitracción.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 19px; line-height: 1.7; color: #3a3a3a; font-family: 'Crimson Text', Georgia, serif;">
                Cada mes recibirás historias, reflexiones y conocimiento técnico sobre silvicultura sostenible, tracción animal y desarrollo personal asistido por caballos. Contenido pensado para quienes buscan una relación más consciente con la naturaleza y el trabajo en el bosque.
              </p>
              <p style="margin: 0; font-size: 19px; line-height: 1.7; color: #3a3a3a; font-family: 'Crimson Text', Georgia, serif;">
                Mientras tanto, te invitamos a explorar lo que hacemos.
              </p>
            </td>
          </tr>

          <!-- Enlaces simples -->
          <tr>
            <td style="padding: 0 0 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <a href="${baseUrl}/servicios-forestales" style="display: inline-block; color: #1a1a1a; text-decoration: none; font-size: 17px; font-weight: 500; border-bottom: 1px solid #1a1a1a; padding-bottom: 2px; font-family: 'Crimson Text', Georgia, serif;">
                      Servicios Forestales →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 16px;">
                    <a href="${baseUrl}/desarrollo-personal" style="display: inline-block; color: #1a1a1a; text-decoration: none; font-size: 17px; font-weight: 500; border-bottom: 1px solid #1a1a1a; padding-bottom: 2px; font-family: 'Crimson Text', Georgia, serif;">
                      Desarrollo Personal →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 16px;">
                    <a href="${baseUrl}/blog" style="display: inline-block; color: #1a1a1a; text-decoration: none; font-size: 17px; font-weight: 500; border-bottom: 1px solid #1a1a1a; padding-bottom: 2px; font-family: 'Crimson Text', Georgia, serif;">
                      Leer el Blog →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 0;">
              <div style="width: 100%; height: 1px; background-color: #e0e0e0;"></div>
            </td>
          </tr>

          <!-- CTA simple -->
          <tr>
            <td style="padding: 0 0 40px 0; text-align: center;">
              <p style="margin: 0 0 24px 0; font-size: 18px; color: #1a1a1a; font-family: 'Crimson Text', Georgia, serif;">
                ¿Necesitas más información?
              </p>
              <a href="${baseUrl}/contacto"
                 style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; letter-spacing: 0.5px;">
                CONTACTAR
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 40px 0 0 0; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 15px; font-weight: 600;">
                Fundación Equitracción
              </p>
              <p style="margin: 0 0 16px 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                Talaveruela de la Vera, Cáceres<br>
                Tel: +34 681 298 028 · info@equitraccion.com
              </p>
              <p style="margin: 0; color: #999; font-size: 13px; line-height: 1.6;">
                Recibes este email porque te suscribiste al newsletter de Equitracción.<br>
                <a href="${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color: #999; text-decoration: underline;">
                  Darse de baja
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Versión de texto plano del email de bienvenida (fallback)
 */
export function generateWelcomeEmailText(
  email: string,
  baseUrl: string = 'https://equitraccion.com'
): string {
  return `
BIENVENIDO A EQUITRACCIÓN

Gracias por unirte a nuestra comunidad.

Cada mes recibirás historias, reflexiones y conocimiento técnico sobre silvicultura sostenible, tracción animal y desarrollo personal asistido por caballos.

Mientras tanto, explora lo que hacemos:

→ Servicios Forestales
  ${baseUrl}/servicios-forestales

→ Desarrollo Personal
  ${baseUrl}/desarrollo-personal

→ Blog
  ${baseUrl}/blog

¿Necesitas más información?
Contacta: ${baseUrl}/contacto

---
Fundación Equitracción
Talaveruela de la Vera, Cáceres
Tel: +34 681 298 028
Email: info@equitraccion.com

Darse de baja: ${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}
  `.trim();
}
