// Este archivo se genera automáticamente con el Supabase CLI:
// npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/database.ts
//
// Por ahora usamos un tipo placeholder hasta tener el proyecto Supabase creado.
// NO edites este archivo manualmente una vez que tengas el proyecto configurado.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        };
        Insert: {
          id: string;
          full_name: string;
          nickname: string;
          avatar_url?: string | null;
          total_points?: number;
          rank_position?: number;
          rank_previous?: number;
          exact_scores?: number;
          correct_results?: number;
          role?: "user" | "admin";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          nickname?: string;
          avatar_url?: string | null;
          total_points?: number;
          rank_position?: number;
          rank_previous?: number;
          exact_scores?: number;
          correct_results?: number;
          role?: "user" | "admin";
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          name: string;
          country_code: string;
          group_name: string | null;
          flag_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          country_code: string;
          group_name?: string | null;
          flag_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          country_code?: string;
          group_name?: string | null;
          flag_url?: string | null;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          home_team_id: string;
          away_team_id: string;
          stage: "group" | "round_of_32" | "round_of_16" | "quarter" | "semi" | "third_place" | "final";
          group_name: string | null;
          match_time: string;
          lock_time: string;
          home_score: number | null;
          away_score: number | null;
          status: "scheduled" | "live" | "halftime" | "finished" | "postponed";
          venue: string | null;
          external_match_id: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          home_team_id: string;
          away_team_id: string;
          stage: "group" | "round_of_32" | "round_of_16" | "quarter" | "semi" | "third_place" | "final";
          group_name?: string | null;
          match_time: string;
          home_score?: number | null;
          away_score?: number | null;
          status?: "scheduled" | "live" | "halftime" | "finished" | "postponed";
          venue?: string | null;
          external_match_id?: string | null;
        };
        Update: {
          home_score?: number | null;
          away_score?: number | null;
          status?: "scheduled" | "live" | "halftime" | "finished" | "postponed";
          venue?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      predictions: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          match_id: string;
          predicted_home: number;
          predicted_away: number;
          points_earned?: number;
          is_locked?: boolean;
          is_exact?: boolean;
          is_correct_result?: boolean;
          predicted_at?: string;
        };
        Update: {
          predicted_home?: number;
          predicted_away?: number;
          points_earned?: number;
          is_locked?: boolean;
          is_exact?: boolean;
          is_correct_result?: boolean;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          trigger_type: "first_exact" | "streak_3" | "streak_5" | "rank_1" | "biggest_climb" | "mvp_week" | "golden_boot";
          trigger_value: number;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          trigger_type: "first_exact" | "streak_3" | "streak_5" | "rank_1" | "biggest_climb" | "mvp_week" | "golden_boot";
          trigger_value: number;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      tournament_predictions: {
        Row: {
          id: string;
          user_id: string;
          prediction_type: "champion" | "runner_up" | "top_scorer" | "mvp" | "best_goalkeeper";
          team_id: string | null;
          player_name: string | null;
          points_earned: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          prediction_type: "champion" | "runner_up" | "top_scorer" | "mvp" | "best_goalkeeper";
          team_id?: string | null;
          player_name?: string | null;
          points_earned?: number;
        };
        Update: {
          team_id?: string | null;
          player_name?: string | null;
          points_earned?: number;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "match_starting" | "predictions_closing" | "ranking_update" | "badge_earned" | "top_3_entry";
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "match_starting" | "predictions_closing" | "ranking_update" | "badge_earned" | "top_3_entry";
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
