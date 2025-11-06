# Solución: Imágenes de Portada no Cargan

## Problema Identificado

Dos posts no mostraban imágenes de portada debido a rutas incorrectas en la base de datos.

### Posts Afectados:
1. **"Técnicas avanzadas de saca forestal con caballos"**
   - Ruta incorrecta: `/images/Roberto-Contaldo-EquiTraccion-003.webp` ❌
   - Imagen NO existía en el servidor

2. **"Test El caballo como espejo emocional: autoconocimiento profundo"**
   - Ruta incorrecta: `/images/Roberto-Contaldo-EquiTraccion-001.webp` ❌
   - Imagen NO existía en el servidor

### Post que Funcionaba:
3. **"¿Por qué formarse en tracción animal? Oportunidades profesionales"**
   - Ruta correcta: `/images/Roberto-Contaldo-EquiTraccion-005.webp` ✅
   - Imagen SÍ existía en el servidor

## Causa del Problema

Mismatch entre los nombres de archivo en la base de datos y los archivos reales en el servidor:

**Base de datos apuntaba a:**
- `Roberto-Contaldo-EquiTraccion-003.webp` (mayúsculas, con guiones)
- `Roberto-Contaldo-EquiTraccion-001.webp` (mayúsculas, con guiones)

**Archivos reales en el servidor:**
- `roberto-contaldo-equitraccion-n003.webp` (minúsculas, con 'n')
- `roberto-contaldo-equitraccion-n001.webp` (minúsculas, con 'n')

## Solución Aplicada

### Actualización de Rutas en Base de Datos

Se actualizaron las rutas en Supabase para apuntar a las imágenes que realmente existen:

```javascript
// Post: Técnicas avanzadas
UPDATE blog_posts
SET cover_image = '/images/roberto-contaldo-equitraccion-n003.webp'
WHERE id = '8a8608e3-fd7d-4985-a29d-ba0f553e0041'

// Post: El caballo como espejo
UPDATE blog_posts
SET cover_image = '/images/roberto-contaldo-equitraccion-n001.webp'
WHERE id = '7687e513-e5f6-437f-8553-31c8c69cecbb'
```

### Estado Final

Todos los posts ahora tienen rutas correctas:

1. ✅ **Técnicas avanzadas** → `/images/roberto-contaldo-equitraccion-n003.webp`
2. ✅ **Oportunidades profesionales** → `/images/Roberto-Contaldo-EquiTraccion-005.webp`
3. ✅ **El caballo como espejo** → `/images/roberto-contaldo-equitraccion-n001.webp`

## Imágenes Disponibles en el Servidor

```
public/images/
├── Roberto-Contaldo-EquiTraccion-004.webp (148K)
├── Roberto-Contaldo-EquiTraccion-005.webp (97K)  ← Usado en post 2
├── Roberto-Contaldo-EquiTraccion-008.webp (257K)
├── roberto-contaldo-equitraccion-n001.webp (142K) ← Usado en post 3
├── roberto-contaldo-equitraccion-n002.webp (194K)
├── roberto-contaldo-equitraccion-n003.webp (201K) ← Usado en post 1
└── roberto-contaldo-equitraccion-n004.webp (202K)
```

## Sobre el Problema de Subir Nuevas Imágenes

Si al intentar subir una nueva imagen en el editor no se carga, verifica:

### 1. Consola del Navegador
Abre las herramientas de desarrollo (F12) y revisa si hay errores en la consola cuando intentas subir.

### 2. Endpoint de Upload
El endpoint `/api/upload-image` debería:
- Aceptar archivos hasta 5MB
- Formatos: JPG, PNG, WebP, GIF
- Guardar en `/public/images/blog/`

### 3. Permisos de Escritura
Verifica que el directorio tenga permisos de escritura:
```bash
ls -ld public/images/blog/
chmod 755 public/images/blog/
```

### 4. Testing Manual del Upload
Puedes probar el endpoint con curl:
```bash
curl -X POST http://localhost:4321/api/upload-image \
  -F "image=@/ruta/a/tu/imagen.jpg"
```

## Recomendaciones

### Para Evitar Problemas Futuros

1. **Nombres de archivo consistentes**
   - Usar solo minúsculas
   - Evitar caracteres especiales
   - Formato: `descripcion-del-archivo-001.webp`

2. **Validación en el uploader**
   - Normalizar nombres de archivo automáticamente
   - Convertir a minúsculas
   - Reemplazar espacios y caracteres especiales

3. **Imágenes de respaldo**
   - Definir una imagen por defecto si falta la portada
   - Mostrar placeholder en lugar de romper el layout

4. **Logs del servidor**
   - Añadir logs en el endpoint de upload
   - Facilita debugging de problemas

## Verificación

Para verificar que todo funciona:

1. Accede al blog público: `/blog`
2. Verifica que los 3 posts muestren sus imágenes de portada
3. Accede al admin: `/admin/posts`
4. Edita cualquier post
5. Intenta cambiar la imagen de portada
6. Guarda y verifica que se actualiza correctamente

---

**Fecha de solución**: 2025-11-06
**Estado**: ✅ Resuelto
