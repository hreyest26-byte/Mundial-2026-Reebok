-- ============================================================
-- PARTIDOS DEMO — Ejecutar en Supabase SQL Editor
-- Crea 12 partidos de fase de grupos para testear la app
-- Fix v2.2: Chile reemplazado por Paraguay
-- ============================================================

INSERT INTO public.matches (home_team_id, away_team_id, stage, group_name, match_time, status, venue)
VALUES
  -- Grupo A
  ((SELECT id FROM public.teams WHERE name='México' AND group_name='A' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Nueva Zelanda' LIMIT 1),
   'group','A','2026-06-12 22:00:00+00','scheduled','AT&T Stadium, Dallas'),

  ((SELECT id FROM public.teams WHERE name='Estados Unidos' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Canadá' LIMIT 1),
   'group','A','2026-06-14 01:00:00+00','scheduled','MetLife Stadium, Nueva York'),

  -- Grupo B
  ((SELECT id FROM public.teams WHERE name='Argentina' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Marruecos' LIMIT 1),
   'group','B','2026-06-13 02:00:00+00','scheduled','Rose Bowl, Los Ángeles'),

  ((SELECT id FROM public.teams WHERE name='Ucrania' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Irak' LIMIT 1),
   'group','B','2026-06-13 19:00:00+00','scheduled','Estadio Azteca, Ciudad de México'),

  -- Grupo C
  ((SELECT id FROM public.teams WHERE name='Brasil' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Ecuador' LIMIT 1),
   'group','C','2026-06-14 22:00:00+00','scheduled','Levi''s Stadium, San Francisco'),

  ((SELECT id FROM public.teams WHERE name='Japón' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Croacia' LIMIT 1),
   'group','C','2026-06-15 01:00:00+00','scheduled','SoFi Stadium, Los Ángeles'),

  -- Grupo D
  ((SELECT id FROM public.teams WHERE name='Francia' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Arabia Saudita' LIMIT 1),
   'group','D','2026-06-15 19:00:00+00','scheduled','Hard Rock Stadium, Miami'),

  ((SELECT id FROM public.teams WHERE name='Senegal' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Costa Rica' LIMIT 1),
   'group','D','2026-06-16 22:00:00+00','scheduled','Estadio BBVA, Monterrey'),

  -- Grupo E
  ((SELECT id FROM public.teams WHERE name='España' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Uruguay' LIMIT 1),
   'group','E','2026-06-16 01:00:00+00','scheduled','Arrowhead Stadium, Kansas City'),

  ((SELECT id FROM public.teams WHERE name='Turquía' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Costa de Marfil' LIMIT 1),
   'group','E','2026-06-17 22:00:00+00','scheduled','Lincoln Financial Field, Filadelfia'),

  -- Grupo H (Paraguay reemplaza a Chile)
  ((SELECT id FROM public.teams WHERE name='Paraguay' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Irán' LIMIT 1),
   'group','H','2026-06-17 01:00:00+00','scheduled','Gillette Stadium, Boston'),

  ((SELECT id FROM public.teams WHERE name='Países Bajos' LIMIT 1),
   (SELECT id FROM public.teams WHERE name='Sudáfrica' LIMIT 1),
   'group','H','2026-06-18 22:00:00+00','scheduled','BC Place, Vancouver')

ON CONFLICT DO NOTHING;
