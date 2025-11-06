/**
 * Sistema de Rate Limiting
 * Previene ataques de fuerza bruta y abuso de API
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Almacenamiento en memoria de intentos
// NOTA: En producción con múltiples servidores, usar Redis o similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number; // Número máximo de peticiones
  windowMs: number;    // Ventana de tiempo en milisegundos
  keyPrefix?: string;  // Prefijo opcional para el identificador
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Verifica si una petición está dentro del límite de rate limiting
 * @param identifier - Identificador único (IP, email, etc.)
 * @param config - Configuración del rate limiter
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = config.keyPrefix ? `${config.keyPrefix}:${identifier}` : identifier;
  const now = Date.now();
  
  // Obtener o crear entrada
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Crear nueva entrada o resetear si expiró
    entry = {
      count: 1,
      resetTime: now + config.windowMs
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime
    };
  }
  
  // Incrementar contador
  entry.count++;
  
  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Extrae la IP del cliente de la request
 * Considera proxies y load balancers
 */
export function getClientIP(request: Request): string {
  // Intentar obtener IP de headers de proxy
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for puede contener múltiples IPs, tomar la primera
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback - en desarrollo puede ser undefined
  return 'unknown';
}

/**
 * Rate limiter para proteger login
 * Más restrictivo para prevenir ataques de fuerza bruta
 */
export function checkLoginRateLimit(identifier: string): RateLimitResult {
  return checkRateLimit(identifier, {
    maxRequests: 5,           // 5 intentos
    windowMs: 15 * 60 * 1000, // 15 minutos
    keyPrefix: 'login'
  });
}

/**
 * Rate limiter para API general
 * Límite moderado para uso normal
 */
export function checkAPIRateLimit(identifier: string): RateLimitResult {
  const maxRequests = parseInt(import.meta.env.RATE_LIMIT_MAX || '100');
  const windowMs = parseInt(import.meta.env.RATE_LIMIT_WINDOW || '900000'); // 15 min
  
  return checkRateLimit(identifier, {
    maxRequests,
    windowMs,
    keyPrefix: 'api'
  });
}

/**
 * Rate limiter para formulario de contacto
 * Previene spam
 */
export function checkContactFormRateLimit(identifier: string): RateLimitResult {
  return checkRateLimit(identifier, {
    maxRequests: 3,           // 3 mensajes
    windowMs: 60 * 60 * 1000, // 1 hora
    keyPrefix: 'contact'
  });
}

/**
 * Middleware helper para aplicar rate limiting
 * Retorna Response con 429 si se excede el límite
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const resetDate = new Date(result.resetTime);
  
  return new Response(
    JSON.stringify({
      success: false,
      message: 'Demasiadas peticiones. Por favor, intenta de nuevo más tarde.',
      resetTime: resetDate.toISOString(),
      remaining: result.remaining
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': resetDate.toISOString()
      }
    }
  );
}
