import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { FlagIcon } from "@/components/match/FlagIcon";
import { Badge } from "@/components/ui/Badge";
import { TorneoForm } from "./TorneoForm";
import { BrandedPageHeader } from "@/components/brand/BrandedPageHeader";
import { cn } from "@/lib/utils";
import type { PredictionWithMatch, Team } from "@/types";

export const metadata: Metadata = { title: "Mis Predicciones" };
export const revalidate = 60;

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago",
  }).format(new Date(isoString));
}

type PredResult = "exact" | "correct" | "wrong" | "pending";

function getResult(pred: PredictionWithMatch): PredResult {
  if (pred.match.status !== "finished") return "pending";
  if (pred.is_exact) return "exact";
  if (pred.is_correct_result) return "correct";
  return "wrong";
}

export default async function PrediccionesPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab === "torneo" ? "torneo" : "partidos";
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: predictionsRaw } = await supabase
    .from("predictions")
    .select(`*, match:matches(id, stage, group_name, match_time, status, home_score, away_score,
      home_team:teams!matches_home_team_id_fkey(id, name, country_code, flag_url),
      away_team:teams!matches_away_team_id_fkey(id, name, country_code, flag_url))`)
    .eq("user_id", user?.id ?? "")
    .order("predicted_at", { ascending: false });

  const predictions = (predictionsRaw ?? []) as PredictionWithMatch[];
  const totalPoints = predictions.reduce((s, p) => s + (p.points_earned ?? 0), 0);
  const exactCount = predictions.filter(p => p.is_exact).length;
  const correctCount = predictions.filter(p => p.is_correct_result && !p.is_exact).length;

  const { data: teamsRaw } = await supabase
    .from("teams")
    .select("id, name, country_code")
    .order("name");
  const teams = (teamsRaw ?? []) as Pick<Team, "id" | "name" | "country_code">[];

  const { data: torneoRaw } = await supabase
    .from("tournament_predictions")
    .select("prediction_type, team_id, player_name")
    .eq("user_id", user?.id ?? "");

  const torneoSaved: Record<string, string> = {};
  for (const t of torneoRaw ?? []) {
    if (t.prediction_type === "champion" || t.prediction_type === "runner_up") {
      torneoSaved[t.prediction_type] = t.team_id ?? "";
    } else {
      torneoSaved[t.prediction_type] = t.player_name ?? "";
    }
  }

  const imagery = tab === "torneo" ? "trophy" : "boot";

  return (
    <div className="container mx-auto px-4 py-5 max-w-2xl">
      <BrandedPageHeader
        kicker="Reebok Sports"
        title="Mis Picks"
        subtitle={
          tab === "torneo"
            ? "Predicciones especiales del torneo · Cierre 12 Jun"
            : "Tus predicciones partido a partido"
        }
        imagery={imagery}
      />

      <div className="flex gap-1.5 mb-5">
        <a
          href="/predicciones"
          className={cn(
            "px-4 py-2 rounded-rb font-display font-bold uppercase text-[0.7rem] tracking-wider transition-colors",
            tab === "partidos" ? "bg-rb-red text-white" : "bg-rb-800 text-rb-500 hover:text-rb-white"
          )}
        >
          Partidos
        </a>
        <a
          href="/predicciones?tab=torneo"
          className={cn(
            "px-4 py-2 rounded-rb font-display font-bold uppercase text-[0.7rem] tracking-wider transition-colors",
            tab === "torneo" ? "bg-rb-red text-white" : "bg-rb-800 text-rb-500 hover:text-rb-white"
          )}
        >
          Torneo
        </a>
      </div>

      {tab === "partidos" && (
        <>
          {predictions.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-5">
              <StatCard label="Puntos" value={totalPoints} highlight="gold" />
              <StatCard label="Exactos" value={exactCount} highlight="red" />
              <StatCard label="Resultado ✓" value={correctCount} highlight="blue" />
            </div>
          )}

          {predictions.length === 0 ? (
            <div className="relative overflow-hidden rb-card p-8 flex flex-col items-center justify-center text-center gap-4">
              <div aria-hidden className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.06]">
                <svg width="160" height="160" viewBox="0 0 64 64" fill="none">
                  <path d="M8 38 C 8 32, 14 28, 24 28 L 42 28 C 52 28, 58 32, 58 38 L 58 44 L 8 44 Z" fill="#F5F4F0" />
                  <rect x="8" y="44" width="50" height="4" fill="#F5F4F0" opacity="0.7" />
                </svg>
              </div>
              <p className="font-display font-bold text-rb-white text-h3 relative">Sin predicciones</p>
              <p className="text-body text-rb-500 relative">
                Ve a Partidos y empieza a predecir los resultados.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {predictions.map(pred => {
                const result = getResult(pred);
                const { match } = pred;
                return (
                  <article key={pred.id} className={cn(
                    "rb-card rounded-rb overflow-hidden",
                    result === "exact" && "border-l-2 border-rb-gold",
                    result === "correct" && "border-l-2 border-rb-blue",
                    result === "wrong" && "border-l-2 border-rb-700"
                  )}>
                    <div className="flex items-center justify-between px-4 pt-3 pb-1">
                      <span className="rb-label text-rb-500">
                        {match.stage === "group" ? `Grupo ${match.group_name}` : match.stage.replace("_", " ")}
                      </span>
                      {result === "pending" && <Badge status="upcoming" text="Pendiente" />}
                      {result === "exact" && <Badge status="exact" />}
                      {result === "correct" && <Badge status="saved" text="Resultado ✓" />}
                      {result === "wrong" && <Badge status="finished" text="No acertó" />}
                    </div>

                    <div className="px-4 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FlagIcon countryCode={match.home_team.country_code} size="sm" />
                          <span className="font-display font-bold text-rb-white text-[0.75rem] uppercase truncate">
                            {match.home_team.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {match.status === "finished" ? (
                            <div className="text-center">
                              <p className="rb-label text-rb-500 text-[0.55rem] mb-0.5">Real</p>
                              <p className="font-display font-black text-rb-white text-base tabular-nums leading-none">
                                {match.home_score} – {match.away_score}
                              </p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <p className="text-small text-rb-700 leading-none">{formatDate(match.match_time)}</p>
                            </div>
                          )}
                          <div className="w-px h-8 bg-rb-800" />
                          <div className="text-center">
                            <p className="rb-label text-rb-500 text-[0.55rem] mb-0.5">Mi pick</p>
                            <p className={cn(
                              "font-display font-black text-base tabular-nums leading-none",
                              result === "exact" ? "text-rb-gold" :
                              result === "correct" ? "text-rb-blue" :
                              result === "wrong" ? "text-rb-500" : "text-rb-white"
                            )}>
                              {pred.predicted_home} – {pred.predicted_away}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          <span className="font-display font-bold text-rb-white text-[0.75rem] uppercase truncate text-right">
                            {match.away_team.name}
                          </span>
                          <FlagIcon countryCode={match.away_team.country_code} size="sm" />
                        </div>
                      </div>

                      {pred.points_earned > 0 && (
                        <div className="mt-2 flex justify-center">
                          <span className="font-display font-bold text-rb-gold text-sm">+{pred.points_earned} pts</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "torneo" && (
        <TorneoForm teams={teams} saved={torneoSaved} lockTime="2026-06-12T21:50:00Z" />
      )}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight: "gold" | "red" | "blue" }) {
  const colors = { gold: "text-rb-gold", red: "text-rb-red", blue: "text-rb-blue" };
  return (
    <div className="rb-card rounded-rb p-3 text-center">
      <p className={cn("font-display font-black text-[1.75rem] leading-none tabular-nums", colors[highlight])}>{value}</p>
      <p className="rb-label text-rb-500 mt-1">{label}</p>
    </div>
  );
}
