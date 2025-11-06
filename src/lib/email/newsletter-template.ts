interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  cover_image?: string;
}

interface Course {
  title: string;
  dates: Array<{
    start: string;
    end: string;
    spots_available: number;
  }>;
  location: string;
  price: number;
  experience_level: string;
}

export function generateNewsletterHTML(
  posts: BlogPost[],
  courses: Course[],
  month: string,
  year: string,
  baseUrl: string = 'https://equitraccion.com'
): string {
  const postsHTML = posts.length > 0
    ? posts.map(post => `
        <tr>
          <td style="padding: 0 0 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${post.cover_image ? `
              <tr>
                <td style="padding-bottom: 20px;">
                  <a href="${baseUrl}/blog/${post.slug}" style="display: block;">
                    <img src="${baseUrl}${post.cover_image}" alt="${post.title}" style="width: 100%; height: auto; display: block; border-radius: 4px;" />
                  </a>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td>
                  <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 400; color: #1a1a1a; line-height: 1.3; font-family: 'Crimson Pro', Georgia, serif;">
                    <a href="${baseUrl}/blog/${post.slug}" style="color: #1a1a1a; text-decoration: none;">
                      ${post.title}
                    </a>
                  </h2>
                  <p style="margin: 0 0 16px 0; color: #6b6b6b; line-height: 1.7; font-size: 17px; font-family: 'Crimson Text', Georgia, serif;">
                    ${post.excerpt}
                  </p>
                  <a href="${baseUrl}/blog/${post.slug}"
                     style="display: inline-block; color: #1a1a1a; text-decoration: none; font-size: 16px; font-weight: 500; border-bottom: 1px solid #1a1a1a; padding-bottom: 2px;">
                    Leer artículo completo
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `).join('')
    : '<tr><td style="padding: 20px 0; text-align: center; color: #999; font-style: italic;">No hay artículos nuevos este mes.</td></tr>';

  const coursesHTML = courses.length > 0
    ? courses.map(course => {
        const date = course.dates[0];
        const startDate = new Date(date.start);
        const endDate = new Date(date.end);
        const dateStr = `${startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;

        return `
        <tr>
          <td style="padding: 0 0 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #fafafa; border-left: 3px solid #1a1a1a;">
              <tr>
                <td style="padding: 24px 24px 20px 24px;">
                  <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; padding: 4px 10px; background-color: #1a1a1a; color: #ffffff; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
                      ${course.experience_level}
                    </span>
                  </div>
                  <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; font-family: 'Crimson Pro', Georgia, serif;">
                    ${course.title}
                  </h3>
                  <p style="margin: 0 0 8px 0; color: #6b6b6b; font-size: 15px; line-height: 1.5;">
                    ${dateStr}
                  </p>
                  <p style="margin: 0 0 8px 0; color: #6b6b6b; font-size: 15px; line-height: 1.5;">
                    ${course.location}
                  </p>
                  <p style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                    ${course.price}€ · ${date.spots_available} plazas disponibles
                  </p>
                  <a href="${baseUrl}/contacto"
                     style="display: inline-block; padding: 12px 24px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; transition: background-color 0.2s;">
                    Reservar plaza
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
      }).join('')
    : '<tr><td style="padding: 20px 0; text-align: center; color: #999; font-style: italic;">No hay cursos programados próximamente.</td></tr>';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Equitracción Newsletter - ${month} ${year}</title>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Crimson Text', Georgia, serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="680" cellpadding="0" cellspacing="0" style="max-width: 680px;">

          <!-- Logo y Header -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="padding-bottom: 24px;">
                    <img src="${baseUrl}/images/logo-equitraccion.png" alt="Equitracción" width="120" height="auto" style="display: block;" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <h1 style="margin: 0 0 8px 0; font-size: 42px; font-weight: 400; color: #1a1a1a; letter-spacing: -0.5px; font-family: 'Crimson Pro', Georgia, serif;">
                      Equitracción
                    </h1>
                    <p style="margin: 0; font-size: 16px; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                      Newsletter · ${month} ${year}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 0 40px 0;">
              <div style="width: 100%; height: 1px; background-color: #e0e0e0;"></div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 0 0 48px 0;">
              <p style="margin: 0 0 20px 0; font-size: 19px; line-height: 1.7; color: #1a1a1a; font-family: 'Crimson Text', Georgia, serif;">
                Estimados amigos de Equitracción,
              </p>
              <p style="margin: 0; font-size: 19px; line-height: 1.7; color: #3a3a3a; font-family: 'Crimson Text', Georgia, serif;">
                Este mes compartimos reflexiones sobre silvicultura sostenible, trabajo consciente con caballos y las próximas fechas de nuestros programas de formación. Os invitamos a explorar estas lecturas y convocatorias.
              </p>
            </td>
          </tr>

          <!-- Artículos Section -->
          <tr>
            <td style="padding: 0 0 24px 0;">
              <h2 style="margin: 0 0 32px 0; font-size: 32px; font-weight: 400; color: #1a1a1a; font-family: 'Crimson Pro', Georgia, serif; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px;">
                Artículos del mes
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${postsHTML}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 0;">
              <div style="width: 100%; height: 1px; background-color: #e0e0e0;"></div>
            </td>
          </tr>

          <!-- Cursos Section -->
          <tr>
            <td style="padding: 0 0 24px 0;">
              <h2 style="margin: 0 0 32px 0; font-size: 32px; font-weight: 400; color: #1a1a1a; font-family: 'Crimson Pro', Georgia, serif; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px;">
                Formación
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${coursesHTML}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 0;">
              <div style="width: 100%; height: 1px; background-color: #e0e0e0;"></div>
            </td>
          </tr>

          <!-- CTA Section -->
          <tr>
            <td style="padding: 40px 0; text-align: center;">
              <p style="margin: 0 0 24px 0; font-size: 18px; color: #1a1a1a; font-family: 'Crimson Text', Georgia, serif;">
                Descubre más sobre nuestro trabajo
              </p>
              <a href="${baseUrl}"
                 style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; letter-spacing: 0.5px;">
                VISITAR WEB
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
                <a href="${baseUrl}/newsletter/unsubscribe?email={{email}}" style="color: #999; text-decoration: underline;">
                  Cancelar suscripción
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
