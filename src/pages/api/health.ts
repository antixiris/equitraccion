import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const diagnostics: Record<string, string> = {};

  // Step 1: Check env vars
  try {
    const projectId = import.meta.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '';
    const clientEmail = import.meta.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL || '';
    const privateKey = import.meta.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY || '';

    diagnostics.projectId = projectId ? `OK (${projectId})` : 'MISSING';
    diagnostics.clientEmail = clientEmail ? `OK (${clientEmail.substring(0, 20)}...)` : 'MISSING';
    diagnostics.privateKey = privateKey ? `OK (${privateKey.substring(0, 30)}...)` : 'MISSING';
  } catch (e: any) {
    diagnostics.envError = e.message;
  }

  // Step 2: Try importing firebase
  try {
    const { db } = await import('../../lib/firebase');
    diagnostics.firebaseImport = 'OK';

    // Step 3: Try a simple query
    try {
      const snapshot = await db.collection('blog_posts').limit(1).get();
      diagnostics.firestoreQuery = `OK (${snapshot.size} docs)`;
    } catch (e: any) {
      diagnostics.firestoreQuery = `FAIL: ${e.message}`;
    }
  } catch (e: any) {
    diagnostics.firebaseImport = `FAIL: ${e.message}`;
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
