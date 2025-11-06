# Configuración del Sistema de Newsletter Automático

Este documento explica cómo configurar y usar el sistema de newsletter mensual de Equitracción.

## 📋 Características

El sistema de newsletter automático:

- ✅ Se envía automáticamente el día 1 de cada mes
- ✅ Incluye resumen de artículos publicados el mes anterior
- ✅ Muestra próximos cursos programados (próximos 3 meses)
- ✅ Template HTML responsive y elegante
- ✅ Gestión de suscriptores desde la base de datos
- ✅ Preview del newsletter antes de enviar

## 🏗️ Arquitectura

```
src/lib/email/
  └── newsletter-template.ts    # Template HTML del newsletter

src/pages/api/newsletter/
  ├── subscribe.ts               # Suscripción de usuarios
  └── send.ts                    # Envío mensual automático
```

## 🔧 Configuración

### 1. Variables de Entorno

Añade a tu archivo `.env`:

```env
# Token para proteger el endpoint de envío
NEWSLETTER_CRON_TOKEN=tu_token_secreto_aqui

# Configuración de email (ejemplo con SendGrid)
SENDGRID_API_KEY=tu_api_key_de_sendgrid
SENDGRID_FROM_EMAIL=newsletter@equitraccion.com
SENDGRID_FROM_NAME=Equitracción
```

**Generar token seguro:**
```bash
openssl rand -base64 32
```

### 2. Servicio de Email

El sistema requiere un servicio de envío de emails. Opciones recomendadas:

#### Opción A: SendGrid (Recomendado)

1. **Crear cuenta en SendGrid:**
   - Ve a [sendgrid.com](https://sendgrid.com)
   - Plan gratuito: 100 emails/día

2. **Instalar dependencia:**
   ```bash
   npm install @sendgrid/mail
   ```

3. **Implementar en `/api/newsletter/send.ts`:**
   
   Descomentar y usar el código de ejemplo:
   ```typescript
   import sgMail from '@sendgrid/mail';
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   const emailPromises = subscribers.map(subscriber => {
     const personalizedHTML = newsletterHTML.replace('{{email}}', subscriber.email);
     
     return sgMail.send({
       to: subscriber.email,
       from: {
         email: process.env.SENDGRID_FROM_EMAIL,
         name: process.env.SENDGRID_FROM_NAME
       },
       subject: `Newsletter Equitracción - ${monthName} ${year}`,
       html: personalizedHTML
     });
   });

   await Promise.all(emailPromises);
   ```

#### Opción B: Resend (Alternativa moderna)

1. **Crear cuenta en Resend:**
   - Ve a [resend.com](https://resend.com)
   - Plan gratuito: 100 emails/día

2. **Instalar dependencia:**
   ```bash
   npm install resend
   ```

3. **Implementar:**
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);

   await resend.emails.send({
     from: 'Newsletter <newsletter@equitraccion.com>',
     to: subscriber.email,
     subject: `Newsletter Equitracción - ${monthName} ${year}`,
     html: personalizedHTML
   });
   ```

#### Opción C: Mailgun

1. **Crear cuenta en Mailgun:**
   - Ve a [mailgun.com](https://mailgun.com)

2. **Instalar dependencia:**
   ```bash
   npm install mailgun.js form-data
   ```

3. **Implementar según documentación de Mailgun**

## 🤖 Configuración de Envío Automático

### Opción 1: Vercel Cron Jobs (Recomendado para Vercel)

1. **Crear archivo `vercel.json` en la raíz:**

```json
{
  "crons": [
    {
      "path": "/api/newsletter/send",
      "schedule": "0 8 1 * *"
    }
  ]
}
```

**Explicación del schedule:**
- `0` = minuto 0
- `8` = hora 8 AM (UTC)
- `1` = día 1 del mes
- `*` = todos los meses
- `*` = todos los días de la semana

**Nota:** Vercel usa UTC. Ajusta según tu zona horaria.

2. **Configurar headers en Vercel:**

En el dashboard de Vercel:
- Settings → Environment Variables
- Añadir: `NEWSLETTER_CRON_TOKEN`

3. **Proteger endpoint:**

Vercel añadirá automáticamente el header de autorización.

### Opción 2: Netlify Scheduled Functions

1. **Crear `netlify.toml`:**

```toml
[functions]
  directory = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-functions-schedule"
```

2. **Crear función programada:**

```javascript
// netlify/functions/send-newsletter.js
const schedule = '0 8 1 * *'; // 1 de cada mes a las 8 AM

exports.handler = async (event, context) => {
  const response = await fetch('https://equitraccion.com/api/newsletter/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEWSLETTER_CRON_TOKEN}`
    }
  });
  
  return {
    statusCode: response.status,
    body: await response.text()
  };
};
```

### Opción 3: Cron Job Manual (VPS)

Si estás en un servidor propio, usa crontab:

1. **Editar crontab:**
   ```bash
   crontab -e
   ```

2. **Añadir línea:**
   ```
   0 8 1 * * curl -X POST -H "Authorization: Bearer tu_token" https://equitraccion.com/api/newsletter/send
   ```

### Opción 4: GitHub Actions

1. **Crear `.github/workflows/newsletter.yml`:**

```yaml
name: Send Monthly Newsletter

on:
  schedule:
    - cron: '0 8 1 * *'  # 1 de cada mes a las 8 AM UTC
  workflow_dispatch:  # Permite ejecución manual

jobs:
  send-newsletter:
    runs-on: ubuntu-latest
    steps:
      - name: Send Newsletter
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.NEWSLETTER_CRON_TOKEN }}" \
            https://equitraccion.com/api/newsletter/send
```

## 🧪 Testing

### Preview del Newsletter

Visualiza cómo se verá el newsletter:

```
https://equitraccion.com/api/newsletter/send?preview=true
```

Esto genera un HTML con los datos reales actuales sin enviar emails.

### Envío Manual de Test

Para probar el envío (requiere token):

```bash
curl -X POST \
  -H "Authorization: Bearer tu_token_aqui" \
  https://equitraccion.com/api/newsletter/send
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Newsletter preparado para 150 suscriptores",
  "stats": {
    "subscribers": 150,
    "posts": 3,
    "courses": 2,
    "month": "noviembre",
    "year": "2025"
  }
}
```

## 📧 Contenido del Newsletter

El newsletter incluye automáticamente:

### 1. Artículos del Blog
- Posts publicados el mes anterior
- Título, extracto e imagen de portada
- Enlace directo al artículo

### 2. Próximos Cursos
- Cursos activos con convocatorias en los próximos 3 meses
- Fecha, ubicación, plazas disponibles y precio
- Nivel de experiencia
- Enlace al formulario de contacto

### 3. Personalización
- Saludo personalizado
- Link de cancelación de suscripción único por usuario

## 🔍 Monitorización

### Logs

Verifica los logs del envío:

**Vercel:**
```bash
vercel logs
```

**Netlify:**
Dashboard → Functions → Logs

**VPS:**
```bash
grep "newsletter" /var/log/app.log
```

### Métricas a Monitorizar

1. **Tasa de envío exitoso** - % de emails entregados
2. **Tasa de apertura** - Requiere tracking (SendGrid/Mailgun lo incluyen)
3. **Tasa de clicks** - Enlaces clickeados
4. **Bajas** - Usuarios que cancelan suscripción

## 🚨 Troubleshooting

### El newsletter no se envía

1. **Verificar cron job:**
   ```bash
   # Vercel
   vercel logs --since 24h | grep newsletter
   ```

2. **Verificar token:**
   - Asegúrate de que `NEWSLETTER_CRON_TOKEN` esté configurado
   - Verifica que el cron job use el token correcto

3. **Verificar API key de email:**
   - Comprueba que `SENDGRID_API_KEY` sea válida
   - Verifica límites de tu plan

### Los emails no llegan

1. **Verificar spam:**
   - Revisa carpeta de spam
   - Configura SPF/DKIM en tu dominio

2. **Verificar from email:**
   - Usa un dominio verificado
   - No uses direcciones @gmail.com, @yahoo.com, etc.

### Error 401 Unauthorized

- El token en el header no coincide con `NEWSLETTER_CRON_TOKEN`
- Regenera el token y actualiza en todas partes

## 📊 Estadísticas de Ejemplo

Un newsletter típico de Equitracción:

- **Suscriptores:** ~200-500
- **Posts incluidos:** 2-4 artículos/mes
- **Cursos mostrados:** 2-3 convocatorias
- **Tasa de apertura esperada:** 20-30%
- **Tasa de clicks esperada:** 5-10%

## 🔐 Seguridad

- ✅ Endpoint protegido con token de autorización
- ✅ Solo suscriptores activos reciben emails
- ✅ Link único de desuscripción por usuario
- ✅ No se exponen emails en logs
- ✅ Rate limiting en el endpoint de suscripción

## 📝 Personalización

### Cambiar frecuencia de envío

Modifica el cron schedule:

- **Quincenal:** `0 8 1,15 * *`
- **Semanal:** `0 8 * * 1` (cada lunes)
- **Trimestral:** `0 8 1 1,4,7,10 *`

### Modificar template

Edita `src/lib/email/newsletter-template.ts`:

- Cambia colores
- Añade secciones
- Modifica textos
- Añade imágenes

### Añadir más contenido

En `/api/newsletter/send.ts`, puedes añadir:

- Eventos especiales
- Testimonios de clientes
- Recursos descargables
- Ofertas especiales

---

**Última actualización:** 2025-01-06
