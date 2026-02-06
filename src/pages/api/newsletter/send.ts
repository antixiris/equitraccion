import type { APIRoute } from 'astro';
import { db } from '../../../lib/firebase';
import { generateNewsletterHTML } from '../../../lib/email/newsletter-template';

/**
 * Endpoint para enviar newsletter mensual
 * POST /api/newsletter/send
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = import.meta.env.NEWSLETTER_CRON_TOKEN || process.env.NEWSLETTER_CRON_TOKEN || 'change-me-in-production';

    if (authHeader !== `Bearer ${expectedToken}`) {
      return new Response(
        JSON.stringify({ success: false, message: 'No autorizado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const monthName = lastMonth.toLocaleDateString('es-ES', { month: 'long' });
    const year = lastMonth.getFullYear().toString();

    console.log(`Generating newsletter for ${monthName} ${year}...`);

    // 1. Obtener posts publicados el mes anterior
    const postsSnapshot = await db.collection('blog_posts')
      .where('published', '==', true)
      .where('published_at', '>=', lastMonth.toISOString())
      .where('published_at', '<=', lastMonthEnd.toISOString())
      .orderBy('published_at', 'desc')
      .get();

    const posts = postsSnapshot.docs.map(doc => doc.data());
    console.log(`Found ${posts.length} posts from last month`);

    // 2. Obtener cursos activos con fechas futuras
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const coursesSnapshot = await db.collection('courses')
      .where('active', '==', true)
      .get();

    const upcomingCourses = coursesSnapshot.docs
      .map(doc => doc.data())
      .filter(course => {
        return course.dates.some((date: any) => {
          const startDate = new Date(date.start);
          return startDate > now && startDate < threeMonthsFromNow;
        });
      })
      .map(course => ({
        ...course,
        dates: course.dates
          .filter((date: any) => new Date(date.start) > now && new Date(date.start) < threeMonthsFromNow)
          .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime()),
      }));

    console.log(`Found ${upcomingCourses.length} upcoming courses`);

    // 3. Generar HTML
    const baseUrl = import.meta.env.SITE_URL || 'https://equitraccion.com';
    const newsletterHTMLTemplate = generateNewsletterHTML(posts, upcomingCourses, monthName, year, baseUrl);

    // 4. Obtener suscriptores activos
    const subscribersSnapshot = await db.collection('newsletter_subscriptions')
      .where('status', '==', 'active')
      .get();

    const subscribers = subscribersSnapshot.docs.map(doc => doc.data());
    console.log(`Found ${subscribers.length} active subscribers`);

    if (subscribers.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No hay suscriptores activos',
          stats: { subscribers: 0, posts: posts.length, courses: upcomingCourses.length },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Log de envío (TODO: implementar envío real)
    console.log(`Would send newsletter to ${subscribers.length} subscribers`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Newsletter preparado para ${subscribers.length} suscriptores`,
        stats: {
          subscribers: subscribers.length,
          posts: posts.length,
          courses: upcomingCourses.length,
          month: monthName,
          year,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter send error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error instanceof Error ? error.message : 'Error interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * GET endpoint para preview del newsletter
 */
export const GET: APIRoute = async ({ url }) => {
  const isPreview = url.searchParams.get('preview') === 'true';

  if (!isPreview) {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const monthName = lastMonth.toLocaleDateString('es-ES', { month: 'long' });
    const year = lastMonth.getFullYear().toString();

    const postsSnapshot = await db.collection('blog_posts')
      .where('published', '==', true)
      .orderBy('published_at', 'desc')
      .limit(5)
      .get();

    const posts = postsSnapshot.docs.map(doc => doc.data());

    const coursesSnapshot = await db.collection('courses')
      .where('active', '==', true)
      .get();

    const upcomingCourses = coursesSnapshot.docs
      .map(doc => doc.data())
      .filter(course => course.dates.some((date: any) => new Date(date.start) > now))
      .map(course => ({
        ...course,
        dates: course.dates
          .filter((date: any) => new Date(date.start) > now)
          .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime()),
      }));

    const baseUrl = 'http://localhost:4321';
    const html = generateNewsletterHTML(posts, upcomingCourses, monthName, year, baseUrl);

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    console.error('Preview error:', error);
    return new Response('Error generating preview', { status: 500 });
  }
};
