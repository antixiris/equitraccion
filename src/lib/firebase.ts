import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Helper: Astro expone vars server-side via import.meta.env en dev,
// pero en Vercel las vars sin prefijo PUBLIC_ solo están en process.env
const env = (key: string) => import.meta.env[key] || process.env[key] || '';

// Singleton: solo inicializar si no existe ya una app
if (!getApps().length) {
  const privateKey = env('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
  const projectId = env('FIREBASE_PROJECT_ID');

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail: env('FIREBASE_CLIENT_EMAIL'),
    privateKey,
  };

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${projectId}.firebasestorage.app`,
  });
}

export const db = getFirestore();
export const bucket = getStorage().bucket();

// ─── TypeScript interfaces (agnósticas del backend) ───

export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  author: string;
  category: 'forestales' | 'desarrollo' | 'formacion' | 'fundacion';
  tags?: string[];
  published: boolean;
  published_at?: string;
  reading_time?: number;
}

export interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'forestales' | 'desarrollo' | 'formacion' | 'general';
  status: 'new' | 'read' | 'replied' | 'archived';
}

export interface Newsletter {
  id: string;
  created_at: string;
  email: string;
  status: 'active' | 'unsubscribed';
  source?: string;
}

export interface CourseDate {
  start: string;
  end: string;
  spots_available: number;
  notes?: string;
}

export interface Course {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  duration_days: number;
  level: number;
  experience_level: 'Iniciación' | 'Intermedio' | 'Avanzado';
  max_participants: number;
  price: number;
  target_audience: string;
  contents: string;
  requirements?: string;
  dates: CourseDate[];
  location: string;
  active: boolean;
}
