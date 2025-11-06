# Guía de Gestión de Contenidos - Blog Equitracción

Esta guía explica cómo gestionar los contenidos del blog de Equitracción usando Supabase como CMS.

## 📋 Tabla de Contenidos

1. [Acceso al CMS](#acceso-al-cms)
2. [Crear un Nuevo Post](#crear-un-nuevo-post)
3. [Editar un Post Existente](#editar-un-post-existente)
4. [Publicar/Despublicar Posts](#publicardespublicar-posts)
5. [Gestionar Categorías y Tags](#gestionar-categorías-y-tags)
6. [Formato del Contenido (Markdown)](#formato-del-contenido-markdown)
7. [Mejores Prácticas](#mejores-prácticas)

---

## 🔐 Acceso al CMS

1. **URL del Dashboard**: https://xmucbjbtgmjezypkdjpc.supabase.co
2. Inicia sesión con tus credenciales de Supabase
3. En el menú lateral, haz clic en **Table Editor**
4. Selecciona la tabla **blog_posts**

---

## ✍️ Crear un Nuevo Post

### Opción 1: Usando el Table Editor (Recomendado para empezar)

1. En **Table Editor** → **blog_posts**, haz clic en **Insert** → **Insert row**
2. Rellena los campos:

   **Campos obligatorios:**
   - `title`: Título del post (máx. 200 caracteres)
   - `slug`: URL amigable (ej: `mi-primer-post-forestal`)
     - Solo minúsculas, números y guiones
     - Sin espacios, tildes ni caracteres especiales
   - `excerpt`: Resumen breve del post (2-3 frases, máx. 300 caracteres)
   - `content`: Contenido completo en formato Markdown (ver sección de formato)
   - `author`: Nombre del autor (ej: "Roberto Contaldo")
   - `category`: Seleccionar entre:
     - `forestales` → Aparecerá como "Silvicultura"
     - `desarrollo` → Aparecerá como "Desarrollo Personal"
     - `formacion` → Aparecerá como "Formación"
     - `fundacion` → Aparecerá como "Fundación"
   - `published`:
     - `true` → El post aparece en el blog
     - `false` → Borrador, no visible públicamente

   **Campos opcionales:**
   - `cover_image`: URL de la imagen de portada (ej: `/images/blog/mi-imagen.jpg`)
   - `tags`: Array de etiquetas (ej: `["tracción equina", "sostenibilidad"]`)
   - `reading_time`: Tiempo estimado de lectura en minutos (ej: `8`)
   - `published_at`: Fecha de publicación (se auto-completa si dejas en blanco)

3. Haz clic en **Save**
4. El post aparecerá inmediatamente en el blog si `published = true`

### Opción 2: Usando SQL Editor (Para insertar múltiples posts)

1. En el menú lateral, haz clic en **SQL Editor**
2. Crea una nueva query
3. Usa este template:

```sql
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image,
  author,
  category,
  tags,
  published,
  reading_time
) VALUES (
  'Título de mi post',
  'titulo-de-mi-post',
  'Este es un resumen breve del post que aparecerá en el listado del blog.',
  '# Título Principal

Este es el contenido completo del post en formato Markdown.

## Subtítulo

- Lista de items
- Otro item

**Texto en negrita** y *texto en cursiva*.

[Enlace a página](https://ejemplo.com)',
  '/images/blog/mi-imagen.jpg',
  'Roberto Contaldo',
  'forestales',
  ARRAY['tracción equina', 'gestión forestal', 'sostenibilidad'],
  true,
  8
);
```

4. Haz clic en **Run** (Cmd/Ctrl + Enter)

---

## ✏️ Editar un Post Existente

1. En **Table Editor** → **blog_posts**
2. Encuentra el post que quieres editar (puedes usar el buscador)
3. Haz clic en la fila para seleccionarla
4. Haz clic en el icono del **lápiz** (Edit)
5. Modifica los campos que necesites
6. Haz clic en **Save**
7. **Recarga la página del blog** en tu navegador (Cmd/Ctrl + R)
8. Los cambios se verán inmediatamente reflejados

### Ediciones comunes:

- **Corrección de erratas**: Edita el campo `content`
- **Cambiar título**: Edita `title` y/o `slug` (⚠️ cambiar el slug romperá enlaces externos)
- **Actualizar excerpt**: Edita `excerpt`
- **Añadir tags**: Edita `tags` (formato: `["tag1", "tag2", "tag3"]`)

---

## 🚀 Publicar/Despublicar Posts

### Publicar un borrador:
1. Encuentra el post con `published = false`
2. Haz clic en el lápiz para editar
3. Cambia `published` a `true`
4. Añade `published_at` con la fecha actual (o déjalo vacío para auto-completar)
5. Guarda

### Despublicar un post (convertir en borrador):
1. Encuentra el post con `published = true`
2. Cambia `published` a `false`
3. Guarda
4. El post desaparecerá del blog pero seguirá en la base de datos

---

## 🏷️ Gestionar Categorías y Tags

### Categorías disponibles:
Las categorías están predefinidas en el sistema:

| Valor en DB | Se muestra como | Modo visual |
|-------------|-----------------|-------------|
| `forestales` | Silvicultura | B2B (azul) |
| `desarrollo` | Desarrollo Personal | B2C (naranja) |
| `formacion` | Formación | B2B (azul) |
| `fundacion` | Fundación | Hybrid (ambos) |

### Cómo usar tags:

Los tags son palabras clave que ayudan a categorizar el contenido. Formato:

```sql
-- Correcto:
ARRAY['tracción equina', 'caballos', 'sostenibilidad']

-- Incorrecto:
['tracción equina', 'caballos']  ❌ (falta ARRAY)
"tracción equina, caballos"      ❌ (no es un array)
```

**Recomendaciones de tags:**
- Usa 3-6 tags por post
- Sé específico pero no demasiado técnico
- Usa nombres consistentes (ej: siempre "tracción equina", no "tracción animal")
- Ejemplos buenos:
  - `tracción equina`
  - `gestión forestal`
  - `coaching con caballos`
  - `sostenibilidad`
  - `desarrollo personal`
  - `formación profesional`

---

## 📝 Formato del Contenido (Markdown)

El contenido de los posts se escribe en **Markdown**, un formato de texto simple que se convierte en HTML.

### Sintaxis básica:

```markdown
# Título principal (H1)
## Subtítulo (H2)
### Sección (H3)

Párrafo normal. El texto fluye naturalmente y se envuelve automáticamente.

**Texto en negrita** y *texto en cursiva*.

[Enlace a sitio externo](https://ejemplo.com)

![Imagen](https://ejemplo.com/imagen.jpg)

## Lista sin orden:
- Item 1
- Item 2
- Item 3

## Lista ordenada:
1. Primer paso
2. Segundo paso
3. Tercer paso

> Esto es una cita o blockquote.
> Se usa para destacar frases importantes.

---

Línea horizontal para separar secciones.

### Código inline:
Usa `código` inline para comandos o términos técnicos.

### Bloque de código:
\`\`\`
Bloque de código
para varios líneas
\`\`\`
```

### Ejemplo de post completo:

```markdown
# Gestión forestal sostenible con tracción equina

La tracción animal forestal no es una reliquia del pasado, sino una tecnología de vanguardia para la silvicultura del siglo XXI.

## ¿Por qué recuperar la tracción equina?

Los motivos son diversos y complementarios:

### 1. Impacto ambiental mínimo

- **Compactación del suelo**: Solo 8% vs 45% de maquinaria pesada
- **Daños a vegetación**: Reducción del 90%
- **Emisiones**: Cero emisiones de CO₂ directas

### 2. Accesibilidad en terrenos difíciles

Los caballos pueden trabajar en:
- Pendientes superiores al 40%
- Zonas húmedas y encharcadas
- Espacios protegidos donde la maquinaria está prohibida

## Caso real: Sierra de Gredos

En 2024 trabajamos 180 hectáreas con estos resultados:

> "La diferencia entre la zona trabajada con caballos y la zona con maquinaria es evidente incluso años después. El suelo mantiene su estructura y la regeneración natural es espectacular." — Ingeniero forestal, Junta de Extremadura

**Datos clave:**
- Productividad: 15m³/día
- Coste: Competitivo con maquinaria en terrenos difíciles
- Certificación: FSC y PEFC mantenidas

[Más información sobre nuestros servicios](/servicios-forestales)

---

*¿Quieres aprender estas técnicas? Consulta nuestros [cursos de formación](/formacion).*
```

---

## 💡 Mejores Prácticas

### Para escribir posts efectivos:

1. **Título claro y específico**
   - ✅ "Técnicas de arrastre forestal en pendientes superiores al 40%"
   - ❌ "Cosas sobre caballos"

2. **Excerpt atractivo**
   - Responde: ¿De qué trata? ¿Por qué debería leerlo?
   - Usa 2-3 frases completas
   - No termines con puntos suspensivos

3. **Estructura del contenido**
   - Comienza con un párrafo gancho
   - Usa subtítulos (H2, H3) para organizar
   - Listas para información escaneable
   - Blockquotes para destacar citas o datos importantes

4. **Longitud ideal**
   - Posts técnicos (B2B): 800-1500 palabras (8-15 min lectura)
   - Posts reflexivos (B2C): 600-1000 palabras (6-10 min lectura)
   - Historias: 1000-1800 palabras (10-18 min lectura)

5. **SEO básico**
   - Incluye palabras clave naturalmente en título, excerpt y contenido
   - Usa subtítulos descriptivos
   - Enlaces internos a otras páginas del sitio
   - Tags relevantes

6. **Imágenes**
   - Usa imágenes de alta calidad (mínimo 1200px de ancho)
   - Formato recomendado: WebP o JPG
   - Guarda en `/public/images/blog/`
   - Nombres descriptivos: `tecnicas-arrastre-pendiente.jpg`

### Workflow recomendado:

1. **Borrador** (`published = false`)
   - Escribe el contenido completo
   - Revisa ortografía y gramática
   - Pide feedback interno

2. **Pre-publicación**
   - Añade imagen de portada
   - Verifica tags y categoría
   - Calcula `reading_time` (divide palabras entre 200)
   - Previsualiza en el sitio (si está como borrador, accede directamente via URL)

3. **Publicación** (`published = true`)
   - Establece `published_at` con fecha/hora deseada
   - Comparte en redes sociales
   - Añade a newsletter si aplica

---

## 🔧 Troubleshooting

### El post no aparece en el blog

**Posibles causas:**
1. `published = false` → Cambia a `true`
2. `published_at` en el futuro → Verifica la fecha
3. Caché del navegador → Recarga con Cmd/Ctrl + Shift + R

### Error al guardar

**Posibles causas:**
1. `slug` duplicado → Cada slug debe ser único
2. `category` inválido → Usa solo: `forestales`, `desarrollo`, `formacion`, `fundacion`
3. Formato de `tags` incorrecto → Usa: `ARRAY['tag1', 'tag2']`

### El formato del contenido se ve mal

**Posibles causas:**
1. Markdown incorrecto → Revisa sintaxis
2. Falta un salto de línea después de títulos
3. Listas sin línea en blanco anterior

---

## 📞 Soporte

Si encuentras problemas o tienes dudas:

1. Consulta esta guía primero
2. Revisa la documentación de Markdown: https://www.markdownguide.org/
3. Revisa los posts de ejemplo en la base de datos
4. Contacta al desarrollador si el problema persiste

---

**Última actualización**: 2025-01-06
**Versión del sistema**: 1.0
