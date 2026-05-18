-- ============================================================
-- MIGRATION 005 · Fix Fixture FIFA WC 2026
--
-- Corrige dos errores del seed original:
-- 1. Chile (CL) — NO clasificó al Mundial 2026, se reemplaza por
--    Paraguay (PY) en el Grupo H (clasificó vía CONMEBOL top 6).
-- 2. México aparecía DUPLICADO (Grupo A y Grupo J). Se renombra
--    el de Grupo J a Nigeria (NG, CAF) que faltaba en el seed.
--
-- IMPORTANTE: Usamos UPDATE en lugar de DELETE para no romper
-- las foreign keys de las matches existentes. Los partidos
-- previamente asignados a Chile pasarán automáticamente a
-- pertenecer a Paraguay (con su nuevo country_code/name).
-- ============================================================

-- 1) Chile → Paraguay (Grupo H)
UPDATE public.teams
SET
  name = 'Paraguay',
  country_code = 'PY'
WHERE name = 'Chile' AND country_code = 'CL';

-- 2) México duplicado (Grupo J) → Nigeria
UPDATE public.teams
SET
  name = 'Nigeria',
  country_code = 'NG'
WHERE name = 'México' AND group_name = 'J';

-- 3) Limpiar tournament_predictions que apunten al team_id viejo
--    (no es necesario porque solo cambiamos los nombres, no los UUIDs)
--    Las predicciones de "campeón = Chile" automáticamente serán
--    "campeón = Paraguay". Si quieres invalidarlas, descomenta:
-- DELETE FROM public.tournament_predictions
-- WHERE team_id IN (
--   SELECT id FROM public.teams WHERE name IN ('Paraguay','Nigeria')
-- );
