import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://equitraccion.com';

  // Static pages with their priority and change frequency
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // homepage
    { url: '/servicios-forestales', priority: '0.9', changefreq: 'weekly' },
    { url: '/desarrollo-personal', priority: '0.9', changefreq: 'weekly' },
    { url: '/formacion', priority: '0.8', changefreq: 'monthly' },
    { url: '/fundacion', priority: '0.7', changefreq: 'monthly' },
    { url: '/contacto', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
  ];

  // Get published blog posts from Supabase
  let blogPosts: any[] = [];
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (data) {
      blogPosts = data;
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Build XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${blogPosts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at || post.published_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    }
  });
};
