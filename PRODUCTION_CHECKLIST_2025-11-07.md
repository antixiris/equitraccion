# Checklist de Migración a Producción - Equitracción
**Fecha de Preparación**: 7 de noviembre de 2025
**Estado**: ✅ LISTO PARA MIGRACIÓN

---

## 📋 Resumen de Trabajo Completado Hoy

### 1. ✅ Formulario de Suscripción a Newsletter en Footer
**Implementado en**: `src/components/Footer.astro`

**Características**:
- Formulario compacto y discreto en la 4ª columna del footer
- Diseño coherente con la identidad visual del sitio
- Integrado con el endpoint `/api/newsletter/subscribe`
- Validación de email en cliente y servidor
- Estados de carga y mensajes de feedback
- **Campo honeypot** para protección antispam
- Presente en TODAS las páginas del sitio

**Resultado**: Los usuarios pueden suscribirse desde cualquier página del sitio, aumentando las conversiones.

---

### 2. ✅ Protección Antispam Mejorada

#### Formularios Protegidos:
1. **Newsletter (Footer)** - `src/components/Footer.astro`
2. **Newsletter (Blog)** - `src/pages/blog.astro`
3. **Contacto** - `src/pages/contacto.astro`

#### Medidas Implementadas:

**A) Honeypot Fields**:
```html
<input
  type="text"
  name="website"
  id="honeypot-field"
  tabindex="-1"
  autocomplete="off"
  style="position: absolute; left: -9999px;"
  aria-hidden="true"
/>
```
- Campo oculto para humanos pero visible para bots
- Si se llena, la petición se marca como bot y se responde con éxito falso
- Implementado en 3 formularios

**B) Rate Limiting**:
- Newsletter: 3 suscripciones / 1 hora por IP
- Contacto: 3 mensajes / 1 hora por IP
- Login: 5 intentos / 15 minutos por IP

**C) Validación Robusta**:
- Email validado con librería `validator`
- Longitud de campos verificada
- Sanitización HTML antes de guardar en base de datos
- Verificación de duplicados en newsletter

**D) Sanitización de Inputs**:
```typescript
// Todos los inputs se sanitizan antes de guardar
const sanitizedName = sanitizeHTML(name.trim());
const sanitizedMessage = sanitizeHTML(message.trim());
```

---

### 3. ✅ Auditoría de Seguridad Completa

**Documento creado**: `SECURITY_AUDIT_2025-11-07.md`

#### Vulnerabilidades Críticas Corregidas:

**✅ A) Endpoint de Upload de Imágenes Protegido**
- **Antes**: Cualquiera podía subir imágenes sin autenticación
- **Ahora**: Requiere JWT válido para subir imágenes
- **Archivo**: `src/pages/api/upload-image.ts`
- **Mejora adicional**: Extensión de archivo basada en MIME type (no en nombre)

**✅ B) Endpoints de Posts Protegidos**
- **Antes**: CRUD público sin autenticación
- **Ahora**: Todos los métodos (GET, POST, PATCH, DELETE) requieren JWT
- **Archivo**: `src/pages/api/posts.ts`

**✅ C) Endpoints de Cursos Protegidos**
- **Antes**: GET público, otros métodos protegidos
- **Ahora**: Todos los métodos requieren JWT
- **Archivos**:
  - `src/pages/api/courses/index.ts`
  - `src/pages/api/courses/[id].ts`

#### Puntuación de Seguridad:
- **Antes de auditoría**: 6.5/10
- **Después de auditoría**: 8.5/10

---

## 🚀 Pasos para Migrar a Producción

### PASO 1: Configurar Variables de Entorno en Producción

#### A) Supabase
```env
PUBLIC_SUPABASE_URL=https://xmucbjbtgmjezypkdjpc.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### B) Autenticación
```bash
# Generar JWT_SECRET nuevo (NUNCA usar el de desarrollo)
JWT_SECRET=$(openssl rand -base64 32)
echo $JWT_SECRET

# Hashear contraseña de admin
node -e "console.log(require('bcryptjs').hashSync('TU_CONTRASEÑA_SEGURA', 10))"
```

```env
JWT_SECRET=<GENERADO_ARRIBA>
ADMIN_EMAIL=admin@equitraccion.com
ADMIN_PASSWORD=<HASH_BCRYPT_GENERADO>
```

#### C) Sitio
```env
SITE_URL=https://equitraccion.com
NODE_ENV=production
```

#### D) Newsletter
```bash
# Generar token para cron job
NEWSLETTER_CRON_TOKEN=$(openssl rand -base64 32)
echo $NEWSLETTER_CRON_TOKEN
```

```env
NEWSLETTER_CRON_TOKEN=<GENERADO_ARRIBA>
```

#### E) Email (cuando esté configurado)
```env
# Ejemplo con SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=newsletter@equitraccion.com
SENDGRID_FROM_NAME=Equitracción
```

---

### PASO 2: Verificar Schema de Supabase

#### Tablas Requeridas:

1. **`blog_posts`**
```sql
-- Ya creada, verificar que existe
SELECT COUNT(*) FROM blog_posts;
```

2. **`courses`**
```sql
-- Ejecutar si no existe: supabase-courses-schema.sql
SELECT COUNT(*) FROM courses;
```

3. **`newsletter_subscriptions`**
```sql
-- Verificar estructura correcta
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'newsletter_subscriptions';

-- Debe tener: email (text), status (text), created_at (timestamptz)
```

4. **`contact_submissions`**
```sql
-- Verificar estructura
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'contact_submissions';
```

#### Policies RLS (Row Level Security):

**Verificar que las policies permitan**:
- ✅ `SELECT` público en `blog_posts` (solo published=true)
- ✅ `SELECT` público en `courses` (solo active=true)
- ✅ `INSERT` con service role en `newsletter_subscriptions`
- ✅ `INSERT` con service role en `contact_submissions`
- ✅ Todas las operaciones admin con service role key

```sql
-- Ver policies actuales
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

---

### PASO 3: Deploy del Sitio

#### Opción A: Vercel (Recomendado)

1. **Conectar repositorio Git**:
```bash
# Asegurarse de que el código está en Git
git add .
git commit -m "feat: Ready for production deployment

- Newsletter form in footer
- Enhanced antispam protection (honeypot + rate limiting)
- Security audit completed (8.5/10)
- All admin endpoints protected with JWT
- Image upload secured
- Posts CRUD secured
- Courses CRUD secured

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

2. **Configurar en Vercel**:
   - Importar proyecto desde GitHub
   - Framework Preset: **Astro**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Añadir variables de entorno**:
   - Settings → Environment Variables
   - Copiar todas las variables del PASO 1

4. **Configurar dominio**:
   - Settings → Domains
   - Añadir `equitraccion.com` y `www.equitraccion.com`
   - Actualizar DNS según instrucciones de Vercel

5. **Configurar cron job para newsletter**:
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/newsletter/send",
      "schedule": "0 8 1 * *"
    }
  ]
}
```

#### Opción B: Netlify

1. **Conectar repositorio**
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Añadir variables de entorno**
4. **Configurar dominio**

---

### PASO 4: Verificaciones Post-Deploy

#### A) Funcionalidad Básica
- [ ] Sitio web carga correctamente
- [ ] Todas las páginas accesibles
- [ ] Imágenes se cargan correctamente
- [ ] Enlaces de navegación funcionan

#### B) Formularios Públicos
- [ ] Newsletter en footer funciona
- [ ] Newsletter en blog funciona
- [ ] Formulario de contacto funciona
- [ ] Verificar emails de confirmación llegan

#### C) Panel Admin
- [ ] Login con credenciales correctas funciona
- [ ] Dashboard carga datos
- [ ] Crear post funciona
- [ ] Editar post funciona
- [ ] Subir imagen funciona
- [ ] Crear curso funciona
- [ ] Editar curso funciona

#### D) Seguridad
```bash
# Test 1: Intentar acceder a endpoint admin sin auth
curl https://equitraccion.com/api/posts
# Debe retornar: {"error":"No autorizado"}

# Test 2: Verificar rate limiting
for i in {1..10}; do
  curl -X POST https://equitraccion.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}';
done
# Después de 5 intentos debe retornar: 429 Too Many Requests

# Test 3: Verificar honeypot
curl -X POST https://equitraccion.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"bot@test.com","honeypot":"filled"}';
# Debe retornar éxito falso pero 200 OK

# Test 4: Headers de seguridad
curl -I https://equitraccion.com | grep -E "X-Frame|X-XSS|Content-Security|Strict-Transport"
# Debe mostrar todos los headers configurados
```

#### E) Herramientas de Auditoría Externa
- [ ] **Mozilla Observatory**: https://observatory.mozilla.org
  - Objetivo: Puntuación A o A+
- [ ] **Security Headers**: https://securityheaders.com
  - Objetivo: Puntuación A
- [ ] **SSL Labs**: https://www.ssllabs.com/ssltest/
  - Objetivo: Puntuación A+
- [ ] **Google PageSpeed Insights**
  - Objetivo: >90 en Performance

---

### PASO 5: Configuración Opcional (Post-Launch)

#### A) Servicio de Email Real

**Opción 1: SendGrid (Recomendado)**
```bash
npm install @sendgrid/mail
```

Descomentar código en `src/pages/api/newsletter/send.ts` líneas 94-110

**Opción 2: Resend**
```bash
npm install resend
```

Implementar según documentación en `NEWSLETTER_SETUP.md`

#### B) Monitorización

**Sentry (Errores)**:
```bash
npm install @sentry/astro
```

**Plausible Analytics (Privacidad)**:
```astro
<!-- En BaseLayout.astro -->
<script defer data-domain="equitraccion.com" src="https://plausible.io/js/script.js"></script>
```

#### C) Backup Automático de Supabase

En Dashboard de Supabase:
- Settings → Database
- Backups → Enable automatic backups
- Frecuencia: Diaria
- Retención: 7 días

---

## 🔒 Seguridad Post-Producción

### Monitorizar estos aspectos:

1. **Logs de Rate Limiting**:
```bash
# En Vercel/Netlify, revisar logs de:
grep "Rate limit exceeded" logs.txt
```

2. **Intentos de Login Fallidos**:
```bash
grep "Credenciales inválidas" logs.txt | wc -l
```

3. **Honeypot Triggers**:
```bash
grep "Bot detected via honeypot" logs.txt
```

4. **Errores 401 (No autorizado)**:
```bash
# Picos de 401 pueden indicar intentos de acceso no autorizado
```

### Actualizar cada 3 meses:
- [ ] Dependencias de npm (`npm audit fix`)
- [ ] Auditoría de seguridad
- [ ] Rotar JWT_SECRET y tokens
- [ ] Revisar logs de seguridad

---

## 📊 Métricas de Éxito

### Semana 1:
- Tasa de error < 1%
- Uptime > 99.9%
- Newsletter subscriptions > 0
- Formularios de contacto recibidos > 0

### Mes 1:
- Tasa de conversión newsletter: 2-5%
- Tiempo de carga < 3 segundos
- Sin incidentes de seguridad
- Blog posts publicados > 5

---

## 🆘 Plan de Rollback

Si algo sale mal:

### Vercel:
1. Deployments → Ver deployments anteriores
2. Click en el deployment estable
3. "Promote to Production"

### Netlify:
1. Deploys → Ver deployments anteriores
2. Click en el deployment estable
3. "Publish deploy"

### Supabase:
1. Database → Backups
2. Restaurar backup del día anterior

---

## 📞 Contactos de Emergencia

**Hosting**: Equipo de soporte de Vercel/Netlify
**Base de Datos**: Soporte de Supabase
**Dominio**: Registrar de dominios

---

## ✅ Checklist Final Pre-Launch

### Configuración:
- [ ] Variables de entorno en producción verificadas
- [ ] JWT_SECRET generado aleatoriamente (32+ caracteres)
- [ ] ADMIN_PASSWORD hasheado con bcrypt
- [ ] NEWSLETTER_CRON_TOKEN generado
- [ ] SITE_URL apunta a dominio real
- [ ] NODE_ENV=production configurado

### Supabase:
- [ ] Todas las tablas existen
- [ ] RLS policies configuradas
- [ ] Service role key configurada
- [ ] Backups automáticos activados

### Código:
- [ ] Código en repositorio Git
- [ ] Commit con mensaje descriptivo
- [ ] Push a rama main/master
- [ ] Sin console.log() innecesarios en producción

### Testing:
- [ ] Tests de formularios ejecutados
- [ ] Tests de autenticación verificados
- [ ] Tests de rate limiting validados
- [ ] Tests de honeypot confirmados

### Seguridad:
- [ ] Todos los endpoints admin protegidos
- [ ] Headers de seguridad configurados
- [ ] HTTPS forzado
- [ ] Auditoría completada (8.5/10)

### Post-Deploy:
- [ ] Sitio accesible en dominio
- [ ] SSL certificado válido
- [ ] Formularios funcionando
- [ ] Admin panel accesible
- [ ] Headers de seguridad verificados
- [ ] Rate limiting testeado

---

**Estado Final**: ✅ **SISTEMA LISTO PARA PRODUCCIÓN**

**Próxima revisión**: 2026-02-07 (3 meses)

---

**Preparado por**: Claude Code
**Fecha**: 7 de noviembre de 2025
**Versión**: 1.0
