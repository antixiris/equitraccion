import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { isAuthenticated } from '../../lib/auth/jwt';

export const POST: APIRoute = async (context) => {
  try {
    // 🔐 Verificar autenticación
    const authenticated = isAuthenticated(context);
    if (!authenticated) {
      return new Response(
        JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await context.request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No se proporcionó ninguna imagen' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'La imagen es demasiado grande. Máximo 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);

    // 🛡️ Mapear MIME type a extensión (no confiar en nombre de archivo)
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif'
    };

    const extension = mimeToExt[file.type] || 'jpg';
    const filename = `${timestamp}-${randomStr}.${extension}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'images', 'blog');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return URL
    const url = `/images/blog/${filename}`;

    return new Response(JSON.stringify({
      success: true,
      url,
      filename
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error uploading image:', error);
    return new Response(JSON.stringify({
      error: 'Error al subir la imagen: ' + error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
