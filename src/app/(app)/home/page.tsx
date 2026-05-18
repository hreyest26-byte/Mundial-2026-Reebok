import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { DashboardBrandHeader } from "@/components/dashboard/DashboardBrandHeader";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { HeroCountdown } from "@/components/dashboard/HeroCountdown";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SpecialPicksCard } from "@/components/dashboard/SpecialPicksCard";
import { FeaturedMatchCard } from "@/components/dashboard/FeaturedMatchCard";
import { TopThreeCard } from "@/components/dashboard/TopThreeCard";
import { HypeBanner } from "@/components/dashboard/HypeBanner";
import { ReebokFooterMark } from "@/components/dashboard/ReebokFooterMark";
import type { MatchWithTeams } from "@/types";

export const metadata: Metadata = {
  title: "Inicio",
};

export const revalidate = 60;

const MUNDIAL_START = new Date("2026-06-11T17:00:00Z");

const SPECIAL_PICK_TYPES = [
  "champion",
  "runner_up",
  "top_scorer",
  "mvp",
  "best_goalkeeper",
] as const;

export default async function HomePage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, nickname, total_points, rank_position, avatar_url")
    .eq("id", user?.id ?? "")
    .single();

  const topThree =
    (
      await supabase
        .from("profiles")
        .select("id, full_name, nickname, avatar_url, total_points")
        .eq("is_active", true)
        .order("total_points", { ascending: false })
        .limit(3)
    ).data ?? [];

  const { count: totalPlayers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  let featuredMatch: MatchWithTeams | null = null;
  try {
    const { data } = await supabase
      .from("matches")
      .select(
        `*,
        home_team:teams!matches_home_team_id_fkey(id, name, country_code, flag_url),
        away_team:teams!matches_away_team_id_fkey(id, name, country_code, flag_url)`
      )
      .gte("match_time", new Date().toISOString())
      .order("match_time", { ascending: true })
      .limit(1)
      .maybeSingle();
    featuredMatch = (data ?? null) as MatchWithTeams | null;
  } catch {
    featuredMatch = null;
  }

  let specialPicksFilled = 0;
  if (user?.id) {
    try {
      const { data: rows } = await supabase
        .from("tournament_predictions")
        .select("prediction_type, team_id, player_name")
        .eq("user_id", user.id)
        .in("prediction_type", [...SPECIAL_PICK_TYPES]);

      specialPicksFilled = (rows ?? []).filter(
        (r) => r.team_id !== null || r.player_name !== null
      ).length;
    } catch {
      specialPicksFilled = 0;
    }
  }

  const quickActions = [
    {
      href: "/predicciones",
      label: "Tus picks",
      badge: `${specialPicksFilled}/5`,
      accent: specialPicksFilled < 5,
      icon: (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z" />
        </svg>
      ),
    },
    {
      href: "/partidos",
      label: "Partidos",
      icon: (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      href: "/ranking",
      label: "Ranking",
      icon: (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      href: "/perfil",
      label: "Perfil",
      icon: (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-5 max-w-2xl space-y-5">
      <DashboardBrandHeader />

      <WelcomeHeader
        fullName={profile?.full_name ?? null}
        nickname={profile?.nickname ?? null}
        avatarUrl={profile?.avatar_url ?? null}
        rankPosition={profile?.rank_position ?? null}
      />

      <HeroCountdown targetDate={MUNDIAL_START} />

      <QuickActions actions={quickActions} />

      <SpecialPicksCard filled={specialPicksFilled} />

      <FeaturedMatchCard
        match={featuredMatch}
        context={
          featuredMatch ? "Próximo partido" : "Partido inaugural · Grupo A"
        }
      />

      <TopThreeCard players={topThree} currentUserId={user?.id} />

      {typeof totalPlayers === "number" && totalPlayers > 0 && (
        <HypeBanner playerCount={totalPlayers} />
      )}

      <ReebokFooterMark />
    </div>
  );
}
