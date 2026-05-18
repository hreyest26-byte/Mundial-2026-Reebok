import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { Avatar } from "@/components/ui/Avatar";
import { BrandedPageHeader } from "@/components/brand/BrandedPageHeader";
import { cn, getInitials } from "@/lib/utils";

export const metadata: Metadata = { title: "Ranking" };

export const revalidate = 60;

export default async function RankingPage() {
  const supabase = createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, nickname, avatar_url, total_points, rank_position, exact_scores, correct_results")
    .eq("is_active", true)
    .order("total_points", { ascending: false })
    .order("exact_scores", { ascending: false });

  const rows = profiles ?? [];

  return (
    <div className="container mx-auto px-4 py-5 max-w-2xl">
      <BrandedPageHeader
        kicker="Reebok Sports"
        title="Ranking"
        subtitle={
          rows.length > 0
            ? `${rows.length} participante${rows.length !== 1 ? "s" : ""} compitiendo`
            : "El ranking se actualiza después de cada partido"
        }
        imagery="trophy"
      />

      {rows.length === 0 ? (
        <div className="relative overflow-hidden rb-card p-8 flex flex-col items-center justify-center text-center gap-4">
          <div aria-hidden className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.06]">
            <svg width="180" height="180" viewBox="0 0 64 64" fill="none">
              <rect x="20" y="52" width="24" height="6" fill="#F5F4F0" />
              <path d="M22 18 L 22 38 Q 32 46, 42 38 L 42 18 Z" fill="#F5F4F0" />
            </svg>
          </div>
          <p className="font-display font-bold text-rb-white text-h3 relative">Sin datos aún</p>
          <p className="text-body text-rb-500 relative">El ranking se activa cuando empieza el torneo.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((profile, idx) => {
            const pos = idx + 1;
            const isMe = profile.id === user?.id;
            const rankProp =
              pos === 1 ? (1 as const) :
              pos === 2 ? (2 as const) :
              pos === 3 ? (3 as const) :
              undefined;

            // Jersey number plate color
            const plateBg =
              pos === 1
                ? "bg-rb-gold text-rb-black"
                : pos === 2
                  ? "bg-rb-silver text-rb-black"
                  : pos === 3
                    ? "bg-rb-bronze text-rb-white"
                    : isMe
                      ? "bg-rb-red/20 text-rb-red border border-rb-red/40"
                      : "bg-rb-800 text-rb-500 border border-rb-700";

            return (
              <div
                key={profile.id}
                className={cn(
                  "rb-card rounded-rb px-4 py-3 flex items-center gap-3",
                  isMe && "border-rb-red/40 bg-rb-red/5"
                )}
              >
                {/* Jersey number plate */}
                <div
                  className={cn(
                    "flex-shrink-0 font-display font-black leading-none tabular-nums rounded-rb px-2 py-1.5 min-w-[36px] text-center",
                    plateBg
                  )}
                >
                  <span className="text-[1.1rem]">{pos}</span>
                </div>

                <Avatar
                  initials={getInitials(profile.full_name ?? profile.nickname ?? "??")}
                  src={profile.avatar_url ?? undefined}
                  size="sm"
                  rank={rankProp}
                />

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-display font-bold text-[0.85rem] leading-none truncate",
                    isMe ? "text-rb-red" : "text-rb-white"
                  )}>
                    {profile.nickname}
                    {isMe && <span className="text-rb-500 font-normal"> (tú)</span>}
                  </p>
                  <p className="text-[0.65rem] text-rb-500 mt-0.5 leading-none">
                    {profile.exact_scores ?? 0} exactos · {profile.correct_results ?? 0} resultados
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={cn(
                    "font-display font-black text-[1.3rem] leading-none tabular-nums",
                    pos === 1 ? "text-rb-gold" : isMe ? "text-rb-red" : "text-rb-white"
                  )}>
                    {profile.total_points ?? 0}
                  </p>
                  <p className="text-[0.6rem] text-rb-500 leading-none mt-0.5">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
