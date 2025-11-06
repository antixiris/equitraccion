-- Script para actualizar las fechas de los posts existentes a octubre 2024
-- Esto permitirá ver cómo se verá el newsletter con contenido del mes pasado

-- Actualizar el primer post a principios de octubre
UPDATE blog_posts
SET
  published_at = '2024-10-05T10:00:00Z',
  created_at = '2024-10-05T10:00:00Z',
  updated_at = '2024-10-05T10:00:00Z'
WHERE title LIKE '%Silencio del bosque%' OR title LIKE '%silencio%';

-- Actualizar el segundo post a mediados de octubre
UPDATE blog_posts
SET
  published_at = '2024-10-12T14:30:00Z',
  created_at = '2024-10-12T14:30:00Z',
  updated_at = '2024-10-12T14:30:00Z'
WHERE title LIKE '%fuerza del caballo%' OR title LIKE '%caballo%';

-- Actualizar el tercer post a finales de octubre
UPDATE blog_posts
SET
  published_at = '2024-10-24T09:15:00Z',
  created_at = '2024-10-24T09:15:00Z',
  updated_at = '2024-10-24T09:15:00Z'
WHERE title LIKE '%tierra%' OR title LIKE '%raíces%';

-- Verificar las actualizaciones
SELECT
  id,
  title,
  published_at,
  published
FROM blog_posts
ORDER BY published_at DESC;

-- Mensaje de confirmación
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM blog_posts
  WHERE published_at >= '2024-10-01' AND published_at < '2024-11-01';

  RAISE NOTICE '✅ Posts actualizados a octubre 2024';
  RAISE NOTICE '✅ Total de posts en octubre: %', updated_count;
  RAISE NOTICE '✅ Ahora puedes ver el preview del newsletter con estos posts';
END $$;
