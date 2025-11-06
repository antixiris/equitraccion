-- Script para crear la tabla de cursos en Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor

-- 1. Crear tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  level INTEGER NOT NULL CHECK (level > 0),
  experience_level VARCHAR(50) NOT NULL CHECK (experience_level IN ('Iniciación', 'Intermedio', 'Avanzado')),
  max_participants INTEGER NOT NULL CHECK (max_participants > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  target_audience TEXT NOT NULL,
  contents TEXT NOT NULL,
  requirements TEXT,
  dates JSONB NOT NULL,
  location VARCHAR(200) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(active);
CREATE INDEX IF NOT EXISTS idx_courses_dates ON courses USING GIN (dates);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);

-- 3. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Crear trigger para updated_at
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 6. Crear política de lectura pública para cursos activos
DROP POLICY IF EXISTS "Public read access for active courses" ON courses;
CREATE POLICY "Public read access for active courses" ON courses
    FOR SELECT
    USING (active = true);

-- 7. Crear política de acceso completo para service_role
DROP POLICY IF EXISTS "Service role full access" ON courses;
CREATE POLICY "Service role full access" ON courses
    FOR ALL
    USING (auth.role() = 'service_role');

-- 8. Añadir comentarios para documentación
COMMENT ON TABLE courses IS 'Cursos de formación con sus convocatorias';
COMMENT ON COLUMN courses.id IS 'Identificador único del curso';
COMMENT ON COLUMN courses.title IS 'Título del curso';
COMMENT ON COLUMN courses.duration_days IS 'Duración del curso en días';
COMMENT ON COLUMN courses.level IS 'Nivel numérico del curso (1, 2, 3...)';
COMMENT ON COLUMN courses.experience_level IS 'Nivel de experiencia: Iniciación, Intermedio o Avanzado';
COMMENT ON COLUMN courses.max_participants IS 'Número máximo de participantes';
COMMENT ON COLUMN courses.price IS 'Precio del curso en euros';
COMMENT ON COLUMN courses.target_audience IS '¿Para quién está dirigido el curso?';
COMMENT ON COLUMN courses.contents IS 'Contenidos del curso';
COMMENT ON COLUMN courses.requirements IS 'Requisitos para participar (opcional)';
COMMENT ON COLUMN courses.dates IS 'Array JSON con fechas de convocatorias: [{"start": "2025-03-15", "end": "2025-03-18", "spots_available": 12, "notes": "..."}]';
COMMENT ON COLUMN courses.location IS 'Ubicación donde se realiza el curso';
COMMENT ON COLUMN courses.active IS 'Si el curso está activo y visible en la web';

-- 9. Insertar datos de ejemplo para testing
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
(
  'Tracción Animal Aplicada a la Silvicultura',
  4,
  1,
  'Iniciación',
  12,
  450.00,
  'Profesionales forestales, propietarios de fincas, personas interesadas en silvicultura sostenible sin experiencia previa',
  E'- Fundamentos de tracción equina\n- Selección y cuidado de los animales\n- Arneses y aparejos tradicionales\n- Técnicas de trabajo en bosque\n- Arrastre básico de troncos\n- Seguridad y prevención de riesgos\n- Bienestar animal\n- Práctica en terreno real',
  'No se requiere experiencia previa. Edad mínima 18 años. Condición física básica para trabajo en campo.',
  '[
    {"start": "2025-03-15", "end": "2025-03-18", "spots_available": 12, "notes": "Convocatoria primavera"},
    {"start": "2025-06-10", "end": "2025-06-13", "spots_available": 12, "notes": "Convocatoria verano"}
  ]'::jsonb,
  'Monte Esquela, Talaveruela de la Vera, Cáceres',
  true
),
(
  'Silvicultura Profesional con Tracción Animal',
  5,
  2,
  'Avanzado',
  8,
  950.00,
  'Profesionales forestales, gestores de espacios naturales o personas que han completado el curso de iniciación y quieren trabajar profesionalmente con tracción animal',
  E'- Planificación de operaciones forestales\n- Trabajo en pendientes y terrenos complejos\n- Técnicas avanzadas de arrastre\n- Apertura de pistas forestales\n- Gestión de equipos\n- Rentabilidad económica\n- Certificaciones profesionales\n- Prácticas intensivas',
  'Haber completado el curso de iniciación o demostrar experiencia previa equivalente. Condición física para trabajo intensivo.',
  '[
    {"start": "2025-04-20", "end": "2025-04-24", "spots_available": 8, "notes": "Grupo reducido - intensivo"},
    {"start": "2025-09-15", "end": "2025-09-19", "spots_available": 8, "notes": "Última convocatoria del año"}
  ]'::jsonb,
  'Monte Esquela, Talaveruela de la Vera, Cáceres',
  true
),
(
  'Introducción al Trabajo Consciente con Caballos',
  3,
  1,
  'Iniciación',
  10,
  350.00,
  'Personas interesadas en desarrollo personal, coaches, educadores, terapeutas y cualquiera que quiera explorar el vínculo humano-caballo',
  E'- Comunicación no verbal con caballos\n- Presencia y consciencia corporal\n- Liderazgo natural y asertivo\n- Gestión emocional\n- Trabajo con límites personales\n- Metáforas del proceso personal\n- Integración de aprendizajes',
  'No se requiere experiencia previa con caballos. Apertura al autoconocimiento y disposición para el trabajo vivencial.',
  '[
    {"start": "2025-05-05", "end": "2025-05-07", "spots_available": 10, "notes": "Puente de mayo"},
    {"start": "2025-10-12", "end": "2025-10-14", "spots_available": 10, "notes": "Puente del Pilar"}
  ]'::jsonb,
  'Centro Equitracción, Talaveruela de la Vera, Cáceres',
  true
);

-- 10. Mostrar cursos insertados
SELECT 
    id,
    title,
    experience_level,
    price,
    active,
    jsonb_array_length(dates) as num_convocatorias
FROM courses
ORDER BY created_at DESC;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Tabla courses creada exitosamente';
    RAISE NOTICE '✅ % cursos de ejemplo insertados', (SELECT COUNT(*) FROM courses);
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '✅ Sistema listo para usar';
END $$;
