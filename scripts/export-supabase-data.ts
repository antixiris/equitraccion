/**
 * Exporta todos los datos de Supabase como JSON para migración.
 * Uso: npx tsx scripts/export-supabase-data.ts
 *
 * Requiere variables de entorno:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'migration-data');

// Leer variables de .env manualmente (el script se ejecuta fuera de Astro)
import { readFileSync } from 'fs';
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

const supabaseUrl = env.PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = [
  'blog_posts',
  'contact_submissions',
  'newsletter_subscriptions',
  'courses',
] as const;

async function exportAll() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('📦 Exportando datos de Supabase...\n');

  for (const table of TABLES) {
    const { data, error } = await supabase
      .from(table)
      .select('*');

    if (error) {
      console.error(`❌ Error exportando ${table}:`, error.message);
      continue;
    }

    const filePath = join(OUTPUT_DIR, `${table}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ ${table}: ${data?.length ?? 0} registros → ${filePath}`);
  }

  console.log('\n✅ Exportación completa');
}

exportAll().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
