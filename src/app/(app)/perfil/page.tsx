import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { PerfilClient } from "./PerfilClient";

export const metadata: Metadata = { title: "Mi Perfil" };

export default async function PerfilPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, nickname, avatar_url, total_points, rank_position, exact_scores, correct_results")
    .eq("id", user?.id ?? "")
    .single();

  if (!profile) return null;

  return <PerfilClient profile={profile} userId={user!.id} />;
}
