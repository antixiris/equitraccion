import type { APIRoute } from 'astro';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const imagePath = join(process.cwd(), 'public', 'images', 'blog', slug);

    if (!existsSync(imagePath)) {
      return new Response('Image not found', { status: 404 });
    }

    const imageBuffer = await readFile(imagePath);

    // Determine content type based on extension
    const extension = slug.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };

    const contentType = contentTypeMap[extension || ''] || 'application/octet-stream';

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Error loading image', { status: 500 });
  }
};
