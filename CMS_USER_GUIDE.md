# Guía de Uso del CMS de Equitracción

Bienvenido al Panel de Administración de Equitracción. Esta guía te ayudará a gestionar el contenido de tu sitio web de forma fácil e intuitiva.

## 📋 Tabla de Contenidos

1. [Acceso al CMS](#acceso-al-cms)
2. [Panel Principal (Dashboard)](#panel-principal-dashboard)
3. [Gestión de Posts](#gestión-de-posts)
4. [Crear un Nuevo Post](#crear-un-nuevo-post)
5. [Editar un Post Existente](#editar-un-post-existente)
6. [Formato Markdown](#formato-markdown)
7. [Gestión de Imágenes](#gestión-de-imágenes)
8. [Publicar y Despublicar](#publicar-y-despublicar)
9. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🔐 Acceso al CMS

### URL del CMS
```
https://tu-sitio.com/admin/login
```

### Credenciales Iniciales
- **Usuario**: `admin`
- **Contraseña**: `equitraccion2025`

> ⚠️ **IMPORTANTE**: Cambia estas credenciales después del primer acceso contactando al desarrollador.

### Inicio de Sesión
1. Abre tu navegador (Chrome, Firefox, Safari, Edge)
2. Ve a la URL del admin: `/admin/login`
3. Introduce tu usuario y contraseña
4. Haz clic en "Iniciar Sesión"

---

## 🏠 Panel Principal (Dashboard)

Después de iniciar sesión, verás el **Dashboard** con:

### Estadísticas Rápidas
- **Posts Totales**: Número total de artículos
- **Publicados**: Posts visibles en el sitio web
- **Borradores**: Posts guardados pero no publicados
- **Categorías**: Número de categorías disponibles

### Acciones Principales
1. **Gestionar Posts del Blog**: Ver y editar todos los posts
2. **Crear Nuevo Post**: Escribir un nuevo artículo
3. **Mensajes de Contacto**: Ver formularios recibidos

### Barra Superior
- **Ver Sitio Web**: Abre el sitio público en nueva pestaña
- **Cerrar Sesión**: Sal del panel de administración

---

## 📝 Gestión de Posts

### Acceder a la Gestión de Posts
1. Desde el Dashboard, haz clic en "Gestionar Posts del Blog"
2. O ve directamente a `/admin/posts`

### Lista de Posts
Verás una tabla con todos tus posts que muestra:
- **Imagen miniatura** (si tiene)
- **Título y extracto** del post
- **Categoría** (Silvicultura, Desarrollo Personal, etc.)
- **Estado** (Publicado o Borrador)
- **Fecha de creación**
- **Acciones** (Ver, Editar, Eliminar)

### Filtros Disponibles
1. **Búsqueda**: Escribe para buscar por título o contenido
2. **Filtro por Categoría**: Muestra solo posts de una categoría
3. **Filtro por Estado**: Filtra entre publicados y borradores

### Acciones sobre un Post
- **👁️ Ver**: Abre el post en el sitio web (nueva pestaña)
- **✏️ Editar**: Abre el editor para modificar el post
- **🗑️ Eliminar**: Borra el post permanentemente (te pedirá confirmación)

### Cambiar Estado de Publicación
- Haz clic en el **badge de estado** (verde "Publicado" o amarillo "Borrador")
- El estado cambiará inmediatamente
- ✅ Verde = Visible en el sitio web
- ⏳ Amarillo = No visible, guardado como borrador

---

## ✍️ Crear un Nuevo Post

### Paso 1: Acceder al Editor
1. Desde el Dashboard o la lista de posts, haz clic en "Nuevo Post"
2. Se abrirá el editor dividido en dos paneles

### Paso 2: Información del Post

#### Campos Obligatorios (marcados con *)

**Título**
- El título principal de tu artículo
- Aparecerá en grande en la página del post
- Ejemplo: "Técnicas de Tracción Equina en Bosques"

**URL (Slug)**
- Se genera automáticamente del título
- Solo minúsculas, números y guiones
- Ejemplo: `tecnicas-traccion-equina-bosques`
- Puedes editarlo manualmente si quieres

**Extracto / Resumen**
- Breve descripción (2-3 frases)
- Aparece en el listado del blog
- También se usa para SEO (buscadores)
- Ejemplo: "Descubre cómo la tracción equina permite realizar trabajos forestales minimizando el impacto ambiental."

**Categoría**
- **Silvicultura (B2B)**: Posts técnicos sobre gestión forestal
- **Desarrollo Personal (B2C)**: Coaching con caballos, crecimiento personal
- **Formación**: Cursos y formación profesional
- **Fundación**: Valores, historia, filosofía de Equitracción

**Autor**
- Nombre de quien escribe el artículo
- Por defecto: "Roberto Contaldo"

#### Campos Opcionales

**Etiquetas (Tags)**
- Palabras clave separadas por comas
- Ejemplo: `tracción equina, sostenibilidad, gestión forestal`
- Máximo recomendado: 5-6 tags

**Imagen de Portada**
- URL o ruta de la imagen principal
- Ejemplo: `/images/blog/mi-imagen.jpg`
- Si está vacío, se usa una imagen por defecto

**Tiempo de Lectura**
- Minutos estimados de lectura
- Se calcula automáticamente si lo dejas vacío
- Basado en 200 palabras por minuto

### Paso 3: Escribir el Contenido

El contenido se escribe en **Markdown**, un formato simple de texto.

#### Barra de Herramientas
- **B**: Texto en **negrita**
- **I**: Texto en *cursiva*
- **H2/H3**: Títulos y subtítulos
- **🔗**: Insertar enlaces
- **• Lista**: Crear listas
- **""**: Citas destacadas

#### Editor de Texto
- Escribe el contenido principal de tu post
- Usa Markdown para dar formato (ver sección Formato Markdown)
- La vista previa se actualiza mientras escribes

### Paso 4: Vista Previa
- Panel derecho muestra cómo se verá el post
- Se actualiza automáticamente mientras escribes
- Te permite revisar el formato antes de publicar

### Paso 5: Guardar o Publicar

**Guardar Borrador**
- El post se guarda pero **NO** se publica
- Solo tú puedes verlo en el panel de administración
- Útil para posts en progreso

**Publicar**
- El post se hace **público inmediatamente**
- Aparece en el blog del sitio web
- Se puede despublicar después si es necesario

---

## ✏️ Editar un Post Existente

1. Ve a "Gestionar Posts del Blog"
2. Encuentra el post que quieres editar
3. Haz clic en el icono del **lápiz** (✏️)
4. Se abrirá el editor con todos los datos cargados
5. Modifica lo que necesites
6. Haz clic en "Guardar Cambios" o "Publicar"

> 💡 **Tip**: Los cambios se aplican inmediatamente al guardar

---

## 📝 Formato Markdown

Markdown es un formato simple para escribir texto con estilo. Aquí tienes lo esencial:

### Títulos
```markdown
# Título Principal (H1)
## Subtítulo (H2)
### Sección (H3)
```

### Texto con Estilo
```markdown
**Texto en negrita**
*Texto en cursiva*
***Texto en negrita y cursiva***
```

### Enlaces
```markdown
[Texto del enlace](https://ejemplo.com)
[Ir a servicios](/servicios-forestales)
```

### Listas

**Lista sin orden:**
```markdown
- Primer item
- Segundo item
- Tercer item
```

**Lista ordenada:**
```markdown
1. Primer paso
2. Segundo paso
3. Tercer paso
```

### Citas Destacadas
```markdown
> Esto es una cita importante.
> Se usa para destacar frases relevantes.
```

### Línea Horizontal
```markdown
---
```

### Imágenes
```markdown
![Descripción de la imagen](https://ejemplo.com/imagen.jpg)
```

### Ejemplo Completo
```markdown
# Gestión Forestal Sostenible

La tracción equina es una **técnica de vanguardia** para la silvicultura del siglo XXI.

## Ventajas Principales

- Bajo impacto ambiental
- Acceso a terrenos difíciles
- Certificación FSC mantenida

### Datos Clave

> "La diferencia entre zonas trabajadas con caballos vs maquinaria es evidente años después."

Para más información, visita nuestra [página de servicios](/servicios-forestales).

---

*¿Quieres aprender estas técnicas? [Consulta nuestros cursos](/formacion).*
```

---

## 🖼️ Gestión de Imágenes

### Subir Imágenes al Servidor

**Opción 1: Vía FTP/SFTP**
1. Usa un cliente FTP (FileZilla, Cyberduck)
2. Conecta al servidor
3. Sube las imágenes a `/public/images/blog/`
4. Usa la ruta: `/images/blog/nombre-imagen.jpg`

**Opción 2: Contactar al Desarrollador**
- Envía las imágenes por email
- Te proporcionará las URLs para usar

### Formatos Recomendados
- **Formato**: JPG o WebP
- **Tamaño**: Mínimo 1200px de ancho
- **Peso**: Máximo 500KB (optimiza antes de subir)
- **Nombres**: Descriptivos, sin espacios: `traccion-equina-bosque.jpg`

### Herramientas para Optimizar Imágenes
- **TinyPNG**: https://tinypng.com (online, gratuito)
- **Squoosh**: https://squoosh.app (Google, gratuito)

### Usar Imágenes en Posts

**Imagen de Portada**
```
/images/blog/mi-imagen.jpg
```

**Imágenes en el Contenido (Markdown)**
```markdown
![Descripción alt](https://images/blog/mi-imagen.jpg)
```

---

## 🚀 Publicar y Despublicar

### Publicar un Borrador
1. Ve a "Gestionar Posts"
2. Encuentra el post con estado "Borrador" (amarillo)
3. **Opción A**: Haz clic en el badge "Borrador" → cambia a "Publicado"
4. **Opción B**: Edita el post y haz clic en "Publicar"

### Despublicar un Post
1. Ve a "Gestionar Posts"
2. Encuentra el post con estado "Publicado" (verde)
3. Haz clic en el badge "Publicado" → cambia a "Borrador"
4. El post desaparece del sitio web pero se guarda en el CMS

### Programar Publicación
Actualmente no hay programación automática. Para simularla:
1. Guarda como borrador
2. Publica manualmente cuando llegue la fecha deseada

---

## ❓ Preguntas Frecuentes

### ¿Cómo recupero mi contraseña?
Contacta al desarrollador para resetearla.

### ¿Puedo tener múltiples usuarios?
La versión actual soporta un solo usuario admin. Contacta al desarrollador para añadir más usuarios.

### ¿Los cambios son inmediatos?
Sí, los posts publicados aparecen inmediatamente en el sitio web.

### ¿Puedo ver el post antes de publicarlo?
Sí, usa el panel de "Vista Previa" mientras editas. O guarda como borrador y accede directamente via URL.

### ¿Cómo cambio el orden de los posts?
Los posts se ordenan automáticamente por fecha de publicación (más recientes primero).

### ¿Puedo programar posts para el futuro?
No automáticamente. Guarda como borrador y publícalo manualmente cuando desees.

### ¿Los posts eliminados se pueden recuperar?
No, la eliminación es permanente. Asegúrate antes de confirmar.

### ¿Cómo hago una copia de seguridad?
Contacta al desarrollador para backups de la base de datos.

### ¿Puedo editar otras páginas del sitio?
La versión actual solo permite editar posts del blog. Para cambios en otras páginas, contacta al desarrollador.

### ¿Funciona en móvil/tablet?
Sí, el CMS es responsive y funciona en todos los dispositivos, aunque se recomienda usar ordenador para mejor experiencia.

### El editor no carga / tengo problemas técnicos
1. Recarga la página (Cmd/Ctrl + Shift + R)
2. Cierra sesión y vuelve a entrar
3. Intenta con otro navegador (Chrome recomendado)
4. Si persiste, contacta al desarrollador

---

## 💡 Consejos y Mejores Prácticas

### Para Escribir Buenos Posts

1. **Título Claro y Específico**
   - ✅ "Técnicas de arrastre forestal en pendientes superiores al 40%"
   - ❌ "Cosas sobre caballos"

2. **Extracto Atractivo**
   - Resume el contenido en 2-3 frases
   - Responde: ¿De qué trata? ¿Por qué leerlo?

3. **Estructura Clara**
   - Usa subtítulos (H2, H3)
   - Párrafos cortos (3-4 líneas)
   - Listas para información escaneable

4. **Longitud Ideal**
   - Posts técnicos (B2B): 800-1500 palabras
   - Posts reflexivos (B2C): 600-1000 palabras

5. **SEO Básico**
   - Usa palabras clave naturalmente
   - Enlaces internos a otras páginas
   - Tags relevantes (3-6 por post)

### Flujo de Trabajo Recomendado

1. **Borrador**: Escribe todo el contenido
2. **Revisión**: Lee, corrige ortografía
3. **Imágenes**: Añade imagen de portada
4. **Preview**: Revisa cómo se ve
5. **Publicación**: Publica cuando esté listo

---

## 📞 Soporte Técnico

Si tienes problemas, dudas o necesitas cambios:

1. Revisa esta guía primero
2. Consulta la [Guía de Markdown](https://www.markdownguide.org/cheat-sheet/)
3. Contacta al desarrollador

---

**Última actualización**: Noviembre 2025
**Versión del CMS**: 1.0
**Desarrollado para**: Equitracción

---

## 🎉 ¡Listo para Empezar!

Ya tienes todo lo necesario para gestionar el contenido de tu blog. Recuerda:

- El CMS es intuitivo y fácil de usar
- La vista previa te ayuda a ver cómo quedará
- Puedes guardar borradores sin publicar
- Los cambios son inmediatos

**¡Disfruta creando contenido para Equitracción!** 🐴✨
