import validator from 'validator';

/**
 * Utilidades de sanitización y validación de inputs
 * Previene XSS, SQL injection y otros ataques comunes
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Sanitiza texto HTML para prevenir XSS
 * Elimina todas las etiquetas HTML y scripts
 */
export function sanitizeHTML(input: string): string {
  if (!input) return '';
  
  // Eliminar etiquetas HTML
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Escapar caracteres especiales
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized.trim();
}

/**
 * Sanitiza texto para contenido de blog (permite algunas etiquetas HTML seguras)
 */
export function sanitizeBlogContent(input: string): string {
  if (!input) return '';
  
  // Lista de etiquetas permitidas para contenido de blog
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'img'
  ];
  
  // Por ahora, sanitizamos todo y en el futuro se puede usar una librería como DOMPurify
  // Para el servidor, removemos todas las etiquetas no permitidas
  return sanitizeHTML(input);
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('El email es requerido');
    return { isValid: false, errors };
  }
  
  if (!validator.isEmail(email)) {
    errors.push('Formato de email inválido');
  }
  
  if (email.length > 254) {
    errors.push('El email es demasiado largo');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida y sanitiza nombre de usuario
 */
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];
  
  if (!username) {
    errors.push('El nombre de usuario es requerido');
    return { isValid: false, errors };
  }
  
  if (username.length < 3) {
    errors.push('El nombre debe tener al menos 3 caracteres');
  }
  
  if (username.length > 50) {
    errors.push('El nombre es demasiado largo (máximo 50 caracteres)');
  }
  
  // Solo permitir letras, números, espacios, guiones y apóstrofes
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s'-]+$/.test(username)) {
    errors.push('El nombre contiene caracteres no permitidos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida contraseña segura
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('La contraseña es requerida');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (password.length > 100) {
    errors.push('La contraseña es demasiado larga');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida URL
 */
export function validateURL(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (!url) {
    errors.push('La URL es requerida');
    return { isValid: false, errors };
  }
  
  if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
    errors.push('URL inválida');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida número de teléfono español
 */
export function validatePhoneES(phone: string): ValidationResult {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('El teléfono es requerido');
    return { isValid: false, errors };
  }
  
  // Remover espacios y guiones
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Validar formato español: +34XXXXXXXXX o XXXXXXXXX (9 dígitos)
  if (!/^(\+34)?[6-9]\d{8}$/.test(cleanPhone)) {
    errors.push('Formato de teléfono español inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida mensaje de contacto
 */
export function validateMessage(message: string, minLength = 10, maxLength = 5000): ValidationResult {
  const errors: string[] = [];
  
  if (!message) {
    errors.push('El mensaje es requerido');
    return { isValid: false, errors };
  }
  
  const trimmedMessage = message.trim();
  
  if (trimmedMessage.length < minLength) {
    errors.push(`El mensaje debe tener al menos ${minLength} caracteres`);
  }
  
  if (trimmedMessage.length > maxLength) {
    errors.push(`El mensaje no puede exceder ${maxLength} caracteres`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida título de post de blog
 */
export function validatePostTitle(title: string): ValidationResult {
  const errors: string[] = [];
  
  if (!title) {
    errors.push('El título es requerido');
    return { isValid: false, errors };
  }
  
  if (title.length < 5) {
    errors.push('El título debe tener al menos 5 caracteres');
  }
  
  if (title.length > 200) {
    errors.push('El título es demasiado largo (máximo 200 caracteres)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitiza slug para URLs
 */
export function sanitizeSlug(input: string): string {
  return validator.escape(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
}

/**
 * Previene SQL injection escapando caracteres especiales
 * NOTA: Esto es una medida adicional. Siempre usa prepared statements/parameterized queries
 */
export function escapeSQLInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\0/g, '\\0');
}

/**
 * Valida conjunto de datos de formulario de contacto
 */
export function validateContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): ValidationResult {
  const errors: string[] = [];
  
  // Validar nombre
  const nameValidation = validateUsername(data.name);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  
  // Validar email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }
  
  // Validar teléfono si se proporciona
  if (data.phone) {
    const phoneValidation = validatePhoneES(data.phone);
    if (!phoneValidation.isValid) {
      errors.push(...phoneValidation.errors);
    }
  }
  
  // Validar mensaje
  const messageValidation = validateMessage(data.message);
  if (!messageValidation.isValid) {
    errors.push(...messageValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
