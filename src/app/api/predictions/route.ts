import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { matchId?: unknown; predictedHome?: unknown; predictedAway?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { matchId, predictedHome, predictedAway } = body;

  if (
    typeof matchId !== "string" ||
    typeof predictedHome !== "number" ||
    typeof predictedAway !== "number" ||
    !Number.isInteger(predictedHome) ||
    !Number.isInteger(predictedAway) ||
    predictedHome < 0 ||
    predictedAway < 0 ||
    predictedHome > 20 ||
    predictedAway > 20
  ) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  // Verify match exists and is not locked
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("id, lock_time, status")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
  }

  if (match.status !== "scheduled") {
    return NextResponse.json(
      { error: "Las predicciones están cerradas para este partido" },
      { status: 409 }
    );
  }

  if (new Date() >= new Date(match.lock_time)) {
    return NextResponse.json(
      { error: "El tiempo para predecir este partido ha cerrado" },
      { status: 409 }
    );
  }

  // Upsert prediction
  const { data: prediction, error: upsertError } = await supabase
    .from("predictions")
    .upsert(
      {
        user_id: user.id,
        match_id: matchId,
        predicted_home: predictedHome,
        predicted_away: predictedAway,
      },
      { onConflict: "user_id,match_id" }
    )
    .select("id, predicted_home, predicted_away, predicted_at")
    .single();

  if (upsertError) {
    console.error("Prediction upsert error:", upsertError);
    return NextResponse.json({ error: "Error al guardar la predicción" }, { status: 500 });
  }

  return NextResponse.json({ prediction }, { status: 200 });
}
