# Sitio Web Equitracción

Sitio web oficial de la Fundación Equitracción - Gestión forestal sostenible con tracción equina y desarrollo personal transformador.

## 🌟 Características

- **Diseño Dual B2B/B2C** - Sistema de diseño adaptable según el tipo de servicio
- **Blog Dinámico** - Sistema de gestión de contenidos con Supabase
- **Formularios Funcionales** - Contacto y newsletter integrados
- **SEO Optimizado** - Sitemap, robots.txt, meta tags y Schema.org
- **Seguridad Robusta** - JWT, rate limiting, validación de inputs
- **Admin Panel** - Panel de administración protegido para gestión de contenidos

## 🏗️ Stack Tecnológico

- **Framework:** Astro 5.x (SSR híbrido)
- **Estilos:** Tailwind CSS 4.x
- **Base de Datos:** Supabase
- **Autenticación:** JWT + httpOnly cookies
- **Tipografía:** Crimson Pro & Crimson Text (Google Fonts)
- **Hosting:** Vercel / Netlify / VPS

## 📦 Estructura del Proyecto

```
/
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes Astro reutilizables
│   ├── layouts/         # Layouts base
│   ├── pages/           # Páginas del sitio
│   │   ├── api/         # Endpoints de API
│   │   └── admin/       # Panel de administración
│   ├── lib/             # Utilidades y lógica
│   │   ├── auth/        # Autenticación JWT
│   │   ├── validation/  # Validación y sanitización
│   │   └── security/    # Rate limiting
│   └── styles/          # Estilos globales
├── scripts/             # Scripts de deployment
├── .env.example         # Template de variables de entorno
├── PRODUCTION_SETUP.md  # Guía de configuración de producción
├── SECURITY.md          # Documentación de seguridad
└── package.json
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18 o superior
- npm o pnpm
- Cuenta de Supabase (para backend)

### Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/equitraccion.git
cd equitraccion/website
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales (ver [Variables de Entorno](#-variables-de-entorno)).

4. **Configurar Supabase:**

Consulta `SUPABASE_SETUP.md` para crear las tablas necesarias.

5. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## 🔐 Variables de Entorno

Variables críticas para el funcionamiento del sitio:

```env
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Autenticación
JWT_SECRET=secreto_de_32_caracteres_minimo
ADMIN_EMAIL=admin@equitraccion.com
ADMIN_PASSWORD=hash_bcrypt_de_la_contraseña

# Sitio
SITE_URL=https://equitraccion.com
NODE_ENV=production

# Seguridad
SESSION_SECRET=secreto_de_sesion_32_caracteres
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

**⚠️ IMPORTANTE:** Consulta `PRODUCTION_SETUP.md` para instrucciones detalladas sobre cómo generar valores seguros.

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Iniciar servidor de desarrollo

# Build
npm run build         # Compilar para producción
npm run preview       # Previsualizar build de producción

# Verificación
npm run verify-env    # Verificar configuración de variables
npm run check         # Verificar código Astro
npm run security-audit # Auditoría de seguridad de dependencias

# Pre-deployment
npm run pre-deploy    # Verificar config + build
```

## 🔒 Seguridad

El sitio implementa múltiples capas de seguridad:

- ✅ Autenticación JWT con cookies httpOnly
- ✅ Rate limiting (login, API, formularios)
- ✅ Headers de seguridad HTTP (CSP, HSTS, X-Frame-Options, etc.)
- ✅ Validación y sanitización de inputs
- ✅ Protección contra XSS, CSRF, SQL Injection
- ✅ Contraseñas hasheadas con bcrypt

**Documentación completa:** Ver `SECURITY.md`

## 🌐 Despliegue a Producción

### Checklist Pre-Despliegue

1. **Verificar configuración:**
```bash
npm run verify-env
```

2. **Auditoría de seguridad:**
```bash
npm run security-audit
```

3. **Build de prueba:**
```bash
npm run build
npm run preview
```

4. **Desplegar:**

**Vercel (Recomendado):**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**VPS:**
Consulta `PRODUCTION_SETUP.md` → Opción C

### Documentación Detallada

- **[PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)** - Guía completa de despliegue
- **[SECURITY.md](./SECURITY.md)** - Documentación de seguridad
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Configuración de base de datos

## 📄 Páginas del Sitio

### Públicas
- `/` - Home
- `/fundacion` - Sobre la fundación
- `/servicios-forestales` - Servicios B2B
- `/desarrollo-personal` - Servicios B2C
- `/formacion` - Cursos y talleres
- `/blog` - Blog
- `/contacto` - Formulario de contacto
- `/legal` - Aviso legal
- `/privacidad` - Política de privacidad
- `/cookies` - Política de cookies

### Administrativas (Protegidas)
- `/admin/login` - Login de administrador
- `/admin/posts` - Gestión de blog posts
- `/admin/posts/new` - Crear nuevo post
- `/admin/posts/edit/[id]` - Editar post

## 🎨 Sistema de Diseño

### Modos de Diseño

El sitio usa tres modos visuales:

1. **B2B** (Servicios Forestales)
   - Colores: Tierra, marrón oscuro
   - Tono: Profesional, técnico

2. **B2C** (Desarrollo Personal)
   - Colores: Verde, tonos cálidos
   - Tono: Personal, emocional

3. **Hybrid** (Home, Blog, Fundación)
   - Fusión de ambos estilos
   - Equilibrio profesional/personal

### Tipografía

- **Headings:** Crimson Pro (serif elegante)
- **Body:** Crimson Text (legibilidad óptima)

### Paleta de Colores

```css
--color-brand-primary: #8B4513 (marrón tierra)
--color-brand-secondary: #D2691E (marrón cálido)
--color-accent-green: #6B8E23 (verde oliva)
--color-accent-warm: #CD853F (beige tostado)
```

## 🧪 Desarrollo

### Añadir una Nueva Página

1. Crear archivo en `src/pages/`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout 
  title="Título | Equitracción"
  description="Descripción para SEO"
  mode="hybrid"
>
  <Header mode="hybrid" />
  
  <main>
    <!-- Contenido -->
  </main>
  
  <Footer />
</BaseLayout>
```

2. Añadir al menú en `src/components/Header.astro`

### Crear un Endpoint de API

1. Crear archivo en `src/pages/api/`:
```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  // Lógica del endpoint
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

2. Aplicar rate limiting si es necesario (ver ejemplos en `src/pages/api/auth/`)

### Proteger una Ruta Admin

Las rutas bajo `/admin/*` se protegen automáticamente con el middleware.

Para verificar autenticación en una página:
```astro
---
import { isAuthenticated, getAuthenticatedUser } from '../lib/auth/jwt';

if (!isAuthenticated(Astro)) {
  return Astro.redirect('/admin/login');
}

const user = getAuthenticatedUser(Astro);
---
```

## 🐛 Troubleshooting

### Error: "Admin credentials not configured"

**Solución:** Verificar que `ADMIN_EMAIL` y `ADMIN_PASSWORD` estén en `.env`

### Build falla con error de Supabase

**Solución:** Verificar que todas las variables `SUPABASE_*` estén configuradas

### Rate limiting no funciona

**Solución:** En producción con múltiples servidores, implementar Redis para almacenamiento compartido

### Headers de seguridad no aparecen

**Solución:** Verificar que el middleware esté activo en `src/middleware.ts`

## 📞 Soporte

- **Email:** info@equitraccion.com
- **Teléfono:** +34 681 298 028
- **Web:** https://equitraccion.com

## 📝 Licencia

Copyright © 2025 Fundación Equitracción. Todos los derechos reservados.

---

**Última actualización:** 2025-01-06
