/**
 * Importa datos exportados de Supabase a Firestore.
 * Uso: npx tsx scripts/import-to-firestore.ts
 *
 * Idempotente: usa IDs determinísticos, se puede ejecutar múltiples veces.
 * Requiere variables de entorno:
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'migration-data');

// Leer variables de .env
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

if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
  console.error('❌ Faltan variables FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL o FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function loadJSON(filename: string): any[] {
  const filePath = join(DATA_DIR, filename);
  if (!existsSync(filePath)) {
    console.warn(`⚠️  ${filename} no encontrado, saltando`);
    return [];
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

async function importBlogPosts() {
  const posts = loadJSON('blog_posts.json');
  if (!posts.length) return;

  console.log(`📝 Importando ${posts.length} blog posts...`);
  const col = db.collection('blog_posts');

  // Batch writes (máx 500 ops por batch)
  let batch = db.batch();
  let count = 0;

  for (const post of posts) {
    const docRef = col.doc(post.slug); // slug como doc ID
    batch.set(docRef, {
      id: post.id,
      created_at: post.created_at,
      updated_at: post.updated_at,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || null,
      author: post.author,
      category: post.category,
      tags: post.tags || [],
      published: post.published,
      published_at: post.published_at || null,
      reading_time: calculateReadingTime(post.content),
    });
    count++;

    if (count % 450 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (count % 450 !== 0) await batch.commit();
  console.log(`  ✅ ${count} posts importados`);
}

async function importNewsletterSubscriptions() {
  const subs = loadJSON('newsletter_subscriptions.json');
  if (!subs.length) return;

  console.log(`📧 Importando ${subs.length} suscripciones...`);
  const col = db.collection('newsletter_subscriptions');

  let batch = db.batch();
  let count = 0;

  for (const sub of subs) {
    // email normalizado como doc ID = unicidad garantizada
    const docId = sub.email.toLowerCase().trim();
    const docRef = col.doc(docId);
    batch.set(docRef, {
      id: sub.id,
      created_at: sub.created_at,
      email: sub.email,
      status: sub.status,
      source: sub.source || null,
    });
    count++;

    if (count % 450 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (count % 450 !== 0) await batch.commit();
  console.log(`  ✅ ${count} suscripciones importadas`);
}

async function importContactSubmissions() {
  const submissions = loadJSON('contact_submissions.json');
  if (!submissions.length) return;

  console.log(`💬 Importando ${submissions.length} mensajes de contacto...`);
  const col = db.collection('contact_submissions');

  let batch = db.batch();
  let count = 0;

  for (const msg of submissions) {
    // Usar el UUID original de Supabase como doc ID para idempotencia
    const docRef = col.doc(msg.id);
    batch.set(docRef, {
      id: msg.id,
      created_at: msg.created_at,
      name: msg.name,
      email: msg.email,
      phone: msg.phone || null,
      subject: msg.subject,
      message: msg.message,
      category: msg.category,
      status: msg.status,
    });
    count++;

    if (count % 450 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (count % 450 !== 0) await batch.commit();
  console.log(`  ✅ ${count} mensajes importados`);
}

async function importCourses() {
  const courses = loadJSON('courses.json');
  if (!courses.length) return;

  console.log(`🎓 Importando ${courses.length} cursos...`);
  const col = db.collection('courses');

  let batch = db.batch();
  let count = 0;

  for (const course of courses) {
    // Usar UUID original como doc ID para idempotencia
    const docRef = col.doc(course.id);
    batch.set(docRef, {
      id: course.id,
      created_at: course.created_at,
      updated_at: course.updated_at,
      title: course.title,
      duration_days: course.duration_days,
      level: course.level,
      experience_level: course.experience_level,
      max_participants: course.max_participants,
      price: course.price,
      target_audience: course.target_audience,
      contents: course.contents,
      requirements: course.requirements || null,
      dates: course.dates,
      location: course.location,
      active: course.active,
    });
    count++;

    if (count % 450 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  if (count % 450 !== 0) await batch.commit();
  console.log(`  ✅ ${count} cursos importados`);
}

async function verifyImport() {
  console.log('\n🔍 Verificando importación...\n');

  const collections = [
    'blog_posts',
    'newsletter_subscriptions',
    'contact_submissions',
    'courses',
  ];

  for (const col of collections) {
    const snapshot = await db.collection(col).count().get();
    const count = snapshot.data().count;
    console.log(`  ${col}: ${count} documentos`);
  }
}

async function main() {
  console.log('🚀 Importando datos a Firestore...\n');

  await importBlogPosts();
  await importNewsletterSubscriptions();
  await importContactSubmissions();
  await importCourses();
  await verifyImport();

  console.log('\n✅ Importación completa');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
