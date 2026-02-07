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

  // Step 4: Test JWT
  try {
    const { generateToken, verifyToken } = await import('../../lib/auth/jwt');
    const token = generateToken('test@test.com', 'admin');
    diagnostics.jwtGenerate = token ? `OK (${token.substring(0, 20)}...)` : 'FAIL: empty token';
    const payload = verifyToken(token);
    diagnostics.jwtVerify = payload ? `OK (${payload.email})` : 'FAIL: null payload';
  } catch (e: any) {
    diagnostics.jwtError = `FAIL: ${e.message}`;
  }

  // Step 5: Check admin env vars
  try {
    const adminEmail = import.meta.env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || '';
    const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '';
    diagnostics.adminEmail = adminEmail ? 'OK' : 'MISSING';
    diagnostics.adminPassword = adminPassword ? 'OK' : 'MISSING';
  } catch (e: any) {
    diagnostics.adminEnvError = e.message;
  }

  // Step 6: Test login flow (simulate)
  try {
    const { generateToken } = await import('../../lib/auth/jwt');
    const adminEmail = import.meta.env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || '';
    const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '';

    // Test password comparison
    const testPassword = 'Admin2025!';
    const passwordMatch = testPassword === adminPassword;
    diagnostics.passwordMatch = passwordMatch ? 'OK' : `FAIL (expected match)`;

    // Test token generation
    const token = generateToken(adminEmail, 'admin');
    diagnostics.loginToken = token ? 'OK' : 'FAIL';

    // Test bcrypt import
    const bcrypt = await import('bcryptjs');
    diagnostics.bcryptImport = bcrypt ? 'OK' : 'FAIL';
  } catch (e: any) {
    diagnostics.loginFlowError = `FAIL: ${e.message}\n${e.stack?.substring(0, 200)}`;
  }

  // Step 7: Test resend import
  try {
    await import('../../lib/email/resend-client');
    diagnostics.resendImport = 'OK';
  } catch (e: any) {
    diagnostics.resendImport = `FAIL: ${e.message}`;
  }

  // Step 8: Test sanitize import
  try {
    await import('../../lib/validation/sanitize');
    diagnostics.sanitizeImport = 'OK';
  } catch (e: any) {
    diagnostics.sanitizeImport = `FAIL: ${e.message}`;
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
