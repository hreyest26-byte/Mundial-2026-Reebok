import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

const VALID_TYPES = ["champion", "runner_up", "top_scorer", "mvp", "best_goalkeeper"] as const;
type PredType = typeof VALID_TYPES[number];

const LOCK_TIME = new Date("2026-06-12T21:50:00Z");

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (new Date() >= LOCK_TIME) {
    return NextResponse.json({ error: "Las predicciones de torneo están cerradas" }, { status: 409 });
  }

  let body: { predictionType?: unknown; teamId?: unknown; playerName?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { predictionType, teamId, playerName } = body;

  if (!VALID_TYPES.includes(predictionType as PredType)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const type = predictionType as PredType;
  const isTeamPred = type === "champion" || type === "runner_up";

  if (isTeamPred && typeof teamId !== "string") {
    return NextResponse.json({ error: "Debes seleccionar un equipo" }, { status: 400 });
  }
  if (!isTeamPred && (typeof playerName !== "string" || !playerName.trim())) {
    return NextResponse.json({ error: "Debes ingresar un nombre" }, { status: 400 });
  }

  const { error } = await supabase
    .from("tournament_predictions")
    .upsert(
      {
        user_id: user.id,
        prediction_type: type,
        team_id: isTeamPred ? (teamId as string) : null,
        player_name: !isTeamPred ? (playerName as string).trim() : null,
      },
      { onConflict: "user_id,prediction_type" }
    );

  if (error) {
    console.error("Torneo upsert error:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
