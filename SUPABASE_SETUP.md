# Configuración de Supabase para Equitracción

Este documento describe cómo configurar Supabase para el backend del sitio web de Equitracción.

## 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta gratuita
2. Crea un nuevo proyecto:
   - **Nombre**: Equitracción
   - **Contraseña de base de datos**: Guarda esta contraseña de forma segura
   - **Región**: Europe West (Frankfurt) - la más cercana a España

## 2. Ejecutar el Esquema SQL

1. En el panel de Supabase, ve a **SQL Editor**
2. Copia todo el contenido del archivo `supabase-schema.sql`
3. Pégalo en el editor y ejecuta (botón "Run")
4. Esto creará todas las tablas, índices, políticas RLS y triggers necesarios

## 3. Obtener las Credenciales

1. Ve a **Settings** → **API** en el panel de Supabase
2. Encontrarás dos valores importantes:

### Project URL
```
https://tu-proyecto.supabase.co
```

### API Keys
- **anon key** (pública): Para uso en el cliente
- **service_role key** (secreta): Solo para uso en servidor

## 4. Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto (NO lo subas a Git)
2. Copia el contenido de `.env.example`
3. Rellena con tus credenciales:

```bash
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

## 5. Verificar la Instalación

### Probar el Formulario de Contacto

1. Inicia el servidor: `npm run dev`
2. Ve a http://localhost:4321/contacto
3. Rellena y envía el formulario
4. Verifica en Supabase → **Table Editor** → **contact_submissions** que aparece el registro

### Probar los Endpoints de Blog

```bash
# Obtener posts (debería devolver un array vacío inicialmente)
curl http://localhost:4321/api/blog/posts

# Obtener un post específico (debería devolver 404 si no hay posts)
curl http://localhost:4321/api/blog/mi-primer-post
```

## 6. Agregar Contenido de Prueba al Blog

Ve a Supabase → **Table Editor** → **blog_posts** y añade un post de prueba:

```sql
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  category,
  published
) VALUES (
  'Bienvenidos a Equitracción',
  'bienvenidos-a-equitraccion',
  'Descubre cómo la tracción animal transforma bosques y personas',
  '# Bienvenidos a Equitracción\n\nEste es nuestro primer artículo...',
  'fundacion',
  true
);
```

## 7. Estructura de las Tablas

### blog_posts
- **id**: UUID (automático)
- **title**: Título del post
- **slug**: URL amigable (único)
- **excerpt**: Resumen breve
- **content**: Contenido completo (Markdown)
- **cover_image**: URL de imagen de portada (opcional)
- **author**: Nombre del autor (default: Roberto Contaldo)
- **category**: 'forestales' | 'desarrollo' | 'formacion' | 'fundacion'
- **tags**: Array de etiquetas (opcional)
- **published**: true/false
- **published_at**: Fecha de publicación (automático)
- **reading_time**: Minutos de lectura (calculado automáticamente)

### contact_submissions
- **id**: UUID (automático)
- **name**: Nombre del remitente
- **email**: Email del remitente
- **phone**: Teléfono (opcional)
- **subject**: Asunto
- **message**: Mensaje
- **category**: 'forestales' | 'desarrollo' | 'formacion' | 'general'
- **status**: 'new' | 'read' | 'replied' | 'archived'

### newsletter_subscriptions
- **id**: UUID (automático)
- **email**: Email (único)
- **status**: 'active' | 'unsubscribed'
- **source**: Origen de la suscripción (opcional)

## 8. Seguridad (Row Level Security)

Las políticas RLS están configuradas para:

✅ **Blog**: Cualquiera puede leer posts publicados, solo service role puede escribir
✅ **Contacto**: Cualquiera puede enviar, solo service role puede leer
✅ **Newsletter**: Cualquiera puede suscribirse, solo service role administra

## 9. Próximos Pasos

### Panel de Administración
Para gestionar el blog de forma visual, considera:
- Crear un panel admin con autenticación
- Usar Supabase Auth para proteger rutas admin
- Implementar editor Markdown con vista previa

### Notificaciones
- Configurar webhooks de Supabase para recibir emails cuando lleguen contactos
- Integrar con servicio de email (Resend, SendGrid, etc.)

### Analytics
- Añadir contador de visitas a posts
- Tracking de formularios enviados por categoría

## 10. Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Row Level Security policy violation"
- Verifica que las políticas RLS se hayan creado correctamente
- Ejecuta de nuevo el SQL schema completo

### Formulario no envía
- Abre la consola del navegador para ver errores
- Verifica que la URL del API endpoint sea correcta
- Comprueba que Supabase esté accesible desde tu red

## Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## 6. Tabla de Cursos (courses)

Esta tabla almacena los cursos de formación con sus convocatorias.

### Crear la tabla

```sql
-- Tabla de cursos
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  duration_days INTEGER NOT NULL,
  level INTEGER NOT NULL CHECK (level > 0),
  experience_level VARCHAR(50) NOT NULL, -- 'Iniciación', 'Intermedio', 'Avanzado'
  max_participants INTEGER NOT NULL CHECK (max_participants > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  target_audience TEXT NOT NULL,
  contents TEXT NOT NULL,
  requirements TEXT,
  dates JSONB NOT NULL, -- Array de fechas de convocatorias
  location VARCHAR(200) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_courses_active ON courses(active);
CREATE INDEX idx_courses_dates ON courses USING GIN (dates);

-- Trigger para updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Lectura pública de cursos activos
CREATE POLICY "Public read access for active courses" ON courses
  FOR SELECT USING (active = true);

-- Escritura solo para service_role
CREATE POLICY "Service role full access" ON courses
  FOR ALL USING (auth.role() = 'service_role');

-- Comentarios
COMMENT ON TABLE courses IS 'Cursos de formación con sus convocatorias';
COMMENT ON COLUMN courses.dates IS 'Array JSON con fechas de convocatorias [{"start": "2025-03-15", "end": "2025-03-18", "spots_available": 12}]';
```

### Ejemplo de inserción

```sql
INSERT INTO courses (
  title,
  duration_days,
  level,
  experience_level,
  max_participants,
  price,
  target_audience,
  contents,
  requirements,
  dates,
  location
) VALUES (
  'Tracción Animal Aplicada a la Silvicultura',
  4,
  1,
  'Iniciación',
  12,
  450.00,
  'Profesionales forestales, propietarios de fincas, personas interesadas en silvicultura sostenible',
  '- Fundamentos de tracción equina
- Selección y cuidado de los animales
- Técnicas de trabajo en bosque
- Seguridad y prevención de riesgos
- Práctica en terreno real',
  'No se requiere experiencia previa. Edad mínima 18 años. Condición física básica.',
  '[
    {"start": "2025-03-15", "end": "2025-03-18", "spots_available": 12},
    {"start": "2025-05-10", "end": "2025-05-13", "spots_available": 12}
  ]'::jsonb,
  'Monte Esquela, Talaveruela de la Vera, Cáceres'
);
```

### Estructura del campo dates (JSONB)

```json
[
  {
    "start": "2025-03-15",
    "end": "2025-03-18",
    "spots_available": 12,
    "notes": "Convocatoria primavera"
  },
  {
    "start": "2025-05-10",
    "end": "2025-05-13",
    "spots_available": 10,
    "notes": "Última convocatoria antes del verano"
  }
]
```
