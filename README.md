# Equitracción - Nuevo Sitio Web 🐴🌲

## 🎯 Visión General

Refactorización completa del sitio web de Equitracción utilizando la **Dirección C: "Integración Radical"** - un sistema de diseño dual adaptativo que sirve simultáneamente a audiencias B2B (servicios forestales) y B2C (desarrollo personal).

## ✅ Progreso Actual

### Completado
- ✅ Análisis exhaustivo del sitio actual
- ✅ 3 Propuestas de identidad visual desarrolladas
- ✅ Stack técnico configurado (Astro + Tailwind + TypeScript)
- ✅ Sistema de diseño dual implementado
- ✅ Componentes base (Header, Footer, Button, BaseLayout)
- ✅ Página Home con bifurcación B2B/B2C + hero visual + galería 6 imágenes
- ✅ Página Servicios Forestales (B2B) + hero con imagen + galería 6 imágenes
- ✅ Página Desarrollo Personal (B2C) + hero con imagen + galería 6 imágenes
- ✅ Página Contacto (Híbrido) con formulario funcional conectado a Supabase
- ✅ Página Fundación (Híbrido) + hero con imagen + imágenes de Roberto y caballos
- ✅ Página Formación (Híbrido)
- ✅ Estructura de Blog (listado + layout + 2 artículos ejemplo)
- ✅ 25 imágenes reales integradas estratégicamente
- ✅ Tipografía serif elegante (Crimson Text) en todo el body
- ✅ Botones con bordes y texto blanco en heros oscuros
- ✅ Logotipo real de Equitracción en Header
- ✅ Backend Supabase configurado (blog posts, contacto, newsletter)
- ✅ API endpoints para blog (/api/blog/posts, /api/blog/[slug])
- ✅ API endpoint para formulario de contacto (/api/contact)
- ✅ API endpoint para newsletter (/api/newsletter)
- ✅ Esquema SQL completo con RLS, triggers y validaciones

### Pendiente
- ⏳ Configurar proyecto en Supabase (ver SUPABASE_SETUP.md)
- ⏳ Actualizar página de blog para cargar desde Supabase
- ⏳ Optimización SEO avanzada (sitemap, robots.txt)
- ⏳ Testing cross-browser y accesibilidad
- ⏳ Optimización de performance (lazy loading, compresión imágenes)

## 🎨 Sistema de Diseño - Dirección C

### Colores
**Compartidos:**
- Verde Equitracción: `#3D7045`
- Ocre Tierra: `#C0976B`

**B2B (Technical):**
- Verde Bosque: `#2C5F2D`
- Ocre Corporativo: `#B8956A`

**B2C (Emotional):**
- Verde Salvia: `#7A9B76`
- Terracota Cálida: `#C17F5F`
- Beige Lino: `#F7F4EF`

### Tipografía
- **Headings**: Crimson Pro (serif elegante y muy legible)
- **Body**: Crimson Text (serif elegante para textos largos y menú)

### Modos
- `.mode-hybrid` - Equilibrado (Home)
- `.mode-b2b` - Técnico-profesional
- `.mode-b2c` - Cálido-transformador

## 🚀 Comandos

```bash
npm run dev      # → http://localhost:4321/
npm run build    # → Genera /dist
npm run preview  # → Preview de producción
```

## 📂 Estructura

```
website/
├── src/
│   ├── components/          # Button, Header, Footer
│   ├── layouts/             # BaseLayout, BlogPostLayout
│   ├── lib/
│   │   └── supabase.ts      # Cliente Supabase + tipos TypeScript
│   ├── pages/
│   │   ├── api/             # API Routes
│   │   │   ├── blog/
│   │   │   │   ├── posts.ts      # GET /api/blog/posts
│   │   │   │   └── [slug].ts     # GET /api/blog/[slug]
│   │   │   ├── contact.ts        # POST /api/contact
│   │   │   └── newsletter.ts     # POST /api/newsletter
│   │   ├── index.astro      # Home (híbrido)
│   │   ├── servicios-forestales.astro  # B2B
│   │   ├── desarrollo-personal.astro   # B2C
│   │   ├── contacto.astro   # Híbrido + formulario funcional
│   │   ├── fundacion.astro  # Híbrido
│   │   ├── formacion.astro  # Híbrido
│   │   ├── blog.astro       # Listado blog
│   │   └── blog/            # Artículos individuales
│   ├── styles/              # global.css (sistema dual)
│   └── utils/
├── public/
│   └── images/              # 25+ imágenes reales
│       └── blog/
├── supabase-schema.sql      # Esquema completo de base de datos
├── SUPABASE_SETUP.md        # Guía de configuración paso a paso
├── .env.example             # Template de variables de entorno
└── astro.config.mjs
```

## 🗄️ Backend y Base de Datos

### Supabase (PostgreSQL)
El proyecto usa **Supabase** como backend-as-a-service:

- **Base de datos**: PostgreSQL con Row Level Security (RLS)
- **Tablas**: `blog_posts`, `contact_submissions`, `newsletter_subscriptions`
- **Triggers**: Auto-cálculo de tiempo de lectura, timestamps automáticos
- **Políticas RLS**: Lectura pública para blog, protección de datos de contacto

### Configuración
1. Consulta `SUPABASE_SETUP.md` para instrucciones paso a paso
2. Ejecuta `supabase-schema.sql` en tu proyecto de Supabase
3. Configura `.env` con tus credenciales

### API Endpoints Disponibles

#### Blog
- `GET /api/blog/posts?category=forestales&limit=10&offset=0`
- `GET /api/blog/[slug]`

#### Formularios
- `POST /api/contact` - Envía formulario de contacto
- `POST /api/newsletter` - Suscripción a newsletter

## 🎯 Próximos Pasos

1. ✅ Completar todas las páginas principales
2. ✅ Implementar estructura de Blog
3. ✅ Integrar Supabase para CMS dinámico (blog + formularios)
4. ✅ Añadir imágenes reales del proyecto
5. **Siguiente**: Configurar proyecto en Supabase y agregar contenido
6. Optimizar SEO: sitemap, robots.txt, schema markup adicional
7. Testing: cross-browser, accesibilidad WCAG 2.1 AA
8. Optimizar performance: < 2.5s LCP, lazy loading, compresión imágenes

## 📄 Documentos

- `analisis-sitio-actual-equitraccion.md` - Auditoría completa
- `propuestas-identidad-visual-equitraccion.md` - 3 direcciones + recomendación
- `SUPABASE_SETUP.md` - **NUEVO**: Guía completa de configuración del backend
- `supabase-schema.sql` - **NUEVO**: Esquema de base de datos

---

**Servidor corriendo en**: http://localhost:4321/
**Última actualización**: 6 de enero de 2025
