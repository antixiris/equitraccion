import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const checks: Record<string, string> = {};

  // Check env vars exist (import.meta.env vs process.env)
  checks.meta_FIREBASE_PROJECT_ID = import.meta.env.FIREBASE_PROJECT_ID ? 'set' : 'MISSING';
  checks.proc_FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID ? 'set' : 'MISSING';
  checks.proc_FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL ? 'set' : 'MISSING';
  checks.proc_FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY
    ? `set (${process.env.FIREBASE_PRIVATE_KEY.length} chars)`
    : 'MISSING';

  // Try Firebase init
  try {
    const { db } = await import('../../lib/firebase');
    checks.firebase_init = 'OK';

    // Try a simple read
    const snap = await db.collection('blog_posts').limit(1).get();
    checks.firestore_read = `OK (${snap.size} docs)`;
  } catch (error: any) {
    checks.firebase_error = error?.message || String(error);
  }

  return new Response(JSON.stringify(checks, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
