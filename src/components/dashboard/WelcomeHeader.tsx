import { Avatar } from "@/components/ui/Avatar";
import { getInitials } from "@/lib/utils";

/**
 * WelcomeHeader v2.1 — saludo con jersey number plate.
 *
 * - Avatar con ring de oro/plata/bronce si está en el podio
 * - Saludo personalizado (nickname preferido)
 * - "Jersey number plate" a la derecha — la posición tratada como número
 *   de camiseta de fútbol Reebok: bloque colorido, número condensado,
 *   con label "POS" arriba estilo dorsal
 */
interface WelcomeHeaderProps {
  fullName: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  rankPosition: number | null;
}

export function WelcomeHeader({
  fullName,
  nickname,
  avatarUrl,
  rankPosition,
}: WelcomeHeaderProps) {
  const display = nickname ?? fullName ?? "Jugador";
  const showRank = rankPosition && rankPosition > 0;
  const rankProp =
    rankPosition === 1
      ? (1 as const)
      : rankPosition === 2
        ? (2 as const)
        : rankPosition === 3
          ? (3 as const)
          : undefined;

  const plateBg =
    rankPosition === 1
      ? "bg-rb-gold text-rb-black"
      : rankPosition === 2
        ? "bg-rb-silver text-rb-black"
        : rankPosition === 3
          ? "bg-rb-bronze text-rb-white"
          : "bg-rb-800 text-rb-500 border border-rb-700";

  return (
    <section
      className="flex items-center justify-between gap-4 animate-slide-up"
      style={{ animationDelay: "0ms" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar
          src={avatarUrl ?? undefined}
          initials={getInitials(fullName ?? display)}
          size="md"
          rank={rankProp}
        />
        <div className="min-w-0">
          <p className="rb-label">Hola de vuelta</p>
          <h1 className="font-display font-bold text-h3 text-rb-white leading-none mt-1 truncate">
            {display}
          </h1>
        </div>
      </div>

      <div className="flex-shrink-0 text-center">
        <p className="rb-label mb-1">Pos</p>
        <div
          className={`${plateBg} font-display font-black leading-none tabular-nums rounded-rb px-2.5 py-1.5 min-w-[44px]`}
        >
          <span className="text-h3">{showRank ? rankPosition : "—"}</span>
        </div>
      </div>
    </section>
  );
}
