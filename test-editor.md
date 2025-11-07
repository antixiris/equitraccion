# Plan de Testeo del Editor WYSIWYG

## Problema Identificado y Solucionado

**ROOT CAUSE:**
El archivo `edit/[id].astro` estaba usando TurndownService para convertir el HTML del editor a Markdown antes de guardarlo. Esto destruía completamente el formato visual.

**SOLUCIÓN:**
1. Eliminado TurndownService de edit/[id].astro
2. Ahora guarda HTML directamente (igual que new.astro)
3. Detecta automáticamente si el contenido es HTML nuevo o Markdown viejo
4. CSS WYSIWYG unificado entre ambos archivos
5. Función formatText mejorada con gestión de cursor

## Tests a Realizar en Producción

### Test 1: Crear Post Nuevo
URL: https://equitraccion.vercel.app/admin/posts/new

1. Login como admin
2. Ir a Nuevo Post
3. Escribir contenido con TODO el formato:
   - **Texto en negrita**
   - *Texto en cursiva*
   - # Título H1
   - ## Título H2
   - ### Título H3
   - Lista con viñetas
   - Lista numerada
   - > Cita en blockquote
   - Enlace
   - Imagen insertada
4. Verificar que el formato se ve EN TIEMPO REAL mientras escribes
5. Guardar como Publicado
6. Ir al frontend y verificar que el formato se renderiza correctamente

**EXPECTED:** Todo el formato debe verse tanto en el editor como en el frontend

### Test 2: Editar Post Existente
URL: https://equitraccion.vercel.app/admin/posts

1. Abrir un post existente para editar
2. Verificar que el contenido se carga con formato (si era HTML)
3. Añadir más formato: negrita, cursiva, lista
4. Guardar
5. Reabrir el post
6. Verificar que el nuevo formato se preservó

**EXPECTED:** El formato se debe preservar entre ediciones

### Test 3: Backward Compatibility
1. Si hay posts viejos en Markdown, deben:
   - Cargarse correctamente convertidos a HTML
   - Poder editarse con el nuevo editor
   - Guardarse como HTML a partir de ahora

**EXPECTED:** No romper posts existentes

## Archivos Modificados

### `src/pages/admin/posts/edit/[id].astro`
- Línea 303-316: Reemplazado imports (marked en vez de TurndownService)
- Línea 380-384: Detección HTML vs Markdown
- Línea 599-601: Guardar HTML directamente
- Línea 210: Clases CSS actualizadas
- Línea 413-466: Función formatText mejorada
- Línea 673-837: CSS WYSIWYG completo

### `src/pages/admin/posts/new.astro`
Ya estaba correcto (guardando HTML)

### `src/pages/blog/[slug].astro`
Ya tenía detección HTML vs Markdown para renderizar

## Resultado Esperado

Después de estos cambios:
- ✅ El formato se ve EN TIEMPO REAL mientras escribes
- ✅ El formato se GUARDA correctamente en la base de datos
- ✅ El formato se RENDERIZA correctamente en el frontend
- ✅ Compatible con posts viejos en Markdown
- ✅ Negrita, cursiva, listas, citas, títulos, enlaces, imágenes funcionan
