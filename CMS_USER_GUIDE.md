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
- Puedes subir directamente desde tu ordenador (recomendado)
- O usar una URL si la imagen ya está online
- Si no subes ninguna, se usa una imagen por defecto

**Tiempo de Lectura**
- Minutos estimados de lectura
- Se calcula automáticamente si lo dejas vacío
- Basado en 200 palabras por minuto

### Paso 3: Escribir el Contenido

El contenido se escribe en un **editor visual** tipo Word o Google Docs. No necesitas conocer código ni Markdown.

#### Barra de Herramientas Visual

La barra superior del editor tiene botones para formatear el texto:

**Títulos**
- **T** (grande): Título Principal (H1)
- **T** (mediano): Subtítulo (H2)
- **T** (pequeño): Sección (H3)

**Formato de Texto**
- **N**: Texto en **negrita**
- **C**: Texto en *cursiva*

**Listas**
- **• Lista**: Crear lista con viñetas
- **1. Numerada**: Crear lista numerada

**Otros**
- **💬 Cita**: Insertar cita destacada
- **🔗 Enlace**: Insertar enlace a otra página
- **🖼️ Añadir Imagen**: Insertar imagen en el contenido

#### ¿Cómo Usar el Editor?

1. **Escribe normalmente** como en Word o Google Docs
2. **Selecciona el texto** que quieres formatear
3. **Haz click en el botón** correspondiente (negrita, cursiva, etc.)
4. **La vista previa** a la derecha te muestra cómo quedará

**Ejemplo:**
- Escribe: `La tracción equina es sostenible`
- Selecciona la palabra `sostenible`
- Haz click en **N** (negrita)
- El texto quedará: `La tracción equina es **sostenible**`

**No necesitas saber Markdown**. El editor convierte automáticamente tu texto formateado al formato correcto cuando guardas.

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

## 📝 Uso del Editor Visual

El editor funciona como Word o Google Docs. No necesitas conocer código.

### Crear Títulos y Subtítulos

1. Escribe el texto del título
2. Selecciona todo el texto
3. Haz click en **T** (grande, mediano o pequeño)

**Ejemplo:**
- Escribe: `Ventajas de la tracción equina`
- Selecciona todo el texto
- Haz click en **T** mediano
- Se convierte en un subtítulo H2

### Aplicar Negrita o Cursiva

1. Selecciona la palabra o frase
2. Haz click en **N** (negrita) o **C** (cursiva)

**Ejemplo:**
- Escribe: `Esto es muy importante`
- Selecciona `muy importante`
- Haz click en **N**
- Quedará: Esto es **muy importante**

### Crear Listas

**Lista con viñetas:**
1. Haz click en **• Lista**
2. Escribe el primer punto
3. Presiona Enter para añadir más puntos
4. Presiona Enter dos veces para terminar la lista

**Lista numerada:**
1. Haz click en **1. Numerada**
2. Escribe el primer paso
3. Presiona Enter para añadir más pasos

### Insertar un Enlace

1. Escribe el texto que será el enlace (ej: "nuestros servicios")
2. Selecciona el texto
3. Haz click en **🔗 Enlace**
4. Introduce la URL (ej: `/servicios-forestales`)
5. Presiona OK

### Añadir una Cita Destacada

1. Escribe el texto de la cita
2. Selecciona todo el texto
3. Haz click en **💬 Cita**

**Ejemplo de cita:**
> "La tracción equina transforma el bosque sin destruirlo"

### Insertar una Imagen

1. Coloca el cursor donde quieres la imagen
2. Haz click en **🖼️ Añadir Imagen**
3. Sube la imagen desde tu ordenador o pega una URL
4. Añade una descripción (opcional)
5. Haz click en "Insertar Imagen"

### Ejemplo de Post Completo

Así es como escribirías un post típico en el editor visual:

1. **Escribe el título**: `Gestión Forestal Sostenible`
2. **Selecciónalo y haz click en T grande**
3. **Escribe un párrafo**: La tracción equina es una técnica de vanguardia para la silvicultura del siglo XXI.
4. **Selecciona "técnica de vanguardia" y haz click en N** (negrita)
5. **Escribe un subtítulo**: `Ventajas Principales`
6. **Selecciónalo y haz click en T mediano**
7. **Haz click en • Lista** y escribe:
   - Bajo impacto ambiental
   - Acceso a terrenos difíciles
   - Certificación FSC mantenida
8. **Inserta una imagen** con el botón 🖼️
9. **Añade una cita** destacando una frase importante

¡Es así de fácil! No necesitas recordar ningún código.

---

## 🖼️ Gestión de Imágenes

### Subir Imagen de Portada

El CMS incluye un **cargador de imágenes visual** muy fácil de usar:

**Método 1: Hacer Click**
1. En la sección "Imagen de Portada", haz click en el área de carga
2. Selecciona la imagen desde tu ordenador
3. La imagen se subirá automáticamente
4. Verás una vista previa de la imagen

**Método 2: Arrastrar y Soltar**
1. Arrastra la imagen desde tu ordenador
2. Suéltala en el área de carga (cuadro con líneas punteadas)
3. La imagen se subirá automáticamente
4. Verás una vista previa instantánea

**Eliminar Imagen de Portada**
- Si quieres cambiar la imagen, haz click en "🗑️ Eliminar Imagen"
- Podrás subir una nueva

### Insertar Imágenes en el Contenido

Mientras escribes el contenido del post, puedes añadir imágenes:

1. Coloca el cursor donde quieres insertar la imagen
2. Haz click en el botón **"🖼️ Añadir Imagen"** de la barra de herramientas
3. Se abrirá una ventana con dos opciones:

**Opción A: Subir Imagen desde tu Ordenador**
- Haz click en "Subir Imagen"
- Selecciona la imagen
- Opcionalmente añade una descripción (texto alternativo)
- Haz click en "Insertar Imagen"

**Opción B: Usar una URL**
- Si la imagen ya está online, pega la URL
- Añade una descripción (texto alternativo)
- Haz click en "Insertar Imagen"

La imagen aparecerá automáticamente en el contenido y en la vista previa.

### Formatos y Límites

- **Formatos permitidos**: JPG, PNG, WebP, GIF
- **Tamaño máximo**: 5MB por imagen
- **Recomendación**: Imágenes entre 1200px y 1920px de ancho
- **Optimización**: Usa herramientas como [TinyPNG](https://tinypng.com) o [Squoosh](https://squoosh.app) para reducir el peso antes de subir

### Gestión Manual (Avanzado)

Si prefieres gestionar las imágenes manualmente:

**Vía FTP/SFTP**
1. Usa un cliente FTP (FileZilla, Cyberduck)
2. Conecta al servidor
3. Sube las imágenes a `/public/images/blog/`
4. Usa la ruta en el campo de URL: `/images/blog/nombre-imagen.jpg`

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
   - Usa subtítulos (botones **T** en el editor)
   - Párrafos cortos (3-4 líneas)
   - Listas con viñetas para información escaneable

4. **Contenido Visual**
   - Añade al menos 1 imagen de portada (obligatorio)
   - Inserta 2-3 imágenes en el contenido si es posible
   - Las imágenes hacen el post más atractivo

5. **Longitud Ideal**
   - Posts técnicos (B2B): 800-1500 palabras
   - Posts reflexivos (B2C): 600-1000 palabras

6. **SEO Básico**
   - Usa palabras clave naturalmente
   - Añade enlaces a otras páginas (botón 🔗)
   - Tags relevantes (3-6 por post)

### Flujo de Trabajo Recomendado

1. **Completar información básica**: Título, categoría, autor, extracto
2. **Subir imagen de portada**: Arrastra o selecciona la imagen principal
3. **Escribir contenido**: Usa el editor visual para escribir tu post
4. **Formatear**: Aplica negritas, subtítulos, listas con los botones
5. **Añadir imágenes**: Inserta 2-3 imágenes relevantes en el contenido
6. **Revisar preview**: Comprueba que todo se ve bien en el panel derecho
7. **Guardar borrador**: Si no está terminado, guarda como borrador
8. **Publicar**: Cuando esté listo, haz click en "Publicar"

### Atajos de Teclado del Editor

Mientras escribes en el editor visual, puedes usar:

- **Ctrl/Cmd + B**: Aplicar negrita al texto seleccionado
- **Ctrl/Cmd + I**: Aplicar cursiva al texto seleccionado
- **Enter**: Nueva línea
- **Shift + Enter**: Salto de línea sin crear nuevo párrafo
- **Backspace en lista vacía**: Salir de la lista

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
