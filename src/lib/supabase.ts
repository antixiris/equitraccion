import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (uses anon key, safe for browser)
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Server-side Supabase client (uses service role key, only for API routes)
export const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

// Database types for type safety
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
