import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FlagIcon } from "@/components/match/FlagIcon";
import type { MatchWithTeams } from "@/types";

/**
 * FeaturedMatchCard — destaca el próximo partido relevante del Dashboard.
 *
 * Si no hay match (pre-fixture), muestra un fallback elegante con el
 * partido inaugural conocido (México vs Canadá · 11 Jun) usando country codes.
 *
 * - Logo de bandera grande para reforzar identidad
 * - "VS" tipografía masiva tipo ESPN
 * - Footer con fecha + sede + CTA directo a /partidos
 */
interface FeaturedMatchCardProps {
  match?: MatchWithTeams | null;
  /** Mensaje arriba del card (label) */
  context?: string;
}

interface FallbackMatch {
  home: { code: string; name: string };
  away: { code: string; name: string };
  date: string;
  time: string;
  stage: string;
  status: "upcoming" | "live" | "finished" | "locked";
}

const FALLBACK: FallbackMatch = {
  home: { code: "MX", name: "México" },
  away: { code: "CA", name: "Canadá" },
  date: "Jue 11 Jun",
  time: "14:00 hrs",
  stage: "Partido inaugural · Grupo A",
  status: "upcoming",
};

function formatMatchLine(iso: string): { date: string; time: string } {
  const fmt = new Intl.DateTimeFormat("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "America/Santiago",
  });
  const time = new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  }).format(new Date(iso));
  return { date: fmt.format(new Date(iso)), time: `${time} hrs` };
}

export function FeaturedMatchCard({
  match,
  context,
}: FeaturedMatchCardProps) {
  const data = match
    ? {
        home: {
          code: match.home_team.country_code,
          name: match.home_team.name,
        },
        away: {
          code: match.away_team.country_code,
          name: match.away_team.name,
        },
        ...formatMatchLine(match.match_time),
        stage: context ?? "Próximo partido",
        status: "upcoming" as const,
      }
    : { ...FALLBACK, ...(context ? { stage: context } : {}) };

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: "240ms" }}
    >
      <Card accent="red">
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="rb-label">{data.stage}</p>
            <Badge status={data.status} text="Abre pronto" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
              <FlagIcon countryCode={data.home.code} size="lg" />
              <span className="font-display font-bold text-rb-white text-[0.8rem] uppercase tracking-wide truncate max-w-full">
                {data.home.name}
              </span>
            </div>

            <div className="flex flex-col items-center min-w-[64px] flex-shrink-0">
              <span className="font-display font-black text-rb-700 text-xl tracking-widest leading-none">
                VS
              </span>
              <span className="rb-label mt-1.5">{data.date}</span>
              <span className="font-display font-bold text-rb-white text-small tabular-nums mt-0.5">
                {data.time}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1.5 flex-1 min-w-0">
              <FlagIcon countryCode={data.away.code} size="lg" />
              <span className="font-display font-bold text-rb-white text-[0.8rem] uppercase tracking-wide truncate max-w-full text-right">
                {data.away.name}
              </span>
            </div>
          </div>

          <Link
            href="/partidos"
            className="mt-4 w-full bg-rb-800/60 hover:bg-rb-800 border border-rb-700 text-rb-white font-display font-bold uppercase tracking-widest text-[0.7rem] py-2.5 rounded-rb inline-flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98]"
          >
            Ver fixture
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Card>
    </div>
  );
}
