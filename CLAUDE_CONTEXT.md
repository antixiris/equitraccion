# CLAUDE CONTEXT - Equitracción Website

**Última actualización:** 8 de noviembre de 2025

## 📋 Resumen del Proyecto

Sitio web completo para Fundación Equitracción con:
- Frontend público en Astro (SSR/SSG híbrido)
- Backend CMS personalizado con autenticación server-side
- Base de datos Supabase (PostgreSQL)
- Sistema de blog, cursos, newsletter y contacto

## 🗂️ Estructura del Proyecto

```
equitraccion/website/
├── src/
│   ├── pages/
│   │   ├── admin/          # Panel de administración
│   │   │   ├── index.astro           # Dashboard principal
│   │   │   ├── login.astro           # Login admin
│   │   │   ├── posts/                # Gestión de blog
│   │   │   │   ├── index.astro       # Lista de posts
│   │   │   │   ├── new.astro         # Crear post (CON QUILL.JS)
│   │   │   │   └── edit/[id].astro   # Editar post (PENDIENTE QUILL)
│   │   │   ├── courses/              # Gestión de cursos
│   │   │   ├── newsletter.astro      # Gestión newsletter
│   │   │   └── messages.astro        # Mensajes contacto
│   │   ├── api/            # Endpoints API
│   │   │   ├── auth/       # Autenticación
│   │   │   │   ├── login.ts          # Login con cookies HTTP-only
│   │   │   │   └── logout.ts         # Logout limpia cookie
│   │   │   ├── posts/      # CRUD posts
│   │   │   ├── courses/    # CRUD cursos
│   │   │   ├── newsletter/ # Newsletter
│   │   │   └── contact/    # Formulario contacto
│   │   ├── blog/           # Blog público
│   │   ├── formacion/      # Página cursos público
│   │   └── contacto.astro  # Formulario contacto
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── jwt.ts      # JWT helpers (legacy)
│   │   │   └── server.ts   # ⭐ NUEVO: Auth server-side
│   │   ├── supabase.ts     # Cliente Supabase
│   │   └── email/          # Templates newsletter
│   └── layouts/
├── public/
│   └── images/             # Imágenes del sitio
└── supabase-*.sql          # Scripts SQL
```

## 🔄 Cambios Realizados Hoy (8 Nov 2025)

### ⚠️ PROBLEMA CRÍTICO IDENTIFICADO: Sistema de Autenticación Corrupto

**Síntoma:** Bucle infinito de recargas al hacer logout desde cualquier página del CMS.

**Causa raíz identificada:**
1. Sistema basado en `sessionStorage` cliente-side
2. Función `checkAuth()` ejecutándose automáticamente al cargar cada página
3. Al hacer logout, `sessionStorage.clear()` borraba la sesión PERO el script seguía ejecutándose
4. `checkAuth()` detectaba ausencia de sesión y redirigía → bucle infinito

### 🔧 SOLUCIÓN IMPLEMENTADA: Autenticación Server-Side Completa

#### 1. **Nuevo Sistema de Autenticación**
**Archivo creado:** `src/lib/auth/server.ts`

```typescript
// Funciones principales:
requireAuth(Astro)      // Verifica auth server-side, redirige si no autenticado
isAuthenticated(Astro)  // Verifica cookie HTTP-only
setAuthCookie(Astro)    // Establece cookie segura (login.ts lo usa)
clearAuthCookie(Astro)  // Borra cookie (logout.ts lo usa)
```

**Características:**
- Cookies HTTP-only (no accesibles desde JavaScript)
- Verificación server-side ANTES de renderizar páginas
- SameSite: 'lax', Secure en producción
- MaxAge: 7 días
- Path: '/'

#### 2. **Refactorización de `/admin/index.astro`**
**Líneas clave:**
- Línea 4: `import { requireAuth } from '../../lib/auth/server'`
- Línea 7: `requireAuth(Astro)` - Auth server-side
- Líneas 323: Eliminada función `checkAuth()` cliente
- Líneas 401-421: Nuevo logout via API endpoint
- Líneas 423-425: Carga de datos SIN verificación cliente

**Antes (cliente-side):**
```javascript
const checkAuth = () => {
  const isAuthenticated = sessionStorage.getItem('admin_authenticated');
  if (!isAuthenticated) {
    window.location.replace('/admin/login');
  }
};
checkAuth(); // ← Esto causaba el bucle
```

**Después (server-side):**
```astro
---
requireAuth(Astro); // ← Verifica ANTES de renderizar
---
<script>
  // Solo lógica de logout vía API
  document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) window.location.replace('/admin/login');
  });
  // Carga directa de datos, sin verificación
  loadStats();
  loadRecentPosts();
</script>
```

#### 3. **Actualización de `/admin/login.astro`**
**Líneas modificadas:** 140-142

**Antes:**
```javascript
sessionStorage.setItem('admin_authenticated', 'true');
window.location.href = data.redirect || '/admin';
```

**Después:**
```javascript
// Cookie HTTP-only ya establecida por el servidor
window.location.href = data.redirect || '/admin';
```

#### 4. **Limpieza de Código Legacy**
**Archivos afectados:**
- `src/pages/admin/index.astro`
- `src/pages/admin/messages.astro`
- `src/pages/admin/newsletter.astro`
- `src/pages/admin/posts/index.astro`

**Eliminado:**
- ❌ Todas las referencias a `sessionStorage`
- ❌ Funciones `checkAuth()` cliente-side
- ❌ Verificaciones de autenticación en JavaScript cliente

**Mantenido:**
- ✅ `/lib/auth/jwt.ts` - Para compatibilidad con APIs existentes
- ✅ `/api/auth/login.ts` y `/api/auth/logout.ts` - Actualizados para cookies

### 🎨 MEJORA: Editor Quill.js en Creación de Posts

**Archivo:** `src/pages/admin/posts/new.astro`

#### Implementación Completa de Quill.js
**CDN integrado (líneas aproximadas):**
```html
<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
```

**Configuración del editor:**
```javascript
let quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'link', 'image'],
      ['clean']
    ]
  },
  placeholder: 'Empieza a escribir aquí tu contenido...'
});
```

**Ventajas:**
- ✅ Formato en tiempo real funcional
- ✅ H1, H2, H3, listas, citas, links, imágenes
- ✅ Guarda HTML directamente (no Markdown)
- ✅ Editor profesional y robusto
- ✅ No hay errores de `document.execCommand` (deprecated)

**Pendiente:**
- 🔜 Aplicar Quill.js a `edit/[id].astro`

### 📝 Otros Cambios Menores

#### Eliminación de Duplicados de Navegación
- Removidas definiciones duplicadas de navegación en varias páginas
- Unificación de estilos amber-800 en todo el CMS

## 🔑 Decisiones Técnicas Importantes

### ⚠️ ESTADO ACTUAL DEL CMS: Necesita Refactorización Completa

**Problemas identificados que requieren atención:**

1. **Autenticación mixta** (parcialmente solucionado hoy)
   - ✅ `index.astro` usa server-side
   - ❌ Resto de páginas admin aún usan `sessionStorage`
   - 🔜 Necesario: Migrar TODAS las páginas admin a `requireAuth()`

2. **Editor de posts inconsistente**
   - ✅ `new.astro` tiene Quill.js
   - ❌ `edit/[id].astro` aún usa `contenteditable` + `document.execCommand`
   - 🔜 Necesario: Unificar con Quill.js

3. **Manejo de imágenes deficiente**
   - ❌ No hay resize automático
   - ❌ No hay optimización
   - ❌ No hay gestión de storage cuotas
   - 🔜 Necesario: Integrar Cloudinary o servicio similar

4. **Sin validación consistente**
   - ❌ Validaciones diferentes en cliente vs servidor
   - ❌ Mensajes de error inconsistentes
   - 🔜 Necesario: Sistema centralizado de validación

### Schema de Base de Datos
```sql
-- Tablas principales
blog_posts          -- Posts del blog
courses             -- Cursos con campo JSONB dates[]
newsletter_subscriptions  -- status: 'active'|'unsubscribed'
contact_submissions      -- Mensajes del formulario
```

### Autenticación (Sistema Nuevo - Parcialmente Implementado)

**Server-Side (CORRECTO):**
```typescript
// En páginas .astro (frontmatter)
import { requireAuth } from '../../lib/auth/server';
requireAuth(Astro); // Verifica ANTES de renderizar
```

**Client-Side (LEGACY - A ELIMINAR):**
```javascript
// ❌ NO USAR - causas bucles y problemas
const checkAuth = () => {
  const isAuthenticated = sessionStorage.getItem('admin_authenticated');
  if (!isAuthenticated) window.location.replace('/admin/login');
};
```

**Cookies HTTP-only:**
- Nombre: `admin_session`
- Secure: true en producción
- HttpOnly: true (no accesible desde JavaScript)
- SameSite: 'lax'
- MaxAge: 604800 segundos (7 días)

### Cliente Supabase
```typescript
// Cliente público (anon key)
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Cliente admin (service role)
const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);
```

## 📝 Variables de Entorno Requeridas

```env
# Supabase
PUBLIC_SUPABASE_URL=https://xmucbjbtgmjezypkdjpc.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Auth
JWT_SECRET=equitraccion_dev_secret_change_in_production_minimum_32_characters
ADMIN_EMAIL=admin@equitraccion.com
ADMIN_PASSWORD=Admin2025!

# Site
SITE_URL=http://localhost:4321  # En producción: https://equitraccion.com
NODE_ENV=development

# Newsletter
NEWSLETTER_CRON_TOKEN=dev_newsletter_token_change_in_production_32_chars
```

## 🚀 Próximos Pasos Sugeridos (ACTUALIZADOS)

### 🔴 PRIORIDAD CRÍTICA - Refactorización CMS

**Problema:** El CMS actual tiene múltiples inconsistencias y código legacy que causan bugs.

**Solución propuesta:** Refactorización completa en siguiente sesión con:

1. **Migración total a autenticación server-side**
   - Aplicar `requireAuth()` a TODAS las páginas admin
   - Eliminar todo código de `sessionStorage`
   - Limpiar `/lib/auth/jwt.ts` de funciones innecesarias

2. **Unificación del editor de posts**
   - Implementar Quill.js en `edit/[id].astro`
   - Eliminar código de `document.execCommand`
   - Añadir preview en tiempo real

3. **Sistema centralizado de gestión de imágenes**
   - Integrar Cloudinary o Uploadcare
   - Resize automático de imágenes
   - Compresión y optimización
   - CDN para delivery

4. **Validación y manejo de errores unificado**
   - Crear `/lib/validation.ts` con schemas Zod
   - Mensajes de error consistentes
   - Loading states unificados

5. **Refactorización de componentes comunes**
   - Header de navegación como componente
   - Modales reutilizables
   - Toast notifications

### Prioridad Alta (Después de refactorización)

6. **Implementar envío real de emails**
   - Integrar SendGrid o Mailgun en `/api/newsletter/send.ts`
   - Configurar API key en variables de entorno

7. **Deploy a producción**
   - Actualizar variables de entorno en Vercel
   - Cambiar `SITE_URL` a dominio real
   - Rotar secrets (JWT_SECRET, NEWSLETTER_CRON_TOKEN)

### Prioridad Media

8. **Tests automatizados**
   - Tests E2E con Playwright para flujos críticos
   - Tests de integración para APIs
   - CI/CD con GitHub Actions

9. **Analytics y monitoreo**
   - Integrar Plausible o Google Analytics
   - Error tracking con Sentry
   - Performance monitoring

## 🐛 Issues Conocidos

### 🔴 Críticos (Requieren solución inmediata)

1. **Logout causa bucle infinito**
   - Estado: ✅ Solucionado parcialmente en `index.astro`
   - Pendiente: Aplicar a resto de páginas admin
   - Solución: Migrar todas las páginas a autenticación server-side

2. **Editor de posts inconsistente**
   - `new.astro`: Usa Quill.js ✅
   - `edit/[id].astro`: Usa `contenteditable` deprecated ❌
   - Solución: Aplicar Quill.js a `edit/[id].astro`

### ⚠️ Moderados

3. **Código duplicado en navegación**
   - Mismo HTML de nav copiado en 5+ archivos
   - Solución: Crear componente de navegación

4. **Sin manejo de imágenes grandes**
   - Usuarios pueden subir imágenes de MB sin compresión
   - Solución: Implementar resize y compresión en upload

## 📚 Documentación Relacionada

- `SUPABASE_SETUP.md` - Configuración de base de datos
- `BACKEND_IMPLEMENTATION.md` - Documentación del backend
- `NEWSLETTER_SETUP.md` - Configuración del sistema de newsletter
- `NEWSLETTER_REDESIGN.md` - Detalles del diseño del newsletter

## 🔗 URLs Importantes

- **Sitio público:** http://localhost:4321
- **Admin login:** http://localhost:4321/admin/login
- **Dashboard:** http://localhost:4321/admin
- **Newsletter preview:** http://localhost:4321/api/newsletter/send?preview=true
- **Supabase:** https://supabase.com/dashboard/project/xmucbjbtgmjezypkdjpc
- **Producción:** https://equitraccion.vercel.app

## 📊 Historial de Commits Importantes

### 8 Nov 2025
- `66ddced` - **refactor: Implementar autenticación server-side con cookies HTTP-only**
  - Solución al bucle infinito de logout
  - Nuevo `/lib/auth/server.ts`
  - Migración de `index.astro` a server-side auth

- `7604424` - **fix: Eliminar checkAuth() automático para prevenir loops de logout**
  - Primer intento de solución (parcial)
  - Eliminación de `checkAuth()` automático

- `0e6f4ce` - **feat: Reemplazar editor con Quill.js en new.astro**
  - Editor profesional WYSIWYG
  - Formato en tiempo real funcional

### 7 Nov 2025
- Corrección de nombres de tablas Supabase
- Rediseño completo del dashboard
- Navegación unificada en CMS

---

## 🎯 Plan para Próxima Sesión

### Objetivo: Refactorización Completa del CMS

**Duración estimada:** 2-3 horas

**Tareas:**
1. ✅ Auditoría completa del código actual
2. 🔧 Migrar TODAS las páginas admin a server-side auth
3. 🔧 Implementar Quill.js en `edit/[id].astro`
4. 🔧 Crear componentes reutilizables (Nav, Modal, Toast)
5. 🔧 Centralizar validación con Zod
6. 🔧 Implementar gestión de imágenes con Cloudinary
7. ✅ Testing manual exhaustivo
8. ✅ Deploy a producción

**Criterios de éxito:**
- ✅ No hay bucles de logout en ninguna página
- ✅ Editor funciona igual en crear y editar
- ✅ Código DRY (sin duplicación)
- ✅ Mensajes de error consistentes
- ✅ Performance óptimo (<2s carga de páginas)

---

**Notas para Claude:**
- El proyecto usa Astro en modo híbrido (SSR + SSG)
- JavaScript en `<script>` de Astro NO soporta TypeScript
- NO usar `as` type assertions ni `!` non-null assertions en scripts cliente
- Usar operador `?.` para optional chaining es seguro
- Las tablas de Supabase usan `snake_case`
- Colores del tema: Amber-800 (#92400e) para B2B
- **IMPORTANTE:** Siempre verificar auth con `requireAuth(Astro)` en frontmatter de páginas admin
- **IMPORTANTE:** NO usar `sessionStorage` para autenticación
- **IMPORTANTE:** Logout debe ser vía `POST /api/auth/logout`
