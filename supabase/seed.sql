-- ============================================================
-- SEED: 48 equipos del Mundial FIFA 2026
-- Grupos A–L con los equipos clasificados (fixture demo)
-- Fix v2.2: Chile reemplazado por Paraguay (no clasificó).
-- México solo está en Grupo A; el slot del Grupo J pasa a Nigeria.
-- ============================================================

INSERT INTO public.teams (name, country_code, group_name) VALUES
  -- Grupo A (México)
  ('México',        'MX', 'A'),
  ('Estados Unidos','US', 'A'),
  ('Canadá',        'CA', 'A'),
  ('Nueva Zelanda', 'NZ', 'A'),

  -- Grupo B
  ('Argentina',     'AR', 'B'),
  ('Marruecos',     'MA', 'B'),
  ('Irak',          'IQ', 'B'),
  ('Ucrania',       'UA', 'B'),

  -- Grupo C
  ('Brasil',        'BR', 'C'),
  ('Japón',         'JP', 'C'),
  ('Croacia',       'HR', 'C'),
  ('Ecuador',       'EC', 'C'),

  -- Grupo D
  ('Francia',       'FR', 'D'),
  ('Senegal',       'SN', 'D'),
  ('Arabia Saudita','SA', 'D'),
  ('Costa Rica',    'CR', 'D'),

  -- Grupo E
  ('España',        'ES', 'E'),
  ('Turquía',       'TR', 'E'),
  ('Costa de Marfil','CI','E'),
  ('Uruguay',       'UY', 'E'),

  -- Grupo F
  ('Portugal',      'PT', 'F'),
  ('Alemania',      'DE', 'F'),
  ('Escocia',       'GB', 'F'),
  ('Colombia',      'CO', 'F'),

  -- Grupo G
  ('Inglaterra',    'EN', 'G'),
  ('Ghana',         'GH', 'G'),
  ('Panamá',        'PA', 'G'),
  ('Hungría',       'HU', 'G'),

  -- Grupo H (Paraguay reemplaza a Chile — Chile no clasificó)
  ('Países Bajos',  'NL', 'H'),
  ('Irán',          'IR', 'H'),
  ('Sudáfrica',     'ZA', 'H'),
  ('Paraguay',      'PY', 'H'),

  -- Grupo I
  ('Italia',        'IT', 'I'),
  ('Bélgica',       'BE', 'I'),
  ('Egipto',        'EG', 'I'),
  ('Australia',     'AU', 'I'),

  -- Grupo J (Nigeria reemplaza al México duplicado)
  ('Corea del Sur', 'KR', 'J'),
  ('Nigeria',       'NG', 'J'),
  ('Venezuela',     'VE', 'J'),
  ('Túnez',         'TN', 'J'),

  -- Grupo K
  ('Serbia',        'RS', 'K'),
  ('Dinamarca',     'DK', 'K'),
  ('Qatar',         'QA', 'K'),
  ('Perú',          'PE', 'K'),

  -- Grupo L
  ('Polonia',       'PL', 'L'),
  ('Suiza',         'CH', 'L'),
  ('República Checa','CZ','L'),
  ('Bolivia',       'BO', 'L')

ON CONFLICT DO NOTHING;

-- ============================================================
-- NOTA: Los partidos (matches) se cargan desde API-Football
-- al iniciar la app, o manualmente desde /admin/partidos.
-- ============================================================
