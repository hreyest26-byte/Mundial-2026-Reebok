-- ============================================================
-- MIGRACIÓN 004: Row Level Security (RLS)
-- Cada usuario solo puede ver/editar sus propios datos.
-- Los admins tienen acceso completo via service_role.
-- ============================================================

-- Activar RLS en todas las tablas
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odds             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges      ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS: profiles
-- ============================================================

-- Cualquier usuario autenticado puede ver todos los perfiles (para el ranking)
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Un usuario solo puede editar su propio perfil
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- POLÍTICAS: teams (solo lectura para todos)
-- ============================================================
CREATE POLICY "teams_select_authenticated"
  ON public.teams FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- POLÍTICAS: matches (solo lectura para usuarios)
-- ============================================================
CREATE POLICY "matches_select_authenticated"
  ON public.matches FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- POLÍTICAS: predictions
-- ============================================================

-- Un usuario puede ver sus propias predicciones
CREATE POLICY "predictions_select_own"
  ON public.predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Un usuario puede ver predicciones de otros (para comparar) — solo lectura anónima
-- Los campos sensibles no existen en predictions, está bien exponerlas
CREATE POLICY "predictions_select_all_authenticated"
  ON public.predictions FOR SELECT
  TO authenticated
  USING (true);

-- Un usuario puede insertar sus propias predicciones
CREATE POLICY "predictions_insert_own"
  ON public.predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Un usuario puede actualizar sus propias predicciones (mientras no estén bloqueadas)
CREATE POLICY "predictions_update_own"
  ON public.predictions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_locked = false)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- POLÍTICAS: tournament_predictions
-- ============================================================
CREATE POLICY "tournament_predictions_select_own"
  ON public.tournament_predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "tournament_predictions_insert_own"
  ON public.tournament_predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tournament_predictions_update_own"
  ON public.tournament_predictions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- POLÍTICAS: odds (solo lectura para todos)
-- ============================================================
CREATE POLICY "odds_select_authenticated"
  ON public.odds FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- POLÍTICAS: admin_settings
-- Solo lectura para usuarios, escritura solo via service_role
-- ============================================================
CREATE POLICY "admin_settings_select_authenticated"
  ON public.admin_settings FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- POLÍTICAS: notifications
-- Un usuario solo puede ver y marcar leídas sus propias notificaciones
-- ============================================================
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- POLÍTICAS: rewards (públicas — cualquiera puede ver los premios)
-- ============================================================
CREATE POLICY "rewards_select_all"
  ON public.rewards FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- POLÍTICAS: badges (públicos — todos pueden ver qué badges existen)
-- ============================================================
CREATE POLICY "badges_select_authenticated"
  ON public.badges FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- POLÍTICAS: user_badges
-- ============================================================

-- Cualquier usuario puede ver los badges de los demás (para el ranking)
CREATE POLICY "user_badges_select_authenticated"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (true);
