-- ============================================================
-- MIGRATION 006 · Fixture completo fase de grupos
--
-- Genera los 72 partidos de la fase de grupos del Mundial 2026
-- (12 grupos A-L × 6 partidos round-robin = 72 matches).
--
-- Usa un CTE que cruza cada equipo con los demás de su grupo
-- y asigna fecha incremental por grupo, espaciadas 17 días
-- entre el 11 y el 27 de junio de 2026.
--
-- Idempotente: borra los matches de stage='group' previos antes
-- de insertar el set completo, para evitar duplicados al re-correr.
-- ============================================================

-- Limpiar partidos de grupos previos (mantiene knockouts si existen)
DELETE FROM public.predictions
  WHERE match_id IN (SELECT id FROM public.matches WHERE stage = 'group');

DELETE FROM public.matches WHERE stage = 'group';

-- Insertar los 72 partidos
WITH group_pairs AS (
  SELECT
    t1.id AS home_id,
    t2.id AS away_id,
    t1.group_name AS grp,
    ROW_NUMBER() OVER (
      PARTITION BY t1.group_name
      ORDER BY t1.country_code, t2.country_code
    ) AS match_num
  FROM public.teams t1
  JOIN public.teams t2 ON t1.group_name = t2.group_name AND t1.id < t2.id
  WHERE t1.group_name IS NOT NULL
)
INSERT INTO public.matches (home_team_id, away_team_id, stage, group_name, match_time, status, venue)
SELECT
  home_id,
  away_id,
  'group',
  grp,
  -- offset por grupo (A=día 0, B=día 0, ..., L=día 11) + offset por match_num × 6 horas
  ('2026-06-11 17:00:00+00'::timestamptz
    + ((ASCII(grp) - ASCII('A')) || ' days')::interval
    + ((match_num - 1) * 6 || ' hours')::interval
  ),
  'scheduled',
  CASE grp
    WHEN 'A' THEN 'Estadio Azteca, CDMX'
    WHEN 'B' THEN 'AT&T Stadium, Dallas'
    WHEN 'C' THEN 'SoFi Stadium, Los Ángeles'
    WHEN 'D' THEN 'Hard Rock Stadium, Miami'
    WHEN 'E' THEN 'Arrowhead Stadium, Kansas City'
    WHEN 'F' THEN 'MetLife Stadium, Nueva York'
    WHEN 'G' THEN 'Lincoln Financial Field, Filadelfia'
    WHEN 'H' THEN 'Gillette Stadium, Boston'
    WHEN 'I' THEN 'Levi''s Stadium, San Francisco'
    WHEN 'J' THEN 'BC Place, Vancouver'
    WHEN 'K' THEN 'Estadio BBVA, Monterrey'
    WHEN 'L' THEN 'Rose Bowl, Los Ángeles'
  END
FROM group_pairs;

-- Verificación rápida
DO $$
DECLARE
  total INT;
BEGIN
  SELECT COUNT(*) INTO total FROM public.matches WHERE stage = 'group';
  RAISE NOTICE 'Total partidos de grupos insertados: %', total;
END $$;
