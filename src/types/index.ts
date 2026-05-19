// Tipos de dominio — definidos INLINE para que el build no dependa de archivos auto-generados.

export interface Profile {
  id: string;
  full_name: string;
  nickname: string;
  avatar_url: string | null;
  total_points: number;
  rank_position: number;
  rank_previous: number;
  exact_scores: number;
  correct_results: number;
  role: "user" | "admin";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  country_code: string;
  group_name: string | null;
  flag_url: string | null;
}

export type MatchStage =
  | "group"
  | "round_of_32"
  | "round_of_16"
  | "quarter"
  | "semi"
  | "third_place"
  | "final";

export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "postponed";

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  stage: MatchStage;
  group_name: string | null;
  match_time: string;
  lock_time: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  venue: string | null;
  external_match_id: string | null;
  updated_at: string;
  current_minute?: number | null;
  last_event?: string | null;
  last_event_at?: string | null;
}

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  predicted_home: number;
  predicted_away: number;
  points_earned: number;
  is_locked: boolean;
  is_exact: boolean;
  is_correct_result: boolean;
  predicted_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger_type:
    | "first_exact"
    | "streak_3"
    | "streak_5"
    | "rank_1"
    | "biggest_climb"
    | "mvp_week"
    | "golden_boot";
  trigger_value: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export type NotificationType =
  | "match_starting"
  | "predictions_closing"
  | "ranking_update"
  | "badge_earned"
  | "top_3_entry";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type TournamentPredictionType =
  | "champion"
  | "runner_up"
  | "top_scorer"
  | "mvp"
  | "best_goalkeeper";

export interface TournamentPrediction {
  id: string;
  user_id: string;
  prediction_type: TournamentPredictionType;
  team_id: string | null;
  player_name: string | null;
  points_earned: number;
}

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

export type UserRole = "user" | "admin";

export interface ScoreRules {
  exacto: number;
  resultado: number;
  anticipacion_24h: number;
  campeon: number;
  subcampeon: number;
  goleador: number;
  mvp: number;
  arquero: number;
}

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
