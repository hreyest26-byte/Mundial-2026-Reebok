import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { PartidosClient } from "./PartidosClient";
import { BrandedPageHeader } from "@/components/brand/BrandedPageHeader";
import type { MatchWithTeams, Prediction } from "@/types";

export const metadata: Metadata = { title: "Partidos" };

export const revalidate = 60;

export default async function PartidosPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: matchesRaw } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(id, name, country_code, flag_url),
      away_team:teams!matches_away_team_id_fkey(id, name, country_code, flag_url)
    `)
    .order("match_time", { ascending: true });

  const matches = (matchesRaw ?? []) as MatchWithTeams[];

  const matchIds = matches.map((m) => m.id);
  let predictionMap: Record<
    string,
    Pick<Prediction, "predicted_home" | "predicted_away" | "points_earned" | "is_exact" | "is_correct_result">
  > = {};

  if (user && matchIds.length > 0) {
    const { data: preds } = await supabase
      .from("predictions")
      .select("match_id, predicted_home, predicted_away, points_earned, is_exact, is_correct_result")
      .eq("user_id", user.id)
      .in("match_id", matchIds);

    for (const p of preds ?? []) {
      predictionMap[p.match_id] = p;
    }
  }

  return (
    <div className="container mx-auto px-4 py-5 max-w-2xl">
      <BrandedPageHeader
        kicker="Reebok Sports"
        title="Partidos"
        subtitle={
          matches.length > 0
            ? `${matches.length} partidos · Cierre 10 min antes del pitazo`
            : "Los partidos aparecerán aquí pronto"
        }
        imagery="ball"
      />

      {matches.length === 0 ? (
        <div className="relative overflow-hidden flex flex-col items-center justify-center py-20 text-center gap-4 rb-card p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.05]"
          >
            <svg width="180" height="180" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="#F5F4F0" strokeWidth="2.5" />
              <path d="M32 20 L41 26 L37.5 36 L26.5 36 L23 26 Z" fill="#F5F4F0" />
            </svg>
          </div>
          <p className="font-display font-bold text-rb-white text-h3 relative">
            Sin partidos cargados
          </p>
          <p className="text-body text-rb-500 relative">
            Los partidos del Mundial FIFA 2026 se cargarán aquí.
          </p>
        </div>
      ) : (
        <PartidosClient matches={matches} predictions={predictionMap} />
      )}
    </div>
  );
}
