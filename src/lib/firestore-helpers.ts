import { FieldValue } from 'firebase-admin/firestore';

/**
 * Calcula el tiempo de lectura estimado de un contenido.
 * Reemplaza el trigger PostgreSQL que hacía esto automáticamente.
 * Velocidad media de lectura: 200 palabras/minuto.
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  // Eliminar tags HTML para contar solo texto
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Devuelve un server timestamp de Firestore.
 * Reemplaza el DEFAULT NOW() de PostgreSQL.
 */
export function serverTimestamp() {
  return FieldValue.serverTimestamp();
}

/**
 * Devuelve la fecha actual como string ISO.
 * Útil para campos que necesitan un valor leíble inmediatamente
 * (serverTimestamp() no es leíble hasta que se persiste).
 */
export function nowISO(): string {
  return new Date().toISOString();
}
