-- Script para insertar posts de prueba en Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Post 1: Forestales
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
  published_at,
  reading_time
) VALUES (
  'Técnicas avanzadas de saca forestal con caballos',
  'tecnicas-avanzadas-saca-forestal-caballos',
  'Descubre cómo la tracción equina permite realizar trabajos forestales en terrenos difíciles minimizando el impacto ambiental.',
  '# Técnicas avanzadas de saca forestal con caballos

La saca forestal con caballos es una técnica milenaria que está recuperando relevancia en el contexto de la gestión forestal sostenible. En Equitracción, hemos perfeccionado estas técnicas para ofrecer servicios de alta calidad que respetan el ecosistema.

## Ventajas de la tracción equina

- **Bajo impacto ambiental**: Compactación mínima del suelo (8% vs 45% de maquinaria pesada)
- **Acceso a terrenos difíciles**: Pendientes pronunciadas y zonas húmedas
- **Selectividad**: Extracción precisa sin dañar árboles remanentes
- **Silencio operacional**: Mínima perturbación de fauna

## Técnicas específicas

### 1. Arrastre directo
Ideal para troncos de hasta 800kg en distancias cortas. El caballo arrastra el tronco directamente enganchado.

### 2. Arrastre con trineo
Para maderas más pesadas o terrenos irregulares. El trineo distribuye el peso y protege el suelo.

### 3. Trabajo en equipo
Dos o más caballos trabajando coordinadamente para cargas superiores a 1200kg.

## Caso real: Proyecto en La Vera

En 2024 trabajamos 180 hectáreas en robledales de Talaveruela de la Vera con resultados excepcionales:
- Cero daños a regeneración natural
- Productividad de 15m³/día
- Certificación FSC mantenida

La tracción equina no es una vuelta al pasado, sino una técnica de vanguardia para la silvicultura del siglo XXI.',
  '/images/Roberto-Contaldo-EquiTraccion-003.webp',
  'Roberto Contaldo',
  'forestales',
  ARRAY['tracción equina', 'gestión forestal', 'sostenibilidad', 'técnicas forestales'],
  true,
  NOW(),
  8
);

-- Post 2: Desarrollo Personal
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
  published_at,
  reading_time
) VALUES (
  'El caballo como espejo emocional: autoconocimiento profundo',
  'caballo-espejo-emocional-autoconocimiento',
  'Los caballos perciben nuestro estado emocional con una precisión asombrosa. Aprende cómo esta capacidad puede transformar tu desarrollo personal.',
  '# El caballo como espejo emocional

Los caballos poseen una capacidad extraordinaria para percibir y reflejar el estado emocional de las personas que interactúan con ellos. Esta característica los convierte en maestros excepcionales del autoconocimiento.

## La neurobiología del vínculo

Los caballos son animales de presa con sistemas nerviosos altamente desarrollados para detectar:
- Variaciones en el ritmo cardíaco humano
- Cambios en la tensión muscular
- Alteraciones químicas (feromonas del estrés)
- Incongruencias entre lenguaje verbal y corporal

## Cómo funciona el proceso

### Fase 1: Observación
El participante simplemente está presente cerca del caballo, sin agenda. El caballo responde a lo que **es**, no a lo que la persona **dice** o **intenta proyectar**.

### Fase 2: Interacción
Propuestas simples: caminar juntos, detenerse, cambiar de dirección. El caballo colabora o no según la claridad y coherencia del participante.

### Fase 3: Reflexión
Con acompañamiento profesional, la persona identifica patrones:
- ¿Cuándo el caballo me siguió? ¿Qué estaba sintiendo?
- ¿Cuándo se alejó? ¿Qué estaba pensando?
- ¿Qué dice esto sobre cómo me relaciono con otros?

## Testimonios

*"El caballo no respondió hasta que dejé de fingir seguridad y acepté mi miedo. Ese momento cambió mi forma de liderar."* — Directora de RRHH, 42 años

*"Durante años creí que proyectaba calma. Los caballos me mostraron que transmitía ansiedad. Fue revelador y sanador."* — Terapeuta, 38 años

## Beneficios terapéuticos

- Reducción de estrés y ansiedad
- Mayor conciencia emocional
- Mejora en comunicación interpersonal
- Desarrollo de liderazgo auténtico
- Reconexión con la intuición

El trabajo con caballos no es terapia convencional. Es un encuentro con la verdad que estos seres nobles nos ofrecen sin juicio, solo con presencia.',
  '/images/Roberto-Contaldo-EquiTraccion-001.webp',
  'Roberto Contaldo',
  'desarrollo',
  ARRAY['desarrollo personal', 'coaching con caballos', 'inteligencia emocional', 'autoconocimiento'],
  true,
  NOW() - INTERVAL '7 days',
  6
);

-- Post 3: Formación
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
  published_at,
  reading_time
) VALUES (
  '¿Por qué formarse en tracción animal? Oportunidades profesionales',
  'formacion-traccion-animal-oportunidades',
  'La tracción animal es una profesión en auge con alta demanda y pocas personas cualificadas. Descubre las oportunidades que ofrece.',
  '# ¿Por qué formarse en tracción animal?

La tracción animal forestal es una de las pocas profesiones donde la demanda supera ampliamente la oferta de profesionales cualificados. En los últimos 5 años, hemos rechazado más proyectos por falta de personal que por cualquier otra razón.

## Contexto del sector

### Demanda creciente
- Certificaciones forestales (FSC, PEFC) valoran métodos de bajo impacto
- Administraciones públicas priorizan licitaciones sostenibles
- Propietarios privados buscan alternativas a maquinaria pesada
- Red Natura 2000 exige técnicas de mínimo impacto

### Escasez de profesionales
En toda España hay menos de 30 profesionales activos en tracción equina forestal. La edad media supera los 50 años. **Se necesita urgentemente una nueva generación.**

## Salidas profesionales

### 1. Trabajo autónomo
Profesionales con equipo propio facturan entre 35.000€ y 60.000€ anuales trabajando 6-8 meses/año (temporada forestal).

### 2. Cooperativas forestales
Varias cooperativas buscan activamente incorporar servicios de tracción animal. Salario medio: 28.000€-35.000€/año.

### 3. Gestión de fincas privadas
Grandes propietarios forestales contratan gestores especializados. Salario + vivienda + caballos.

### 4. Formación y consultoría
Una vez consolidada la experiencia, formar a otros o asesorar proyectos. Tarifas: 400€-800€/día.

### 5. Turismo experiencial
Combinar trabajo forestal con experiencias turísticas. Cada vez más demandado.

## Qué aprenderás en nuestros cursos

- **Técnico**: Manejo de caballos de tiro, arneses, técnicas de arrastre
- **Forestal**: Planificación de sacas, seguridad, productividad
- **Empresarial**: Gestión de proyectos, relación con clientes, presupuestos
- **Animal**: Bienestar, alimentación, prevención lesiones

## Inversión inicial

- Caballo formado: 3.000€-8.000€
- Arneses y equipamiento: 2.000€-3.500€
- Remolque: 2.500€-6.000€
- Formación: 1.200€-2.800€

**Total: 8.700€-20.300€**

Amortizable en 1-2 temporadas. Comparado con una skidder (80.000€-150.000€), la barrera de entrada es mínima.

## Perfil ideal

No necesitas experiencia previa con caballos, pero sí:
- Condición física media-alta
- Gusto por trabajo al aire libre
- Capacidad de aprendizaje continuo
- Respeto profundo por los animales
- Visión empresarial básica

## Próximos pasos

Si te interesa esta profesión:
1. Realiza el **Curso de Iniciación** (3 días) para confirmar tu interés
2. Si te convence, continúa con **Curso Avanzado** (5 días)
3. Realiza prácticas con profesionales (recomendamos 2-3 meses)
4. Adquiere tu propio equipo y comienza

La tracción animal no es nostalgia. Es una profesión de futuro para quienes buscan trabajo significativo, independencia y conexión con la naturaleza.',
  '/images/Roberto-Contaldo-EquiTraccion-005.webp',
  'Roberto Contaldo',
  'formacion',
  ARRAY['formación profesional', 'tracción animal', 'oportunidades laborales', 'silvicultura'],
  true,
  NOW() - INTERVAL '14 days',
  7
);

-- Post 4: Fundación (borrador, no publicado)
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
  published_at,
  reading_time
) VALUES (
  'Los orígenes de Equitracción: de la Amazonía a Extremadura',
  'origenes-equitraccion-amazonia-extremadura',
  'La historia de cómo Roberto Contaldo fundó Equitracción tras años trabajando con comunidades indígenas en la selva amazónica.',
  '# Los orígenes de Equitracción

**[BORRADOR - NO PUBLICADO]**

Esta es la historia de cómo una experiencia transformadora en la Amazonía llevó a la fundación de Equitracción en el corazón de Extremadura.

## Amazonía, 2005-2010

Roberto Contaldo pasó cinco años trabajando con comunidades indígenas en proyectos de gestión forestal sostenible. Allí aprendió que...

[Contenido en desarrollo]

## El retorno a España

En 2010, Roberto regresa con una convicción clara: es posible combinar productividad económica con respeto profundo por el ecosistema...

[Continúa...]',
  NULL,
  'Roberto Contaldo',
  'fundacion',
  ARRAY['historia', 'fundación', 'valores'],
  false,
  NULL,
  0
);

-- Verificar que se insertaron correctamente
SELECT
  id,
  title,
  slug,
  category,
  published,
  published_at,
  reading_time
FROM blog_posts
ORDER BY created_at DESC;
