-- Script para insertar 4 cursos de ejemplo con convocatorias abiertas
-- Ejecutar después del schema principal

-- Limpiar datos anteriores (opcional)
-- DELETE FROM courses;

-- Insertar 4 cursos con convocatorias futuras
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
  location,
  active
) VALUES
-- Curso 1: Tracción Animal Básica
(
  'Introducción a la Tracción Animal en Silvicultura',
  3,
  1,
  'Iniciación',
  12,
  380.00,
  'Profesionales forestales, propietarios de fincas y personas interesadas en silvicultura sostenible sin experiencia previa con tracción animal',
  E'• Fundamentos históricos y éticos de la tracción equina\n• Anatomía y fisiología del caballo de trabajo\n• Selección y cuidado de los animales\n• Arneses y aparejos tradicionales\n• Técnicas básicas de guiado\n• Seguridad y bienestar animal\n• Práctica supervisada en terreno',
  'No se requiere experiencia previa. Edad mínima 18 años. Condición física básica para trabajo en campo.',
  '[
    {"start": "2025-02-10", "end": "2025-02-12", "spots_available": 12, "notes": "Convocatoria febrero"},
    {"start": "2025-04-07", "end": "2025-04-09", "spots_available": 10, "notes": "Convocatoria primavera"}
  ]'::jsonb,
  'Monte Esquela, Talaveruela de la Vera, Cáceres',
  true
),
-- Curso 2: Silvicultura Profesional
(
  'Silvicultura Profesional con Tracción Animal',
  5,
  2,
  'Avanzado',
  8,
  950.00,
  'Profesionales forestales, gestores de espacios naturales o personas que han completado el curso de iniciación y quieren especializarse en operaciones forestales profesionales',
  E'• Planificación de operaciones forestales complejas\n• Trabajo en pendientes y terrenos difíciles\n• Técnicas avanzadas de arrastre y desembosque\n• Apertura y mantenimiento de pistas forestales\n• Gestión de equipos y logística\n• Análisis de rentabilidad económica\n• Certificaciones y normativa profesional\n• Prácticas intensivas en monte real',
  'Haber completado el curso de iniciación o demostrar experiencia equivalente. Buena condición física para trabajo intensivo en monte.',
  '[
    {"start": "2025-03-17", "end": "2025-03-21", "spots_available": 8, "notes": "Grupo reducido - formato intensivo"},
    {"start": "2025-06-02", "end": "2025-06-06", "spots_available": 6, "notes": "Convocatoria verano"}
  ]'::jsonb,
  'Monte Esquela, Talaveruela de la Vera, Cáceres',
  true
),
-- Curso 3: Desarrollo Personal con Caballos
(
  'Coaching Asistido con Caballos: El Espejo del Ser',
  4,
  1,
  'Iniciación',
  10,
  420.00,
  'Coaches, terapeutas, educadores, facilitadores y personas en proceso de desarrollo personal que deseen explorar el vínculo humano-caballo como herramienta de autoconocimiento',
  E'• Comunicación no verbal y presencia corporal\n• El caballo como espejo emocional\n• Liderazgo natural y asertividad\n• Gestión de límites personales\n• Trabajo con metáforas y proyecciones\n• Integración somática de aprendizajes\n• Diseño de sesiones grupales e individuales\n• Práctica vivencial y supervisión',
  'No se requiere experiencia con caballos. Apertura al autoconocimiento y disposición para el trabajo vivencial.',
  '[
    {"start": "2025-02-20", "end": "2025-02-23", "spots_available": 10, "notes": "Retiro residencial incluido"},
    {"start": "2025-05-01", "end": "2025-05-04", "spots_available": 8, "notes": "Puente de mayo"}
  ]'::jsonb,
  'Centro Equitracción, Talaveruela de la Vera, Cáceres',
  true
),
-- Curso 4: Herraje Natural
(
  'Herraje Natural y Cuidado Integral del Casco',
  2,
  1,
  'Intermedio',
  10,
  280.00,
  'Propietarios de caballos, profesionales ecuestres y personas interesadas en el cuidado natural del casco equino desde una perspectiva holística',
  E'• Anatomía y biomecánica del casco\n• Evaluación del equilibrio natural\n• Técnicas de recorte funcional\n• Herraje respetuoso vs. barefoot\n• Nutrición y su impacto en la salud del casco\n• Prevención de patologías comunes\n• Materiales naturales y alternativos\n• Práctica guiada con casos reales',
  'Experiencia básica en manejo de caballos. Herramientas propias (opcional, se pueden facilitar).',
  '[
    {"start": "2025-03-08", "end": "2025-03-09", "spots_available": 10, "notes": "Fin de semana intensivo"},
    {"start": "2025-05-24", "end": "2025-05-25", "spots_available": 10, "notes": "Convocatoria primavera"}
  ]'::jsonb,
  'Centro Equitracción, Talaveruela de la Vera, Cáceres',
  true
);

-- Verificar la inserción
SELECT
    title,
    experience_level,
    price,
    jsonb_array_length(dates) as num_convocatorias,
    active
FROM courses
ORDER BY created_at DESC;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Se han insertado 4 cursos con convocatorias activas';
    RAISE NOTICE '✅ Total de cursos en la base de datos: %', (SELECT COUNT(*) FROM courses);
END $$;
