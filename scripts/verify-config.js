#!/usr/bin/env node

/**
 * Script de verificación de configuración pre-deployment
 * Verifica que todas las variables de entorno necesarias estén configuradas
 * y cumplan con los requisitos de seguridad
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colores para output en consola
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  error: (msg) => console.error(`${colors.red}❌ ERROR: ${msg}${colors.reset}`),
  warning: (msg) => console.warn(`${colors.yellow}⚠️  WARNING: ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

// Variables requeridas
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'SITE_URL',
  'SESSION_SECRET'
];

// Variables opcionales
const optionalEnvVars = [
  'GA_TRACKING_ID',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'RATE_LIMIT_MAX',
  'RATE_LIMIT_WINDOW'
];

let hasErrors = false;
let hasWarnings = false;

console.log('\n🔍 Verificando configuración de producción...\n');

// Función para cargar .env si existe
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return env;
  } catch (error) {
    log.warning('Archivo .env no encontrado. Usando variables de entorno del sistema.');
    return process.env;
  }
}

const env = loadEnv();

// Verificar variables requeridas
console.log('📋 Variables requeridas:');
requiredEnvVars.forEach(varName => {
  if (!env[varName]) {
    log.error(`${varName} no está configurada`);
    hasErrors = true;
  } else if (env[varName].includes('your_') || env[varName].includes('change_this')) {
    log.error(`${varName} tiene un valor de placeholder - debe ser configurada`);
    hasErrors = true;
  } else {
    log.success(`${varName} configurada`);
  }
});

console.log('\n📋 Variables opcionales:');
optionalEnvVars.forEach(varName => {
  if (!env[varName]) {
    log.info(`${varName} no configurada (opcional)`);
  } else {
    log.success(`${varName} configurada`);
  }
});

// Verificaciones de seguridad específicas
console.log('\n🔐 Verificaciones de seguridad:');

// JWT Secret - mínimo 32 caracteres
if (env.JWT_SECRET) {
  if (env.JWT_SECRET.length < 32) {
    log.error('JWT_SECRET debe tener al menos 32 caracteres');
    hasErrors = true;
  } else if (env.JWT_SECRET === 'fallback-secret-change-in-production') {
    log.error('JWT_SECRET está usando el valor por defecto - CAMBIAR EN PRODUCCIÓN');
    hasErrors = true;
  } else {
    log.success('JWT_SECRET cumple requisitos de longitud');
  }
}

// Session Secret - mínimo 32 caracteres
if (env.SESSION_SECRET) {
  if (env.SESSION_SECRET.length < 32) {
    log.error('SESSION_SECRET debe tener al menos 32 caracteres');
    hasErrors = true;
  } else {
    log.success('SESSION_SECRET cumple requisitos de longitud');
  }
}

// Admin Password - verificar que esté hasheada
if (env.ADMIN_PASSWORD) {
  if (env.ADMIN_PASSWORD.startsWith('$2a$') || env.ADMIN_PASSWORD.startsWith('$2b$')) {
    log.success('ADMIN_PASSWORD está correctamente hasheada con bcrypt');
  } else {
    log.warning('ADMIN_PASSWORD parece estar en texto plano - DEBE ESTAR HASHEADA EN PRODUCCIÓN');
    hasWarnings = true;
  }
}

// Admin Email - verificar formato
if (env.ADMIN_EMAIL) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(env.ADMIN_EMAIL)) {
    log.error('ADMIN_EMAIL tiene un formato inválido');
    hasErrors = true;
  } else {
    log.success('ADMIN_EMAIL tiene formato válido');
  }
}

// Site URL - verificar HTTPS en producción
if (env.SITE_URL) {
  if (env.NODE_ENV === 'production' && !env.SITE_URL.startsWith('https://')) {
    log.error('SITE_URL debe usar HTTPS en producción');
    hasErrors = true;
  } else if (env.SITE_URL.startsWith('https://')) {
    log.success('SITE_URL usa HTTPS');
  } else {
    log.info('SITE_URL no usa HTTPS (OK para desarrollo)');
  }
}

// Supabase URL - verificar formato
if (env.SUPABASE_URL) {
  if (!env.SUPABASE_URL.startsWith('https://') || !env.SUPABASE_URL.includes('.supabase.co')) {
    log.warning('SUPABASE_URL no parece tener el formato correcto');
    hasWarnings = true;
  } else {
    log.success('SUPABASE_URL tiene formato válido');
  }
}

// Node ENV
console.log('\n🌍 Entorno:');
if (env.NODE_ENV === 'production') {
  log.info('NODE_ENV=production ✓');
} else {
  log.warning(`NODE_ENV=${env.NODE_ENV || 'development'} (no es producción)`);
}

// Resumen
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  log.error('Configuración FALLIDA - Corregir errores antes de desplegar');
  console.log('\n💡 Consejos:');
  console.log('  - Genera secretos con: openssl rand -base64 32');
  console.log('  - Hashea contraseñas con: node -e "console.log(require(\'bcryptjs\').hashSync(\'tu_password\', 10))"');
  console.log('  - Revisa PRODUCTION_SETUP.md para más detalles');
  console.log('');
  process.exit(1);
} else if (hasWarnings) {
  log.warning('Configuración COMPLETA con advertencias');
  console.log('\n⚠️  Revisa las advertencias antes de desplegar en producción');
  console.log('');
  process.exit(0);
} else {
  log.success('Configuración CORRECTA - Lista para producción');
  console.log('');
  process.exit(0);
}
