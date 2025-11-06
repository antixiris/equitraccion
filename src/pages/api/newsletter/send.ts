import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { generateNewsletterHTML } from '../../../lib/email/newsletter-template';

/**
 * Endpoint para enviar newsletter mensual
 * POST /api/newsletter/send
 * 
 * IMPORTANTE: Este endpoint debe ser llamado por un cron job
 * el día 1 de cada mes. Ver NEWSLETTER_SETUP.md para configuración.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Verificar token de autorización (para proteger el endpoint)
    const authHeader = request.headers.get('authorization');
    const expectedToken = import.meta.env.NEWSLETTER_CRON_TOKEN || 'change-me-in-production';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return new Response(
        JSON.stringify({ success: false, message: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener mes y año previo
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    
    const monthName = lastMonth.toLocaleDateString('es-ES', { month: 'long' });
    const year = lastMonth.getFullYear().toString();

    console.log(`📧 Generating newsletter for ${monthName} ${year}...`);

    // 1. Obtener posts publicados el mes anterior
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('blog_posts')
      .select('title, slug, excerpt, published_at, cover_image')
      .eq('published', true)
      .gte('published_at', lastMonth.toISOString())
      .lte('published_at', lastMonthEnd.toISOString())
      .order('published_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      throw new Error('Error al obtener posts');
    }

    console.log(`📝 Found ${posts?.length || 0} posts from last month`);

    // 2. Obtener cursos con fechas futuras (próximos 3 meses)
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const { data: allCourses, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('active', true);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      throw new Error('Error al obtener cursos');
    }

    // Filtrar cursos con fechas futuras
    const upcomingCourses = allCourses?.filter(course => {
      return course.dates.some((date: any) => {
        const startDate = new Date(date.start);
        return startDate > now && startDate < threeMonthsFromNow;
      });
    }).map(course => ({
      ...course,
      dates: course.dates
        .filter((date: any) => new Date(date.start) > now && new Date(date.start) < threeMonthsFromNow)
        .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())
    })) || [];

    console.log(`🎓 Found ${upcomingCourses.length} upcoming courses`);

    // 3. Generar HTML del newsletter
    // En producción, usar el dominio real desde env o config
    const baseUrl = import.meta.env.SITE_URL || 'https://equitraccion.com';

    const newsletterHTML = generateNewsletterHTML(
      posts || [],
      upcomingCourses,
      monthName,
      year,
      baseUrl
    );

    // 4. Obtener suscriptores activos
    const { data: subscribers, error: subscribersError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .select('email')
      .eq('status', 'active');

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      throw new Error('Error al obtener suscriptores');
    }

    console.log(`👥 Found ${subscribers?.length || 0} active subscribers`);

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No hay suscriptores activos',
          stats: {
            subscribers: 0,
            posts: posts?.length || 0,
            courses: upcomingCourses.length
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Enviar emails
    // IMPORTANTE: Aquí necesitarás integrar con un servicio de email
    // como SendGrid, Mailgun, AWS SES, etc.
    
    // Por ahora, guardamos el log de envío
    console.log(`📨 Would send newsletter to ${subscribers.length} subscribers`);
    console.log(`Subject: Newsletter Equitracción - ${monthName} ${year}`);
    
    // TODO: Implementar envío real de emails
    // Ejemplo con SendGrid (necesitarás instalar @sendgrid/mail):
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const emailPromises = subscribers.map(subscriber => {
      const personalizedHTML = newsletterHTML.replace('{{email}}', subscriber.email);
      
      return sgMail.send({
        to: subscriber.email,
        from: 'newsletter@equitraccion.com',
        subject: `Newsletter Equitracción - ${monthName} ${year}`,
        html: personalizedHTML
      });
    });

    await Promise.all(emailPromises);
    */

    // Respuesta de éxito
    return new Response(
      JSON.stringify({
        success: true,
        message: `Newsletter preparado para ${subscribers.length} suscriptores`,
        stats: {
          subscribers: subscribers.length,
          posts: posts?.length || 0,
          courses: upcomingCourses.length,
          month: monthName,
          year: year
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter send error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Error interno'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * GET endpoint para preview del newsletter
 * GET /api/newsletter/send?preview=true
 */
export const GET: APIRoute = async ({ url }) => {
  const isPreview = url.searchParams.get('preview') === 'true';
  
  if (!isPreview) {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Generar preview con datos de ejemplo
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const monthName = lastMonth.toLocaleDateString('es-ES', { month: 'long' });
    const year = lastMonth.getFullYear().toString();

    // Para el preview, mostrar los últimos posts publicados sin filtro de fecha
    const { data: posts } = await supabaseAdmin
      .from('blog_posts')
      .select('title, slug, excerpt, published_at, cover_image')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(5);

    const { data: allCourses } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('active', true);

    // Para el preview, mostrar todos los cursos con fechas futuras (sin límite de 3 meses)
    const upcomingCourses = allCourses?.filter(course => {
      return course.dates.some((date: any) => {
        const startDate = new Date(date.start);
        return startDate > now;
      });
    }).map(course => ({
      ...course,
      dates: course.dates
        .filter((date: any) => new Date(date.start) > now)
        .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())
    })) || [];

    // Para preview, usar localhost. Para producción, usar el dominio real
    const baseUrl = 'http://localhost:4321';

    const html = generateNewsletterHTML(
      posts || [],
      upcomingCourses,
      monthName,
      year,
      baseUrl
    );

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (error) {
    console.error('Preview error:', error);
    return new Response('Error generating preview', { status: 500 });
  }
};
