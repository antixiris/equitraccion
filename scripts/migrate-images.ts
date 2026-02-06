/**
 * Migra imágenes de Supabase Storage a Firebase Cloud Storage.
 * Actualiza las URLs en los documentos de Firestore.
 *
 * Uso: npx tsx scripts/migrate-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer .env
function loadEnv(): Record<string, string> {
  try {
    const envContent = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
    const env: Record<string, string> = {};
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
    return env;
  } catch {
    return process.env as Record<string, string>;
  }
}

const env = loadEnv();

// Supabase client
const supabaseUrl = env.PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

// Firebase
initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  }),
  storageBucket: `${env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
});

const db = getFirestore();
const bucket = getStorage().bucket();

/**
 * Extrae URLs de imágenes de Supabase Storage de un contenido HTML/markdown.
 */
function extractSupabaseImageUrls(content: string, supabaseUrl: string): string[] {
  const regex = new RegExp(`${supabaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/storage/v1/object/public/images/[^"'\\s)]+`, 'g');
  return [...new Set(content.match(regex) || [])];
}

/**
 * Descarga una imagen por URL y la sube a Firebase Storage.
 */
async function migrateImage(imageUrl: string): Promise<string | null> {
  try {
    // Extraer el path del archivo en Supabase
    const urlObj = new URL(imageUrl);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)/);
    if (!pathMatch) return null;

    const supabasePath = pathMatch[1];
    const firebasePath = `blog/${supabasePath.split('/').pop()}`; // Flat en blog/

    // Verificar si ya existe en Firebase
    const firebaseFile = bucket.file(firebasePath);
    const [exists] = await firebaseFile.exists();
    if (exists) {
      console.log(`  ⏭️  Ya existe: ${firebasePath}`);
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${firebasePath}`;
      return publicUrl;
    }

    // Descargar de Supabase
    console.log(`  ⬇️  Descargando: ${supabasePath}`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`  ❌ Error descargando ${imageUrl}: ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Subir a Firebase
    console.log(`  ⬆️  Subiendo: ${firebasePath}`);
    await firebaseFile.save(buffer, {
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Hacer público
    await firebaseFile.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${firebasePath}`;
    console.log(`  ✅ Migrada: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`  ❌ Error migrando ${imageUrl}:`, error);
    return null;
  }
}

async function main() {
  console.log('🖼️  Migrando imágenes de Supabase Storage a Firebase...\n');

  // Obtener todos los blog posts de Firestore
  const postsSnapshot = await db.collection('blog_posts').get();
  console.log(`📝 ${postsSnapshot.size} posts encontrados\n`);

  const urlMap: Map<string, string> = new Map(); // old → new URL
  let migratedCount = 0;

  for (const doc of postsSnapshot.docs) {
    const post = doc.data();
    let needsUpdate = false;
    const updates: Record<string, string> = {};

    // 1. Migrar cover_image
    if (post.cover_image && post.cover_image.includes('supabase')) {
      const newUrl = urlMap.get(post.cover_image) || await migrateImage(post.cover_image);
      if (newUrl) {
        urlMap.set(post.cover_image, newUrl);
        updates.cover_image = newUrl;
        needsUpdate = true;
        migratedCount++;
      }
    }

    // 2. Migrar imágenes inline en content
    if (post.content) {
      const inlineUrls = extractSupabaseImageUrls(post.content, supabaseUrl!);
      let updatedContent = post.content;

      for (const oldUrl of inlineUrls) {
        const newUrl = urlMap.get(oldUrl) || await migrateImage(oldUrl);
        if (newUrl) {
          urlMap.set(oldUrl, newUrl);
          updatedContent = updatedContent.replaceAll(oldUrl, newUrl);
          migratedCount++;
        }
      }

      if (updatedContent !== post.content) {
        updates.content = updatedContent;
        needsUpdate = true;
      }
    }

    // Actualizar documento si hubo cambios
    if (needsUpdate) {
      await doc.ref.update(updates);
      console.log(`  📄 Actualizado post: ${post.slug}`);
    }
  }

  console.log(`\n✅ Migración completa: ${migratedCount} imágenes procesadas`);
  console.log(`📊 URL map: ${urlMap.size} URLs únicas mapeadas`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
