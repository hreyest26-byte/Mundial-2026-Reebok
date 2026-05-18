import type { ScoreRules } from "@/types";

// Valores por defecto del sistema de puntaje
// El admin puede modificarlos desde /admin/puntajes
export const DEFAULT_SCORE_RULES: ScoreRules = {
  exacto: 7,
  resultado: 3,
  anticipacion_24h: 1,
  campeon: 15,
  subcampeon: 10,
  goleador: 10,
  mvp: 8,
  arquero: 8,
};
