-- ============================================================
-- MIGRACIÓN 003: Sistema de badges y logros
-- badges, user_badges
-- ============================================================

-- ============================================================
-- TABLA: badges
-- Definición de los 8 badges disponibles en la app
-- ============================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id            uuid  NOT NULL DEFAULT uuid_generate_v4(),
  name          text  NOT NULL,
  description   text  NOT NULL,
  icon          text  NOT NULL,
  trigger_type  text  NOT NULL CHECK (trigger_type IN (
                  'first_exact', 'streak_3', 'streak_5', 'rank_1',
                  'biggest_climb', 'mvp_week', 'golden_boot'
                )),
  trigger_value int   NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
);

-- Insertar los 8 badges del sistema
INSERT INTO public.badges (name, description, icon, trigger_type, trigger_value) VALUES
  (
    'Club C Predictor',
    'Primer marcador exacto acertado',
    '🎯',
    'first_exact',
    1
  ),
  (
    'Instapump Streak',
    'Tres resultados correctos consecutivos',
    '🔥',
    'streak_3',
    3
  ),
  (
    'Pump Fury Legend',
    'Cinco resultados correctos consecutivos',
    '⚡',
    'streak_5',
    5
  ),
  (
    'Answer IV Champion',
    'Llegó al 1° lugar del ranking',
    '🏆',
    'rank_1',
    1
  ),
  (
    'Kamikaze Climber',
    'Subió más posiciones en una jornada',
    '📈',
    'biggest_climb',
    1
  ),
  (
    'Classic Leather MVP',
    'Mejor puntuación de la semana',
    '⭐',
    'mvp_week',
    1
  ),
  (
    'Golden Boot',
    'Acertó 10 o más marcadores exactos',
    '👟',
    'golden_boot',
    10
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- TABLA: user_badges
-- Badges desbloqueados por cada usuario
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id        uuid        NOT NULL DEFAULT uuid_generate_v4(),
  user_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id  uuid        NOT NULL REFERENCES public.badges(id),
  earned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  -- Un usuario no puede tener el mismo badge dos veces
  UNIQUE (user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- ============================================================
-- TRIGGER: Crear perfil automáticamente al registrarse
-- Se dispara cuando Supabase Auth crea un nuevo usuario
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, nickname)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'Classic Leather')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si ya existe para poder recrearlo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
