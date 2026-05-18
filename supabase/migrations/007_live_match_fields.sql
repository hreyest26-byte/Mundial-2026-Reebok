-- ============================================================
-- MIGRATION 007 · Campos para LIVE state del MatchCard
--
-- Agrega columnas opcionales para mostrar el minuto del partido
-- en vivo y la última jugada relevante (gol, tarjeta, etc).
--
-- Compatible con la versión actual de la app: si las columnas
-- son NULL, el MatchCard renderiza como antes (sólo el badge
-- "EN VIVO" pulsante sin minuto).
-- ============================================================

ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS current_minute INT,
  ADD COLUMN IF NOT EXISTS last_event TEXT,
  ADD COLUMN IF NOT EXISTS last_event_at TIMESTAMPTZ;

-- Constraint opcional: minuto entre 0 y 130 (incluye tiempos extra)
ALTER TABLE public.matches
  DROP CONSTRAINT IF EXISTS matches_minute_range;
ALTER TABLE public.matches
  ADD CONSTRAINT matches_minute_range
  CHECK (current_minute IS NULL OR (current_minute >= 0 AND current_minute <= 130));

-- Cuando un partido pasa a status='finished', limpiar los campos LIVE
CREATE OR REPLACE FUNCTION public.clear_live_on_finish()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'finished' AND OLD.status <> 'finished' THEN
    NEW.current_minute := NULL;
    NEW.last_event := NULL;
    NEW.last_event_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clear_live_on_finish ON public.matches;
CREATE TRIGGER trg_clear_live_on_finish
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.clear_live_on_finish();
