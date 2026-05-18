-- ============================================================
-- MIGRACIÓN 001: Tablas base
-- profiles, teams, matches
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLA: profiles
-- Extiende auth.users. Se crea automáticamente vía trigger.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       text          NOT NULL,
  nickname        text          NOT NULL,
  avatar_url      text,
  total_points    int           NOT NULL DEFAULT 0,
  rank_position   int           NOT NULL DEFAULT 0,
  rank_previous   int           NOT NULL DEFAULT 0,
  exact_scores    int           NOT NULL DEFAULT 0,
  correct_results int           NOT NULL DEFAULT 0,
  role            text          NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active       boolean       NOT NULL DEFAULT true,
  created_at      timestamptz   NOT NULL DEFAULT now(),
  updated_at      timestamptz   NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- TABLA: teams
-- 48 selecciones del Mundial 2026
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id           uuid    NOT NULL DEFAULT uuid_generate_v4(),
  name         text    NOT NULL,
  country_code char(2) NOT NULL,
  group_name   char(1),
  flag_url     text,
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLA: matches
-- 80 partidos del Mundial 2026
-- ============================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id                uuid        NOT NULL DEFAULT uuid_generate_v4(),
  home_team_id      uuid        NOT NULL REFERENCES public.teams(id),
  away_team_id      uuid        NOT NULL REFERENCES public.teams(id),
  stage             text        NOT NULL CHECK (stage IN (
                      'group', 'round_of_32', 'round_of_16',
                      'quarter', 'semi', 'third_place', 'final'
                    )),
  group_name        char(1),
  match_time        timestamptz NOT NULL,
  -- lock_time se calcula automáticamente vía trigger: 10 minutos antes del partido
  lock_time         timestamptz,
  home_score        int,
  away_score        int,
  status            text        NOT NULL DEFAULT 'scheduled' CHECK (status IN (
                      'scheduled', 'live', 'halftime', 'finished', 'postponed'
                    )),
  venue             text,
  external_match_id text UNIQUE,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger para calcular lock_time automáticamente al insertar o cambiar match_time
CREATE OR REPLACE FUNCTION public.set_lock_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lock_time = NEW.match_time - INTERVAL '10 minutes';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER matches_lock_time
  BEFORE INSERT OR UPDATE OF match_time ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.set_lock_time();

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_match_time ON public.matches(match_time);
CREATE INDEX IF NOT EXISTS idx_matches_stage ON public.matches(stage);
