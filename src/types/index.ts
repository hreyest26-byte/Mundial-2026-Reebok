import type { Database } from "./database";

// Tipos derivados directamente de la base de datos
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Team = Database["public"]["Tables"]["teams"]["Row"];
export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type Prediction = Database["public"]["Tables"]["predictions"]["Row"];
export type Badge = Database["public"]["Tables"]["badges"]["Row"];
export type UserBadge = Database["public"]["Tables"]["user_badges"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

// Tipos extendidos para la UI (joins de tablas)
export type MatchWithTeams = Match & {
  home_team: Pick<Team, "id" | "name" | "country_code" | "flag_url">;
  away_team: Pick<Team, "id" | "name" | "country_code" | "flag_url">;
};

export type PredictionWithMatch = Prediction & {
  match: MatchWithTeams;
};

export type ProfileWithBadges = Profile & {
  user_badges: (UserBadge & { badge: Badge })[];
};

// Roles de usuario
export type UserRole = "user" | "admin";

// Estado de un partido
export type MatchStatus = Match["status"];

// Etapa del torneo
export type MatchStage = Match["stage"];

// Tipos de notificación
export type NotificationType = Notification["type"];

// Reglas de puntaje (almacenadas en admin_settings)
export interface ScoreRules {
  exacto: number;           // Marcador exacto (ej: 7 pts)
  resultado: number;        // Resultado correcto sin ser exacto (ej: 3 pts)
  anticipacion_24h: number; // Bonus por predecir con 24h+ de anticipación (ej: 1 pt)
  campeon: number;          // Predicción especial: campeón (ej: 15 pts)
  subcampeon: number;       // Predicción especial: subcampeón (ej: 10 pts)
  goleador: number;         // Predicción especial: goleador (ej: 10 pts)
  mvp: number;              // Predicción especial: MVP (ej: 8 pts)
  arquero: number;          // Predicción especial: mejor arquero (ej: 8 pts)
}

// Valores por defecto del sistema de puntaje
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
