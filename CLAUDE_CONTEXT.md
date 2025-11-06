# CLAUDE CONTEXT - Equitracción Website

**Última actualización:** 7 de noviembre de 2025

## 📋 Resumen del Proyecto

Sitio web completo para Fundación Equitracción con:
- Frontend público en Astro (SSR/SSG híbrido)
- Backend CMS personalizado con autenticación JWT
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
│   │   │   ├── courses/              # Gestión de cursos
│   │   │   ├── newsletter.astro      # Gestión newsletter
│   │   │   └── messages.astro        # Mensajes contacto
│   │   ├── api/            # Endpoints API
│   │   │   ├── auth/       # Autenticación
│   │   │   ├── posts/      # CRUD posts
│   │   │   ├── courses/    # CRUD cursos
│   │   │   ├── newsletter/ # Newsletter
│   │   │   └── contact/    # Formulario contacto
│   │   ├── blog/           # Blog público
│   │   ├── formacion/      # Página cursos público
│   │   └── contacto.astro  # Formulario contacto
│   ├── lib/
│   │   ├── auth/           # JWT y autenticación
│   │   ├── supabase.ts     # Cliente Supabase
│   │   └── email/          # Templates newsletter
│   └── layouts/
├── public/
│   └── images/             # Imágenes del sitio
└── supabase-*.sql          # Scripts SQL
```

## 🔄 Cambios Realizados Hoy (7 Nov 2025)

### 1. **Corrección de Botón "Añadir Fecha" en Edición de Cursos**
**Archivo:** `src/pages/admin/courses/edit/[id].astro`
**Líneas clave:** 260-446

**Problema:** El botón no respondía al hacer clic
**Solución:**
- Eliminadas anotaciones de tipo TypeScript (`as HTMLElement`, `as HTMLInputElement`)
- Eliminados operadores non-null assertion (`!`)
- Reorganizado script dentro de `DOMContentLoaded`
- Movidas funciones fuera del event listener para mejor scope

**Cambios específicos:**
```javascript
// Antes (línea 325):
const target = e.target as HTMLElement;

// Después:
const target = e.target;
```

### 2. **Mejora de Tamaños de Texto en Gestión de Cursos**
**Archivo:** `src/pages/admin/courses.astro`
**Líneas:** 30-143

**Cambios:**
- Título principal: `text-2xl` → `text-3xl` (línea 30)
- Subtítulo: `text-sm` → `text-base` (línea 31)
- Enlaces navegación: `text-sm` → `text-base`
- Título curso: `text-xl` → `text-2xl` (línea 70)
- Badges: `text-xs` → `text-sm` (líneas 73, 78)
- Contenido general: `text-sm` → `text-base`

### 3. **Navegación Unificada en Todo el CMS**
**Archivos modificados:**
- `src/pages/admin/index.astro` (líneas 11-42)
- `src/pages/admin/posts/index.astro` (líneas 11-42)
- `src/pages/admin/courses.astro` (líneas 27-60)
- `src/pages/admin/newsletter.astro` (líneas 11-46)
- `src/pages/admin/messages.astro` (líneas 11-44)

**Diseño:**
```html
<nav class="flex items-center gap-6">
  <a href="/admin">Dashboard</a>
  <a href="/admin/posts">Blog</a>
  <a href="/admin/courses">Cursos</a>
  <a href="/admin/newsletter">Newsletter</a>
  <a href="/admin/messages">Mensajes</a>
</nav>
<div class="border-l pl-8">
  <h1>Título de Página</h1>
  <p>Descripción</p>
</div>
```

**Características:**
- Página activa: `font-semibold text-amber-800 border-b-2`
- Hover: `hover:text-amber-800 transition-colors`
- Menú a la izquierda, título a la derecha con separador vertical

### 4. **Corrección de Nombres de Tablas Supabase**
**Archivos afectados:**
- `src/pages/admin/newsletter.astro` (líneas 179, 200, 289, 315)
- `src/pages/admin/index.astro` (líneas 271, 282)
- `src/pages/api/newsletter/send.ts` (línea 94)
- `src/pages/api/newsletter/subscribe.ts` (líneas 40, 57, 86)

**Correcciones:**
| Incorrecto | Correcto |
|-----------|----------|
| `newsletter_subscribers` | `newsletter_subscriptions` |
| `contact_messages` | `contact_submissions` |
| `subscribed` (boolean) | `status` ('active'/'unsubscribed') |

**Ejemplo de cambio:**
```javascript
// Antes:
.from('newsletter_subscribers')
.select('email, subscribed')
.eq('subscribed', true)

// Después:
.from('newsletter_subscriptions')
.select('email, status')
.eq('status', 'active')
```

### 5. **Rediseño Completo del Dashboard**
**Archivo:** `src/pages/admin/index.astro` (líneas 44-289)

**Nueva Estructura:**

#### a) Resumen General (líneas 53-101)
- 4 tarjetas compactas con métricas
- Grid: `grid-cols-2 lg:grid-cols-4 gap-4`
- Iconos con colores distintivos

#### b) Gestión de Contenidos (líneas 104-201)
**Blog y Cursos en tarjetas modulares:**
- Header con gradiente de color identificativo
- Icono + título + descripción
- 2 acciones por sección:
  - Ver todos (hover bg-gray-50)
  - Crear nuevo (bg-color destacado)

**Colores:**
- Blog: `from-blue-500 to-blue-600`
- Cursos: `from-amber-500 to-amber-600`

#### c) Comunicación (líneas 204-289)
**Newsletter y Mensajes:**
- Newsletter: `from-green-500 to-emerald-600`
  - Gestionar suscriptores
  - Preview newsletter (target="_blank")
- Mensajes: `from-purple-500 to-purple-600`
  - Ver mensajes de contacto

#### d) Posts Recientes (líneas 291-324)
- Lista de últimos 5 posts
- Estado (Publicado/Borrador) con badges
- Botón "Editar" por post

**Ventajas del nuevo diseño:**
1. Jerarquía visual clara con secciones agrupadas
2. Colores consistentes por tipo de contenido
3. Acciones primarias destacadas
4. Espaciado generoso (mb-12 entre secciones)
5. Transiciones suaves en todos los hover states
6. Responsive: 1 columna móvil, 2 columnas desktop

## 🔑 Decisiones Técnicas Importantes

### Schema de Base de Datos
```sql
-- Tablas principales
blog_posts          -- Posts del blog
courses             -- Cursos con campo JSONB dates[]
newsletter_subscriptions  -- status: 'active'|'unsubscribed'
contact_submissions      -- Mensajes del formulario
```

### Autenticación
- **JWT** almacenado en cookie HTTP-only
- **Middleware:** `isAuthenticated()` en `/lib/auth/jwt.ts`
- **Session storage** para flag cliente: `admin_authenticated`

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

### Newsletter Template
**Archivo:** `src/lib/email/newsletter-template.ts`
- Diseño minimalista tipo Medium
- Tipografía: Crimson Pro/Text (serif)
- Colores: Blanco/Negro
- Width: 680px
- Parámetro `baseUrl` para localhost vs producción

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

## 🚀 Próximos Pasos Sugeridos

### Prioridad Alta
1. **Implementar envío real de emails**
   - Integrar SendGrid o Mailgun en `/api/newsletter/send.ts`
   - Configurar API key en variables de entorno
   - Testear con emails reales

2. **Configurar cron job para newsletter mensual**
   - Servicio: Vercel Cron, GitHub Actions, o cron-job.org
   - Endpoint: `POST /api/newsletter/send`
   - Frecuencia: Día 1 de cada mes
   - Header: `Authorization: Bearer ${NEWSLETTER_CRON_TOKEN}`

3. **Deploy a producción**
   - Actualizar variables de entorno en Vercel/Netlify
   - Cambiar `SITE_URL` a dominio real
   - Cambiar JWT_SECRET y NEWSLETTER_CRON_TOKEN
   - Verificar políticas RLS en Supabase

### Prioridad Media
4. **Mejorar página de edición de cursos**
   - Añadir preview de fechas antes de guardar
   - Validación de fechas (fin > inicio)
   - Confirmación antes de eliminar convocatorias

5. **Añadir funcionalidad de respuesta a mensajes**
   - Form de respuesta en `/admin/messages`
   - Integrar con servicio de email
   - Actualizar status del mensaje

6. **Optimizar imágenes**
   - Comprimir imágenes en `/public/images/`
   - Implementar lazy loading
   - Considerar usar Cloudinary o similar

### Prioridad Baja
7. **Tests automatizados**
   - Tests unitarios para funciones de lib/
   - Tests E2E con Playwright para admin panel
   - CI/CD con GitHub Actions

8. **Mejoras de UX**
   - Drag & drop para reordenar posts
   - Preview en vivo al editar posts
   - Rich text editor mejorado (TipTap o similar)

9. **Analytics**
   - Integrar Google Analytics o Plausible
   - Dashboard de métricas en admin
   - Tracking de conversiones (suscripciones, contacto)

## 🐛 Issues Conocidos

- Ninguno actualmente

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

---

**Notas para Claude:**
- El proyecto usa Astro en modo híbrido (SSR + SSG)
- JavaScript en scripts de Astro NO soporta TypeScript
- Usar operador `?.` para optional chaining es seguro
- NO usar `as` type assertions ni `!` non-null assertions en scripts cliente
- Las tablas de Supabase usan `snake_case`
- Colores del tema: Amber-800 (#92400e) para B2B, tonos tierra para B2C
