# Documentación de Seguridad - Equitracción

Esta documentación detalla todas las medidas de seguridad implementadas en el sitio web de Equitracción.

## 🔐 Arquitectura de Seguridad

### Capas de Protección

1. **Autenticación JWT** - Tokens seguros para sesiones admin
2. **Middleware de Autorización** - Protección de rutas sensibles
3. **Headers de Seguridad HTTP** - Prevención de ataques comunes
4. **Rate Limiting** - Protección contra fuerza bruta
5. **Validación y Sanitización** - Prevención de XSS/SQL Injection
6. **Cookies Seguras** - httpOnly, secure, sameSite

---

## 🛡️ Medidas de Seguridad Implementadas

### 1. Autenticación y Autorización

#### JWT (JSON Web Tokens)

**Ubicación:** `/src/lib/auth/jwt.ts`

**Características:**
- Tokens firmados con secreto de 256 bits
- Expiración de 7 días
- Payload incluye email y rol
- Verificación en cada petición a rutas admin

**Uso:**
```typescript
// Generar token
const token = generateToken('admin@equitraccion.com', 'admin');

// Verificar token
const payload = verifyToken(token);

// Verificar autenticación
const isAuth = isAuthenticated(context);
```

#### Middleware de Protección

**Ubicación:** `/src/middleware.ts`

**Rutas protegidas:**
- `/admin/*` (excepto `/admin/login`)
- Todas las rutas admin requieren JWT válido
- Redirección automática a login si no autenticado

**Logs de seguridad:**
- ✅ Accesos autorizados
- 🔒 Accesos denegados (con IP y ruta)

### 2. Headers de Seguridad HTTP

Todos los headers se configuran en el middleware:

| Header | Valor | Propósito |
|--------|-------|-----------|
| `X-Frame-Options` | `DENY` | Previene clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Activa filtro XSS del navegador |
| `X-Content-Type-Options` | `nosniff` | Previene MIME type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control de información de referrer |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Deshabilita APIs sensibles |
| `Content-Security-Policy` | Ver detalles abajo | Previene XSS y data injection |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Fuerza HTTPS (solo producción) |

#### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://www.google-analytics.com https://*.supabase.co;
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

**Nota:** `unsafe-inline` y `unsafe-eval` se usan temporalmente. En futuras versiones, usar nonces/hashes.

### 3. Rate Limiting

**Ubicación:** `/src/lib/security/rate-limiter.ts`

#### Límites Configurados

| Endpoint/Función | Límite | Ventana | Identificador |
|------------------|--------|---------|---------------|
| Login | 5 peticiones | 15 min | IP del cliente |
| API General | 100 peticiones | 15 min | IP del cliente |
| Contacto | 3 mensajes | 1 hora | IP del cliente |

#### Respuesta cuando se excede el límite

```json
{
  "success": false,
  "message": "Demasiadas peticiones. Por favor, intenta de nuevo más tarde.",
  "resetTime": "2025-01-06T15:30:00.000Z",
  "remaining": 0
}
```

**Headers incluidos:**
- `Retry-After`: Segundos hasta el reset
- `X-RateLimit-Remaining`: Peticiones restantes
- `X-RateLimit-Reset`: Timestamp del reset

#### Detección de IP

Considera proxies y load balancers:
1. `X-Forwarded-For` (primera IP)
2. `X-Real-IP`
3. Fallback: 'unknown'

**Nota:** En producción con múltiples servidores, usar Redis para almacenar límites.

### 4. Validación y Sanitización

**Ubicación:** `/src/lib/validation/sanitize.ts`

#### Funciones de Validación

```typescript
// Email
validateEmail(email: string): ValidationResult

// Nombre de usuario
validateUsername(username: string): ValidationResult

// Contraseña (requisitos seguros)
validatePassword(password: string): ValidationResult

// URL
validateURL(url: string): ValidationResult

// Teléfono español
validatePhoneES(phone: string): ValidationResult

// Mensaje de contacto
validateMessage(message: string, minLength?, maxLength?): ValidationResult

// Título de post
validatePostTitle(title: string): ValidationResult

// Formulario de contacto completo
validateContactForm(data): ValidationResult
```

#### Funciones de Sanitización

```typescript
// Eliminar HTML y escapar caracteres especiales
sanitizeHTML(input: string): string

// Sanitizar contenido de blog (permite algunas etiquetas)
sanitizeBlogContent(input: string): string

// Sanitizar slug para URLs
sanitizeSlug(input: string): string

// Escapar input SQL (usar junto con prepared statements)
escapeSQLInput(input: string): string
```

#### Ejemplo de Uso

```typescript
// Validar formulario de contacto
const result = validateContactForm({
  name: userInput.name,
  email: userInput.email,
  phone: userInput.phone,
  message: userInput.message
});

if (!result.isValid) {
  return { errors: result.errors };
}

// Sanitizar antes de guardar
const sanitizedName = sanitizeHTML(userInput.name);
const sanitizedMessage = sanitizeHTML(userInput.message);
```

### 5. Cookies Seguras

#### Configuración de Cookies

```typescript
context.cookies.set('auth_token', token, {
  httpOnly: true,      // No accesible desde JavaScript
  secure: true,        // Solo HTTPS (producción)
  sameSite: 'strict',  // Protección CSRF
  maxAge: 604800,      // 7 días en segundos
  path: '/'            // Disponible en toda la app
});
```

**Flags explicados:**
- `httpOnly`: Previene acceso desde JavaScript (XSS)
- `secure`: Solo se envía por HTTPS
- `sameSite: 'strict'`: No se envía en peticiones cross-site (CSRF)
- `maxAge`: Expiración en segundos

---

## 🚨 Vectores de Ataque Mitigados

### 1. Cross-Site Scripting (XSS)

**Mitigaciones:**
- ✅ Content Security Policy
- ✅ Sanitización de inputs
- ✅ Escapado de output
- ✅ `httpOnly` cookies
- ✅ `X-XSS-Protection` header

### 2. SQL Injection

**Mitigaciones:**
- ✅ Supabase usa prepared statements automáticamente
- ✅ Validación de inputs
- ✅ Sanitización adicional con `escapeSQLInput()`
- ✅ Row Level Security (RLS) en Supabase

### 3. Cross-Site Request Forgery (CSRF)

**Mitigaciones:**
- ✅ `sameSite: 'strict'` en cookies
- ✅ Verificación de origen
- ✅ Tokens JWT en header/cookie

### 4. Clickjacking

**Mitigaciones:**
- ✅ `X-Frame-Options: DENY`
- ✅ CSP `frame-ancestors 'none'`

### 5. Ataques de Fuerza Bruta

**Mitigaciones:**
- ✅ Rate limiting en login (5 intentos / 15 min)
- ✅ Logging de intentos fallidos
- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT con expiración

### 6. Man-in-the-Middle (MITM)

**Mitigaciones:**
- ✅ HTTPS forzado
- ✅ HSTS header
- ✅ Secure cookies

### 7. Session Hijacking

**Mitigaciones:**
- ✅ JWT firmado y verificado
- ✅ httpOnly cookies
- ✅ Secure flag
- ✅ Expiración de tokens

---

## 🔍 Auditoría y Monitorización

### Logs de Seguridad

**Login exitoso:**
```
✅ Authenticated access to /admin/posts
```

**Login fallido:**
```
🔒 Access denied to /admin/posts - redirecting to login
```

**Rate limit excedido:**
```
🚫 Rate limit exceeded for IP: 192.168.1.1
```

### Métricas a Monitorizar

1. **Intentos de login fallidos** (potencial ataque)
2. **Rate limit triggers** (uso abusivo)
3. **Accesos no autorizados** (intentos de bypass)
4. **Errores 500** (fallos de seguridad potenciales)

### Herramientas de Auditoría

```bash
# Verificar headers de seguridad
curl -I https://equitraccion.com | grep -E "X-Frame|X-XSS|Content-Security"

# Prueba de rate limiting
for i in {1..10}; do 
  curl -X POST https://equitraccion.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'; 
done

# Verificar SSL
openssl s_client -connect equitraccion.com:443 -servername equitraccion.com

# Análisis de seguridad completo
npm run security-audit
```

### Análisis de Seguridad Externos

Probar con:
- [Mozilla Observatory](https://observatory.mozilla.org)
- [Security Headers](https://securityheaders.com)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [OWASP ZAP](https://www.zaproxy.org/)

---

## ⚙️ Configuración de Producción

### Variables Críticas

```env
# NUNCA usar valores por defecto en producción
JWT_SECRET=<mínimo 32 caracteres aleatorios>
SESSION_SECRET=<mínimo 32 caracteres aleatorios>
ADMIN_PASSWORD=<hash bcrypt, NUNCA texto plano>
```

### Generación de Secretos

```bash
# JWT Secret
openssl rand -base64 32

# Session Secret
openssl rand -base64 32

# Password Hash
node -e "console.log(require('bcryptjs').hashSync('tu_contraseña', 10))"
```

### Checklist Pre-Producción

- [ ] Todos los secretos generados aleatoriamente
- [ ] Contraseñas hasheadas con bcrypt (cost factor 10+)
- [ ] HTTPS configurado con certificado válido
- [ ] Variables de entorno configuradas (no en código)
- [ ] `.env` en `.gitignore`
- [ ] Rate limiting activado
- [ ] Headers de seguridad verificados
- [ ] CSP configurada sin `unsafe-*` (objetivo futuro)
- [ ] Logs de seguridad activos
- [ ] Backup de Supabase configurado
- [ ] Monitorización activa

---

## 🔄 Actualizaciones de Seguridad

### Dependencias

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias con vulnerabilidades
npm audit fix

# Actualizar todas las dependencias (con precaución)
npm update
```

### Proceso de Actualización

1. **Revisar npm audit**
2. **Actualizar dependencias vulnerables**
3. **Probar en entorno de desarrollo**
4. **Ejecutar tests de seguridad**
5. **Desplegar en producción**

---

## 📞 Reporte de Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad:

**NO** abras un issue público en GitHub.

**SÍ** contacta directamente:
- **Email:** info@equitraccion.com
- **Asunto:** "[SEGURIDAD] Reporte de Vulnerabilidad"

Incluye:
1. Descripción detallada
2. Pasos para reproducir
3. Impacto potencial
4. Sugerencias de mitigación (si las tienes)

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Última revisión:** 2025-01-06  
**Próxima auditoría:** 2025-04-06 (trimestral)
