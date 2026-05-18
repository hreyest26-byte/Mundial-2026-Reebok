-- ============================================================
-- MIGRACIÓN 002: Sistema de predicciones
-- predictions, tournament_predictions, odds, admin_settings,
-- notifications, rewards
-- ============================================================

-- ============================================================
-- TABLA: predictions
-- Una predicción por usuario por partido
-- ============================================================
CREATE TABLE IF NOT EXISTS public.predictions (
  id                  uuid        NOT NULL DEFAULT uuid_generate_v4(),
  user_id             uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id            uuid        NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  predicted_home      int         NOT NULL CHECK (predicted_home >= 0),
  predicted_away      int         NOT NULL CHECK (predicted_away >= 0),
  points_earned       int         NOT NULL DEFAULT 0,
  is_locked           boolean     NOT NULL DEFAULT false,
  is_exact            boolean     NOT NULL DEFAULT false,
  is_correct_result   boolean     NOT NULL DEFAULT false,
  predicted_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  -- Un usuario solo puede tener UNA predicción por partido
  UNIQUE (user_id, match_id)
);

CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);

-- ============================================================
-- TABLA: tournament_predictions
-- Predicciones especiales: campeón, subcampeón, goleador, etc.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.tournament_predictions (
  id              uuid  NOT NULL DEFAULT uuid_generate_v4(),
  user_id         uuid  NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  prediction_type text  NOT NULL CHECK (prediction_type IN (
                    'champion', 'runner_up', 'top_scorer', 'mvp', 'best_goalkeeper'
                  )),
  team_id         uuid  REFERENCES public.teams(id),
  player_name     text,
  points_earned   int   NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  -- Un usuario solo puede tener UNA predicción por tipo
  UNIQUE (user_id, prediction_type)
);

CREATE INDEX IF NOT EXISTS idx_tournament_predictions_user_id
  ON public.tournament_predictions(user_id);

-- ============================================================
-- TABLA: odds
-- Cuotas referenciales (solo informativas, sin apuestas reales)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.odds (
  id        uuid    NOT NULL DEFAULT uuid_generate_v4(),
  match_id  uuid    NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE UNIQUE,
  home_win  numeric(5,2),
  draw      numeric(5,2),
  away_win  numeric(5,2),
  favorite  text    CHECK (favorite IN ('home', 'draw', 'away')),
  source    text    DEFAULT 'manual',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- ============================================================
-- TABLA: admin_settings
-- Configuración editable por el admin: score_rules, rewards, etc.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key         text    NOT NULL,
  value       jsonb   NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (key)
);

-- Insertar configuración inicial de puntaje
INSERT INTO public.admin_settings (key, value) VALUES (
  'score_rules',
  '{
    "exacto": 7,
    "resultado": 3,
    "anticipacion_24h": 1,
    "campeon": 15,
    "subcampeon": 10,
    "goleador": 10,
    "mvp": 8,
    "arquero": 8
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- TABLA: notifications
-- Notificaciones in-app para cada usuario
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        NOT NULL DEFAULT uuid_generate_v4(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text        NOT NULL CHECK (type IN (
               'match_starting', 'predictions_closing', 'ranking_update',
               'badge_earned', 'top_3_entry'
             )),
  message    text        NOT NULL,
  is_read    boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ============================================================
-- TABLA: rewards
-- Premios del 1°, 2° y 3° lugar (editables desde el admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  position    int     NOT NULL CHECK (position IN (1, 2, 3)),
  title       text    NOT NULL,
  description text    NOT NULL,
  image_url   text,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (position)
);

-- Insertar premios por defecto
INSERT INTO public.rewards (position, title, description) VALUES
  (1, '1° Lugar 🥇', 'Premio especial para el campeón del pool — por definir'),
  (2, '2° Lugar 🥈', 'Premio para el subcampeón — por definir'),
  (3, '3° Lugar 🥉', 'Premio para el tercer lugar — por definir')
ON CONFLICT (position) DO NOTHING;
