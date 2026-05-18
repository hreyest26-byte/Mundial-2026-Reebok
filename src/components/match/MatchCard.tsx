"use client";

import { useState, useEffect } from "react";
import { FlagIcon } from "@/components/match/FlagIcon";
import { Badge } from "@/components/ui/Badge";
import { PredictionForm } from "@/components/match/PredictionForm";
import { cn } from "@/lib/utils";
import type { MatchWithTeams, Prediction } from "@/types";

type MatchStatus = "scheduled" | "live" | "halftime" | "finished" | "postponed";

const STAGE_LABELS: Record<string, string> = {
  group: "Fase de Grupos",
  round_of_32: "32avos de Final",
  round_of_16: "Octavos de Final",
  quarter: "Cuartos de Final",
  semi: "Semifinal",
  third_place: "Tercer Lugar",
  final: "Final",
};

function formatMatchDate(isoString: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Santiago",
  }).format(new Date(isoString));
}

function getBadgeStatus(
  status: MatchStatus,
  lockTime: string
): "live" | "upcoming" | "finished" | "locked" {
  if (status === "live" || status === "halftime") return "live";
  if (status === "finished") return "finished";
  if (status === "postponed") return "locked";
  if (new Date() >= new Date(lockTime)) return "locked";
  return "upcoming";
}

function formatTimeLeft(ms: number): { text: string; urgent: boolean } {
  if (ms <= 0) return { text: "Cerrado", urgent: true };
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;
  const urgent = totalMin < 30;
  if (days > 0) return { text: `${days}d ${hours}h`, urgent: false };
  if (hours > 0) return { text: `${hours}h ${mins}min`, urgent: totalMin < 60 };
  return { text: `${mins}min`, urgent };
}

function LockTimer({ lockTime }: { lockTime: string }) {
  const [ms, setMs] = useState(() => new Date(lockTime).getTime() - Date.now());

  useEffect(() => {
    const tick = () => setMs(new Date(lockTime).getTime() - Date.now());
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [lockTime]);

  if (ms <= 0) return null;

  const { text, urgent } = formatTimeLeft(ms);

  return (
    <div className={cn(
      "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-rb mx-4 mb-2",
      urgent
        ? "bg-rb-red/10 border border-rb-red/30"
        : "bg-rb-800/50 border border-rb-700/30"
    )}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className={cn(urgent ? "text-rb-red" : "text-rb-500", urgent && "animate-pulse-live")}
      >
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      <span className={cn(
        "font-display font-bold text-[0.65rem] uppercase tracking-wider",
        urgent ? "text-rb-red" : "text-rb-500"
      )}>
        Cierra en {text}
      </span>
    </div>
  );
}

/**
 * LiveBanner — barra superior pulsante "EN VIVO · MIN 73'" para partidos en curso.
 *
 * Si el match tiene `current_minute` lo muestra, sino solo "EN VIVO".
 * Si está en halftime, muestra "ENTRETIEMPO".
 */
function LiveBanner({
  status,
  currentMinute,
  lastEvent,
  lastEventAt,
}: {
  status: "live" | "halftime";
  currentMinute?: number | null;
  lastEvent?: string | null;
  lastEventAt?: string | null;
}) {
  const isHalftime = status === "halftime";
  // Animación del último evento — destacar si fue hace <30 segundos
  const eventIsFresh =
    lastEventAt && Date.now() - new Date(lastEventAt).getTime() < 30_000;

  return (
    <div className="relative bg-rb-red text-rb-white">
      <div className="flex items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rb-white animate-pulse-live" />
          <span className="font-display font-black italic text-[0.65rem] tracking-[0.25em] uppercase">
            {isHalftime ? "Entretiempo" : "En vivo"}
          </span>
        </div>
        {!isHalftime && typeof currentMinute === "number" && (
          <span className="font-display font-black tabular-nums text-[0.7rem]">
            {currentMinute}&apos;
          </span>
        )}
      </div>
      {lastEvent && (
        <div
          className={cn(
            "px-4 py-1 border-t border-rb-white/20 text-[0.7rem]",
            "font-display font-bold uppercase tracking-wider",
            eventIsFresh && "animate-pulse-live"
          )}
        >
          <span className="opacity-80">Última jugada · </span>
          {lastEvent}
        </div>
      )}
    </div>
  );
}

// Extiende el tipo MatchWithTeams para soportar los campos opcionales LIVE
type MatchWithLive = MatchWithTeams & {
  current_minute?: number | null;
  last_event?: string | null;
  last_event_at?: string | null;
};

interface MatchCardProps {
  match: MatchWithLive;
  prediction?: Pick<
    Prediction,
    "predicted_home" | "predicted_away" | "points_earned" | "is_exact" | "is_correct_result"
  > | null;
}

/**
 * MatchCard v2.3 — LIVE state premium.
 *
 * Vs v2.2:
 * - LiveBanner full-width arriba con "EN VIVO · 73'" pulsante
 * - Score box con glow rojo cuando LIVE
 * - Último evento ("⚽ GOL Argentina") con animación pulse si es reciente
 * - Banda diagonal lateral roja se mantiene en LIVE
 */
export function MatchCard({ match, prediction }: MatchCardProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [savedPrediction, setSavedPrediction] = useState<
    { home: number; away: number } | null
  >(
    prediction
      ? { home: prediction.predicted_home, away: prediction.predicted_away }
      : null
  );

  const badgeStatus = getBadgeStatus(match.status as MatchStatus, match.lock_time);
  const isOpen = match.status === "scheduled" && new Date() < new Date(match.lock_time);
  const isFinished = match.status === "finished";
  const isLive = match.status === "live" || match.status === "halftime";

  function handleSaved(home: number, away: number) {
    setSavedPrediction({ home, away });
    setFormOpen(false);
  }

  return (
    <article
      className={cn(
        "rb-card rounded-rb overflow-hidden transition-all duration-200 relative",
        isLive && "shadow-rb-red"
      )}
    >
      {/* Banner LIVE full-width al tope */}
      {isLive && (
        <LiveBanner
          status={match.status as "live" | "halftime"}
          currentMinute={match.current_minute}
          lastEvent={match.last_event}
          lastEventAt={match.last_event_at}
        />
      )}

      {/* Banda diagonal lateral roja para partidos LIVE */}
      {isLive && (
        <div
          aria-hidden
          className="absolute left-0 top-12 bottom-2 w-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #CC0000 0 4px, transparent 4px 10px)",
          }}
        />
      )}

      {/* Header — Reebok stamp + stage + status */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block px-1.5 py-0.5 font-display font-black text-[0.5rem] tracking-[0.2em] uppercase text-rb-white flex-shrink-0"
            style={{ backgroundColor: "#CC0000" }}
          >
            Reebok
          </span>
          <span className="rb-label text-rb-500 truncate">
            {STAGE_LABELS[match.stage] ?? match.stage}
            {match.group_name && (
              <span className="text-rb-700"> · Grupo {match.group_name}</span>
            )}
          </span>
        </div>
        {!isLive && <Badge status={badgeStatus} />}
      </div>

      {/* Teams + score con flags grandes */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between gap-3">
          <TeamBlock
            name={match.home_team.name}
            countryCode={match.home_team.country_code}
            align="left"
          />

          <div className="flex flex-col items-center flex-shrink-0 min-w-[68px]">
            {isFinished || isLive ? (
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-rb transition-all",
                  isLive && "bg-rb-red/15 border border-rb-red/40 shadow-rb-red"
                )}
              >
                <span
                  className={cn(
                    "font-display font-black text-[2.25rem] leading-none tabular-nums",
                    isLive ? "text-rb-white" : "text-rb-white"
                  )}
                >
                  {match.home_score ?? 0}
                </span>
                <span className="font-display font-black text-rb-700 text-xl leading-none">–</span>
                <span
                  className={cn(
                    "font-display font-black text-[2.25rem] leading-none tabular-nums",
                    isLive ? "text-rb-white" : "text-rb-white"
                  )}
                >
                  {match.away_score ?? 0}
                </span>
              </div>
            ) : (
              <span className="font-display font-black italic text-rb-700 text-2xl tracking-widest">
                VS
              </span>
            )}
          </div>

          <TeamBlock
            name={match.away_team.name}
            countryCode={match.away_team.country_code}
            align="right"
          />
        </div>

        <p className="text-center text-small text-rb-500 mt-2 leading-none">
          {isLive ? (
            <span className="font-display font-bold uppercase tracking-wide text-rb-red animate-pulse-live">
              Transmitiéndose ahora
            </span>
          ) : (
            <>
              {formatMatchDate(match.match_time)}
              {match.venue && (
                <span className="text-rb-700"> · {match.venue.split(",")[0]}</span>
              )}
            </>
          )}
        </p>
      </div>

      {isOpen && <LockTimer lockTime={match.lock_time} />}

      {/* Tu pick — destacado con accent según resultado */}
      {savedPrediction && (
        <div
          className={cn(
            "mx-4 mb-3 px-3 py-2 rounded-rb flex items-center justify-between",
            isFinished && prediction?.is_exact
              ? "bg-rb-gold/10 border border-rb-gold/30"
              : isFinished && prediction?.is_correct_result
                ? "bg-rb-blue/10 border border-rb-blue/30"
                : isLive
                  ? "bg-rb-red/5 border border-rb-red/20"
                  : "bg-rb-800/60 border border-rb-700/40"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-display font-black italic text-[0.55rem] tracking-[0.2em] uppercase text-rb-500">
              Tu pick
            </span>
            <span className="font-display font-bold text-rb-white tabular-nums">
              {savedPrediction.home} – {savedPrediction.away}
            </span>
            {isLive && match.home_score !== null && match.away_score !== null && (
              <PickVsLive
                pickHome={savedPrediction.home}
                pickAway={savedPrediction.away}
                liveHome={match.home_score ?? 0}
                liveAway={match.away_score ?? 0}
              />
            )}
          </div>
          {isFinished && prediction && (
            <div className="flex items-center gap-2">
              {prediction.is_exact ? (
                <Badge status="exact" />
              ) : prediction.is_correct_result ? (
                <Badge status="saved" text="Resultado ✓" />
              ) : (
                <span className="rb-label text-rb-500">+0 pts</span>
              )}
              {prediction.points_earned > 0 && (
                <span className="font-display font-bold text-rb-gold text-sm tabular-nums">
                  +{prediction.points_earned}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Form expandable */}
      {isOpen && (
        <>
          {!formOpen && (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className={cn(
                "w-full px-4 py-3 text-left border-t border-rb-800",
                "flex items-center justify-between",
                "hover:bg-rb-800/40 transition-colors duration-150 active:scale-[0.99]"
              )}
            >
              <span className="font-display font-black italic uppercase tracking-wider text-[0.7rem] text-rb-white">
                {savedPrediction ? "Cambiar predicción" : "Hacer predicción"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="rb-label text-rb-red">Tap</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-rb-red"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
          )}

          {formOpen && (
            <div className="px-4 pb-4 pt-3 border-t border-rb-800 space-y-3 bg-rb-black/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block px-1.5 py-0.5 font-display font-black text-[0.5rem] tracking-[0.2em] uppercase text-rb-white"
                    style={{ backgroundColor: "#CC0000" }}
                  >
                    Tu pick
                  </span>
                  <span className="rb-label">Marcador final</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="text-rb-700 hover:text-rb-500 transition-colors p-1"
                  aria-label="Cerrar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <PredictionForm
                matchId={match.id}
                lockTime={match.lock_time}
                homeName={match.home_team.name}
                awayName={match.away_team.name}
                initialHome={savedPrediction?.home}
                initialAway={savedPrediction?.away}
                onSaved={handleSaved}
              />
            </div>
          )}
        </>
      )}

      {!isOpen && !isFinished && !isLive && !savedPrediction && (
        <div className="px-4 pb-3 border-t border-rb-800 pt-2">
          <p className="text-center text-small text-rb-700 italic">
            Sin predicción · Cerrado
          </p>
        </div>
      )}
    </article>
  );
}

/**
 * PickVsLive — indicador visual de si tu pick va acertando o no LIVE.
 *
 * - 🎯 dorado si vas exacto
 * - ✓ azul si vas con resultado correcto (mismo ganador / empate)
 * - ✗ gris si vas para perderlo
 */
function PickVsLive({
  pickHome,
  pickAway,
  liveHome,
  liveAway,
}: {
  pickHome: number;
  pickAway: number;
  liveHome: number;
  liveAway: number;
}) {
  const isExact = pickHome === liveHome && pickAway === liveAway;
  const pickWinner =
    pickHome > pickAway ? "home" : pickHome < pickAway ? "away" : "draw";
  const liveWinner =
    liveHome > liveAway ? "home" : liveHome < liveAway ? "away" : "draw";
  const correctResult = pickWinner === liveWinner;

  if (isExact) {
    return (
      <span className="font-display font-bold text-rb-gold text-[0.65rem] uppercase tracking-wider animate-pulse-live">
        ¡Exacto!
      </span>
    );
  }
  if (correctResult) {
    return (
      <span className="font-display font-bold text-rb-blue text-[0.65rem] uppercase tracking-wider">
        Vas bien
      </span>
    );
  }
  return (
    <span className="font-display font-bold text-rb-500 text-[0.65rem] uppercase tracking-wider">
      Vas perdiéndolo
    </span>
  );
}

function TeamBlock({
  name,
  countryCode,
  align,
}: {
  name: string;
  countryCode: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 flex-1 min-w-0",
        align === "left" ? "items-start" : "items-end"
      )}
    >
      <FlagIcon countryCode={countryCode} size="lg" />
      <span
        className={cn(
          "font-display font-bold text-rb-white text-[0.8rem] uppercase tracking-wide leading-tight truncate max-w-full",
          align === "right" && "text-right"
        )}
      >
        {name}
      </span>
    </div>
  );
}
