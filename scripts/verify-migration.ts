/**
 * Verifica la integridad de la migración comparando Supabase con Firestore.
 * Uso: npx tsx scripts/verify-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

// Supabase
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
});

const db = getFirestore();

async function verifyCollection(
  tableName: string,
  collectionName: string
): Promise<{ match: boolean; supabaseCount: number; firestoreCount: number }> {
  // Count Supabase
  const { count: supabaseCount, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error(`  ❌ Error leyendo ${tableName} de Supabase:`, error.message);
    return { match: false, supabaseCount: 0, firestoreCount: 0 };
  }

  // Count Firestore
  const firestoreSnapshot = await db.collection(collectionName).count().get();
  const firestoreCount = firestoreSnapshot.data().count;

  const match = supabaseCount === firestoreCount;
  return { match, supabaseCount: supabaseCount ?? 0, firestoreCount };
}

async function verifyImageUrls() {
  console.log('\n🖼️  Verificando URLs de imágenes...');

  const postsSnapshot = await db.collection('blog_posts').get();
  let totalImages = 0;
  let brokenImages = 0;

  for (const doc of postsSnapshot.docs) {
    const post = doc.data();

    if (post.cover_image) {
      totalImages++;
      try {
        const response = await fetch(post.cover_image, { method: 'HEAD' });
        if (!response.ok) {
          console.error(`  ❌ Imagen rota en "${post.slug}": ${post.cover_image} (${response.status})`);
          brokenImages++;
        }
      } catch {
        console.error(`  ❌ Imagen inaccesible en "${post.slug}": ${post.cover_image}`);
        brokenImages++;
      }
    }
  }

  console.log(`  Total: ${totalImages} imágenes, ${brokenImages} rotas`);
  return brokenImages === 0;
}

async function verifyKeyDocuments() {
  console.log('\n🔑 Verificando documentos clave...');

  // Verificar que hay al menos un post publicado
  const publishedPost = await db.collection('blog_posts')
    .where('published', '==', true)
    .limit(1)
    .get();

  if (publishedPost.empty) {
    console.error('  ❌ No hay posts publicados');
    return false;
  }
  console.log(`  ✅ Posts publicados encontrados`);

  // Verificar que los slugs coinciden con los IDs de documento
  const samplePost = publishedPost.docs[0];
  if (samplePost.id === samplePost.data().slug) {
    console.log(`  ✅ Doc ID coincide con slug: "${samplePost.id}"`);
  } else {
    console.error(`  ❌ Doc ID "${samplePost.id}" no coincide con slug "${samplePost.data().slug}"`);
    return false;
  }

  return true;
}

async function main() {
  console.log('🔍 Verificando migración Supabase → Firestore\n');

  const collections = [
    { table: 'blog_posts', collection: 'blog_posts' },
    { table: 'contact_submissions', collection: 'contact_submissions' },
    { table: 'newsletter_subscriptions', collection: 'newsletter_subscriptions' },
    { table: 'courses', collection: 'courses' },
  ];

  let allMatch = true;

  console.log('📊 Comparando conteos:');
  for (const { table, collection } of collections) {
    const result = await verifyCollection(table, collection);
    const icon = result.match ? '✅' : '❌';
    console.log(`  ${icon} ${collection}: Supabase=${result.supabaseCount}, Firestore=${result.firestoreCount}`);
    if (!result.match) allMatch = false;
  }

  const docsOk = await verifyKeyDocuments();
  const imagesOk = await verifyImageUrls();

  console.log('\n' + '═'.repeat(50));
  if (allMatch && docsOk && imagesOk) {
    console.log('✅ MIGRACIÓN VERIFICADA: Todos los datos coinciden');
  } else {
    console.log('❌ MIGRACIÓN INCOMPLETA: Hay discrepancias');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
