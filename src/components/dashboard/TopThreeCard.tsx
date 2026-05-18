import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { cn, getInitials } from "@/lib/utils";

/**
 * TopThreeCard — preview compacto del podio.
 *
 * - Marca al usuario actual con accent rojo y "(tú)"
 * - Avatars con ring de oro/plata/bronce (prop `rank` del componente Avatar existente)
 * - Link directo a /ranking
 * - Si no hay datos, muestra estructura vacía para mantener consistencia visual
 */
interface TopThreePlayer {
  id: string;
  full_name: string | null;
  nickname: string | null;
  avatar_url: string | null;
  total_points: number | null;
}

interface TopThreeCardProps {
  players: TopThreePlayer[];
  currentUserId?: string;
}

export function TopThreeCard({ players, currentUserId }: TopThreeCardProps) {
  const podium = players.slice(0, 3);

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: "300ms" }}
    >
      <Card>
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <p className="rb-label">Ranking · Top 3</p>
            <Link
              href="/ranking"
              className="rb-label hover:text-rb-white flex items-center gap-1 transition-colors"
            >
              Ver todo
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          {podium.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-small text-rb-500">
                El ranking se activa cuando empieza el torneo.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {podium.map((p, idx) => {
                const pos = (idx + 1) as 1 | 2 | 3;
                const isMe = p.id === currentUserId;
                const rankColor =
                  pos === 1
                    ? "text-rb-gold"
                    : pos === 2
                      ? "text-rb-silver"
                      : "text-rb-bronze";

                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex items-center gap-3 py-1.5 px-1 -mx-1 rounded-rb",
                      isMe && "bg-rb-red/5"
                    )}
                  >
                    <span
                      className={cn(
                        "font-display font-black text-base w-5 text-center leading-none tabular-nums",
                        rankColor
                      )}
                    >
                      {pos}
                    </span>
                    <Avatar
                      initials={getInitials(p.full_name ?? p.nickname ?? "??")}
                      src={p.avatar_url ?? undefined}
                      size="sm"
                      rank={pos}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-display font-bold text-[0.85rem] leading-none truncate",
                          isMe ? "text-rb-red" : "text-rb-white"
                        )}
                      >
                        {p.nickname ?? p.full_name ?? "Jugador"}
                        {isMe && (
                          <span className="text-rb-500 font-normal"> (tú)</span>
                        )}
                      </p>
                      <p className="text-[0.65rem] text-rb-500 mt-0.5 leading-none truncate">
                        {p.full_name?.split(" ")[0] ?? ""}
                      </p>
                    </div>
                    <span className="font-display font-bold text-rb-white tabular-nums text-small">
                      {p.total_points ?? 0}{" "}
                      <span className="text-rb-500 text-[0.65rem]">pts</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
