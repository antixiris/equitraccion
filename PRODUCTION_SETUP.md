# Guía de Configuración para Producción

Esta guía detalla todos los pasos necesarios para preparar y desplegar el sitio web de Equitracción en un entorno de producción.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Variables de Entorno](#variables-de-entorno)
3. [Seguridad](#seguridad)
4. [Base de Datos Supabase](#base-de-datos-supabase)
5. [Build de Producción](#build-de-producción)
6. [Despliegue](#despliegue)
7. [Verificación Post-Despliegue](#verificación-post-despliegue)

---

## 🔧 Requisitos Previos

- Node.js 18+ instalado
- Cuenta en Supabase con proyecto configurado
- Servidor web con soporte para Node.js (Vercel, Netlify, VPS, etc.)
- Dominio configurado: equitraccion.com
- Certificado SSL/TLS activo

---

## 🔐 Variables de Entorno

### 1. Crear archivo `.env` en producción

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

### 2. Configurar cada variable

#### **Supabase Configuration**

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase
```

**Cómo obtener las credenciales de Supabase:**
1. Accede a [supabase.com](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia la URL y las claves necesarias

#### **JWT Secret**

```env
JWT_SECRET=tu_secreto_jwt_de_minimo_32_caracteres
```

**Generar JWT Secret seguro:**
```bash
openssl rand -base64 32
```

#### **Admin Credentials**

```env
ADMIN_EMAIL=admin@equitraccion.com
ADMIN_PASSWORD=tu_contraseña_segura_hasheada
```

**Generar contraseña hasheada con bcrypt:**

1. Instala bcryptjs globalmente (opcional):
```bash
npm install -g bcrypt-cli
```

2. Genera el hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('tu_contraseña_segura', 10))"
```

3. Usa el resultado en `.env`:
```env
ADMIN_PASSWORD=$2b$10$XxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
```

**⚠️ IMPORTANTE:** Nunca uses contraseñas en texto plano en producción.

#### **Site Configuration**

```env
SITE_URL=https://equitraccion.com
NODE_ENV=production
```

#### **Session Secret**

```env
SESSION_SECRET=tu_secreto_de_sesion_de_minimo_32_caracteres
```

**Generar Session Secret:**
```bash
openssl rand -base64 32
```

#### **Security - Rate Limiting**

```env
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

- `RATE_LIMIT_MAX`: Número máximo de peticiones permitidas
- `RATE_LIMIT_WINDOW`: Ventana de tiempo en milisegundos (900000 = 15 minutos)

#### **Google Analytics (Opcional)**

```env
GA_TRACKING_ID=G-XXXXXXXXXX
```

**Cómo obtener el ID:**
1. Accede a [Google Analytics](https://analytics.google.com)
2. Crea una propiedad para equitraccion.com
3. Copia el ID de medición (formato: G-XXXXXXXXXX)

---

## 🔒 Seguridad

### Checklist de Seguridad Pre-Producción

- [ ] JWT_SECRET generado con 32+ caracteres aleatorios
- [ ] SESSION_SECRET generado con 32+ caracteres aleatorios
- [ ] Contraseña de admin hasheada con bcrypt
- [ ] Variables de entorno NO están en el código fuente
- [ ] Archivo `.env` añadido al `.gitignore`
- [ ] HTTPS configurado con certificado válido
- [ ] Headers de seguridad configurados (ver middleware)
- [ ] Rate limiting activado
- [ ] Cookies con flags httpOnly, secure, sameSite
- [ ] CSP (Content Security Policy) configurada

### Headers de Seguridad Implementados

El middleware ya incluye los siguientes headers de seguridad:

```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: [configurado para Google Fonts y Analytics]
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Rate Limiting Configurado

- **Login:** 5 intentos / 15 minutos
- **API General:** 100 peticiones / 15 minutos (configurable)
- **Formulario de Contacto:** 3 mensajes / 1 hora

---

## 📊 Base de Datos Supabase

### Tablas Requeridas

Asegúrate de que las siguientes tablas estén creadas en Supabase:

1. **blog_posts** - Artículos del blog
2. **contact_messages** - Mensajes del formulario de contacto
3. **newsletter_subscribers** - Suscriptores al newsletter

Consulta `SUPABASE_SETUP.md` para los detalles de cada tabla.

### Row Level Security (RLS)

Verifica que las políticas RLS estén activas:

```sql
-- Ejemplo para blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Public read access" ON blog_posts
  FOR SELECT USING (published = true);

-- Política de escritura solo para admin
CREATE POLICY "Admin write access" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');
```

---

## 🏗️ Build de Producción

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar build

```bash
npm run build
```

Este comando:
- Compila TypeScript
- Optimiza assets (imágenes, CSS, JS)
- Genera páginas estáticas donde sea posible
- Crea el directorio `dist/` con los archivos de producción

### 3. Verificar build localmente

```bash
npm run preview
```

Accede a `http://localhost:4321` para verificar que todo funcione correctamente.

---

## 🚀 Despliegue

### Opción A: Vercel (Recomendado)

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Configurar proyecto:**
```bash
vercel
```

4. **Configurar variables de entorno en Vercel:**
   - Ve al dashboard de Vercel
   - Settings → Environment Variables
   - Añade todas las variables del `.env`

5. **Desplegar:**
```bash
vercel --prod
```

### Opción B: Netlify

1. **Instalar Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Crear netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

4. **Configurar variables de entorno:**
```bash
netlify env:set SUPABASE_URL "valor"
netlify env:set SUPABASE_ANON_KEY "valor"
# ... repetir para todas las variables
```

5. **Desplegar:**
```bash
netlify deploy --prod
```

### Opción C: VPS (Ubuntu/Debian)

1. **Conectar al servidor:**
```bash
ssh usuario@servidor.com
```

2. **Instalar Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Instalar PM2:**
```bash
sudo npm install -g pm2
```

4. **Clonar repositorio:**
```bash
git clone https://github.com/tu-usuario/equitraccion.git
cd equitraccion/website
```

5. **Configurar variables de entorno:**
```bash
nano .env
# Pegar todas las variables
```

6. **Instalar dependencias y build:**
```bash
npm install
npm run build
```

7. **Iniciar con PM2:**
```bash
pm2 start npm --name "equitraccion" -- start
pm2 save
pm2 startup
```

8. **Configurar Nginx:**
```nginx
server {
    listen 80;
    server_name equitraccion.com www.equitraccion.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name equitraccion.com www.equitraccion.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

9. **Reiniciar Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Verificación Post-Despliegue

### 1. Funcionalidad Básica

- [ ] Sitio carga correctamente en https://equitraccion.com
- [ ] Todas las páginas son accesibles
- [ ] Imágenes se cargan correctamente
- [ ] Formularios funcionan

### 2. Seguridad

- [ ] HTTPS forzado (HTTP redirige a HTTPS)
- [ ] Headers de seguridad presentes (usar https://securityheaders.com)
- [ ] Cookies con flags correctos
- [ ] Admin login protegido
- [ ] Rate limiting funcional

### 3. Autenticación Admin

- [ ] Login admin accesible en `/admin/login`
- [ ] Credenciales funcionan correctamente
- [ ] Rutas admin protegidas
- [ ] Logout funciona
- [ ] Redirección correcta tras login/logout

### 4. Backend

- [ ] Conexión con Supabase funcional
- [ ] Formulario de contacto envía mensajes
- [ ] Newsletter registra suscriptores
- [ ] Blog posts se muestran correctamente

### 5. SEO y Rendimiento

- [ ] Sitemap accesible en `/sitemap.xml`
- [ ] robots.txt configurado
- [ ] Meta tags presentes
- [ ] Schema.org markup implementado
- [ ] Google Analytics funcionando (si está configurado)

### 6. Pruebas de Seguridad

```bash
# Verificar headers de seguridad
curl -I https://equitraccion.com

# Probar rate limiting
for i in {1..10}; do curl -X POST https://equitraccion.com/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'; done

# Verificar SSL
openssl s_client -connect equitraccion.com:443 -servername equitraccion.com
```

---

## 🔍 Monitorización

### Logs

**Vercel/Netlify:**
- Acceder al dashboard y revisar la sección de Logs

**VPS con PM2:**
```bash
pm2 logs equitraccion
pm2 monit
```

### Alertas

Configurar alertas para:
- Errores 500
- Intentos de login fallidos
- Rate limit excedido
- Certificado SSL próximo a vencer

---

## 🆘 Troubleshooting

### Error: "Admin credentials not configured"

**Solución:** Verificar que `ADMIN_EMAIL` y `ADMIN_PASSWORD` estén en las variables de entorno.

### Error: "JWT verification failed"

**Solución:** Verificar que `JWT_SECRET` sea el mismo en todas las instancias.

### Error: "Supabase connection failed"

**Solución:** 
1. Verificar credenciales de Supabase
2. Verificar que el proyecto de Supabase esté activo
3. Revisar políticas RLS

### Headers de seguridad no aparecen

**Solución:** Verificar que el middleware esté correctamente configurado en `src/middleware.ts`

---

## 📞 Soporte

Para problemas técnicos o dudas:
- **Email:** info@equitraccion.com
- **Teléfono:** +34 681 298 028

---

## 📝 Notas Adicionales

### Actualizaciones Futuras

Para actualizar el sitio en producción:

1. **Hacer cambios en desarrollo**
2. **Probar localmente:**
   ```bash
   npm run build
   npm run preview
   ```
3. **Commit y push:**
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```
4. **Desplegar:**
   - Vercel/Netlify: Automático tras push
   - VPS: SSH al servidor y ejecutar:
     ```bash
     git pull
     npm install
     npm run build
     pm2 restart equitraccion
     ```

### Backup

**Base de Datos:**
- Supabase realiza backups automáticos diarios
- Configurar backups adicionales desde Supabase Dashboard

**Código:**
- Repositorio Git es el backup principal
- Considerar mirror en GitLab/Bitbucket

---

**Última actualización:** 2025-01-06
