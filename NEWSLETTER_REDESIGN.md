# Newsletter Redesign - Estilo Medium

## Cambios Realizados

### Diseño del Newsletter

Se ha rediseñado completamente el template del newsletter con un estilo elegante y sofisticado inspirado en Medium:

**Características del nuevo diseño:**

1. **Header con Logo SVG**
   - Logo de la fundación en esquina superior izquierda
   - Título "Equitracción" con tipografía Crimson Pro (42px, weight 400)
   - Subtítulo "Newsletter · [mes] [año]" en uppercase con letter-spacing

2. **Paleta de Colores Minimalista**
   - Fondo: #ffffff (blanco puro)
   - Texto principal: #1a1a1a (negro suave)
   - Texto secundario: #6b6b6b (gris medio)
   - Texto terciario: #999 (gris claro)
   - Acentos: #1a1a1a (negro para botones y separadores)

3. **Tipografía Serif Elegante**
   - Google Fonts: Crimson Pro (títulos) y Crimson Text (cuerpo)
   - Line-height generoso (1.7) para mejor legibilidad
   - Tamaños jerárquicos: 42px (h1), 32px (h2), 24px (artículos), 20px (cursos)

4. **Layout Limpio**
   - Ancho máximo: 680px (óptimo para lectura)
   - Espaciado generoso entre secciones (48px)
   - Dividers sutiles (#e0e0e0) entre bloques
   - Sin gradientes ni colores llamativos

5. **Artículos del Blog**
   - Títulos con links sin decoración
   - Excerpts en tamaño 17px
   - Link "Leer artículo completo" con borde inferior sutil
   - Espaciado de 40px entre artículos

6. **Sección de Cursos**
   - Tarjetas con fondo #fafafa
   - Borde izquierdo de 3px negro (#1a1a1a)
   - Badge de nivel en negro con texto blanco
   - Información estructurada: fecha, ubicación, precio
   - Botón negro "Reservar plaza"

7. **Footer Minimalista**
   - Información centrada
   - Colores sutiles (#6b6b6b, #999)
   - Link de desuscripción discreto

## Scripts SQL Incluidos

### 1. `supabase-courses-data.sql`

Inserta 4 cursos de ejemplo con convocatorias activas:

1. **Introducción a la Tracción Animal en Silvicultura** (3 días, Iniciación, 380€)
   - Febrero 10-12, 2025
   - Abril 7-9, 2025

2. **Silvicultura Profesional con Tracción Animal** (5 días, Avanzado, 950€)
   - Marzo 17-21, 2025
   - Junio 2-6, 2025

3. **Coaching Asistido con Caballos: El Espejo del Ser** (4 días, Iniciación, 420€)
   - Febrero 20-23, 2025
   - Mayo 1-4, 2025

4. **Herraje Natural y Cuidado Integral del Casco** (2 días, Intermedio, 280€)
   - Marzo 8-9, 2025
   - Mayo 24-25, 2025

### 2. `supabase-update-posts-dates.sql`

Actualiza las fechas de los posts existentes a octubre 2024 para poder ver el newsletter con contenido del mes anterior.

## Instrucciones de Uso

### Paso 1: Ejecutar Schema de Cursos

```sql
-- En Supabase Dashboard → SQL Editor
-- Ejecutar primero: supabase-courses-schema.sql
-- (Si aún no lo has ejecutado)
```

### Paso 2: Insertar Cursos de Ejemplo

```sql
-- En Supabase Dashboard → SQL Editor
-- Ejecutar: supabase-courses-data.sql
```

### Paso 3: Actualizar Fechas de Posts (Opcional)

```sql
-- En Supabase Dashboard → SQL Editor
-- Ejecutar: supabase-update-posts-dates.sql
-- Esto moverá los posts a octubre 2024
```

### Paso 4: Ver el Preview del Newsletter

Una vez ejecutados los scripts, visita:

```
http://localhost:4321/api/newsletter/send?preview=true
```

O desde el admin:

```
http://localhost:4321/admin
```

Y haz clic en el botón "Preview Newsletter" (verde).

## Resultado Esperado

El newsletter ahora muestra:

- **Logo y header elegante** en la parte superior
- **3 posts de octubre 2024** en la sección de artículos
- **4 cursos con convocatorias futuras** en la sección de formación
- **Diseño limpio y sofisticado** tipo Medium
- **Tipografía serif** elegante y legible
- **Colores minimalistas** (blanco, negro, grises)

## Personalización Futura

Para personalizar el newsletter, edita:

```
src/lib/email/newsletter-template.ts
```

**Elementos personalizables:**

- Logo SVG (línea 118-125)
- Colores (#1a1a1a, #6b6b6b, etc.)
- Tipografía (Crimson Pro/Text)
- Espaciados y tamaños
- Textos del intro y footer

## Notas Técnicas

- El logo es un SVG inline (48x48px) que representa un caballo estilizado
- Las fuentes se cargan desde Google Fonts
- El diseño es responsive y compatible con clientes de email
- Usa tables para máxima compatibilidad con clientes email
- No usa CSS externo, todo inline para evitar problemas de renderizado

---

**Última actualización:** 2025-01-06
