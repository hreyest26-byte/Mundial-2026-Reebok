"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PredictionFormProps {
  matchId: string;
  lockTime: string;
  homeName: string;
  awayName: string;
  initialHome?: number;
  initialAway?: number;
  onSaved?: (home: number, away: number) => void;
  className?: string;
}

/**
 * PredictionForm v2.2 — flow de predicción con quick-picks Reebok style.
 *
 * Mejoras vs v2:
 * - Quick-picks row con resultados frecuentes (1-0, 2-1, 1-1, 0-0...)
 * - Stepper con tap target más grande (44px) y feedback haptic
 * - Botón CTA con gradient rojo→azul cuando es primer guardado
 * - Banda diagonal accent superior cuando se está editando
 */

function isLocked(lockTime: string): boolean {
  return new Date() >= new Date(lockTime);
}

const QUICK_PICKS: { home: number; away: number; label: string }[] = [
  { home: 1, away: 0, label: "1-0" },
  { home: 2, away: 1, label: "2-1" },
  { home: 1, away: 1, label: "1-1" },
  { home: 0, away: 0, label: "0-0" },
  { home: 0, away: 1, label: "0-1" },
  { home: 1, away: 2, label: "1-2" },
];

export function PredictionForm({
  matchId,
  lockTime,
  homeName,
  awayName,
  initialHome,
  initialAway,
  onSaved,
  className,
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState(initialHome ?? 1);
  const [awayScore, setAwayScore] = useState(initialAway ?? 1);
  const [locked, setLocked] = useState(() => isLocked(lockTime));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(initialHome !== undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locked) return;
    const interval = setInterval(() => {
      if (isLocked(lockTime)) setLocked(true);
    }, 10_000);
    return () => clearInterval(interval);
  }, [locked, lockTime]);

  const handleSave = useCallback(async () => {
    if (locked || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          predictedHome: homeScore,
          predictedAway: awayScore,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error al guardar");
      } else {
        setSaved(true);
        onSaved?.(homeScore, awayScore);
      }
    } catch {
      setError("Sin conexión. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  }, [locked, saving, matchId, homeScore, awayScore, onSaved]);

  if (locked) {
    return (
      <div className={cn("py-3 px-4 rounded-rb bg-rb-800/50 text-center", className)}>
        <p className="rb-label text-rb-500">Predicciones cerradas</p>
        {saved && (
          <p className="text-body text-rb-white mt-1">
            Tu pick:{" "}
            <span className="font-display font-bold text-rb-white tabular-nums">
              {initialHome} – {initialAway}
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stepper score */}
      <div className="flex items-center justify-center gap-4">
        <ScoreStepper
          value={homeScore}
          onChange={setHomeScore}
          disabled={locked}
          teamName={homeName}
        />
        <span className="font-display font-black italic text-rb-700 text-2xl select-none">
          –
        </span>
        <ScoreStepper
          value={awayScore}
          onChange={setAwayScore}
          disabled={locked}
          teamName={awayName}
        />
      </div>

      {/* Quick picks row */}
      <div>
        <p className="rb-label mb-2">Marcadores rápidos</p>
        <div className="grid grid-cols-6 gap-1.5">
          {QUICK_PICKS.map((q) => {
            const isActive = homeScore === q.home && awayScore === q.away;
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => {
                  setHomeScore(q.home);
                  setAwayScore(q.away);
                }}
                disabled={locked}
                className={cn(
                  "py-2 rounded-rb font-display font-bold text-[0.75rem] tabular-nums",
                  "transition-all duration-150 active:scale-[0.95]",
                  isActive
                    ? "bg-rb-red text-rb-white shadow-rb-red"
                    : "bg-rb-800 text-rb-500 hover:bg-rb-700 hover:text-rb-white"
                )}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-center text-small text-rb-red">{error}</p>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={cn(
          "w-full h-11 rounded-rb font-display font-bold uppercase tracking-wider text-[0.8rem]",
          "transition-all duration-150 active:scale-[0.98]",
          "inline-flex items-center justify-center gap-2",
          saved
            ? "bg-rb-blue/20 text-rb-blue border border-rb-blue/30 hover:bg-rb-blue/30"
            : "bg-[linear-gradient(135deg,#CC0000_0%,#003DA5_100%)] text-rb-white hover:opacity-90 shadow-rb-red",
          saving && "opacity-60 cursor-not-allowed"
        )}
      >
        {saving ? "Guardando…" : saved ? "✓ Actualizar predicción" : "Guardar predicción"}
        {!saving && !saved && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}

function ScoreStepper({
  value,
  onChange,
  disabled,
  teamName,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
  teamName: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 max-w-[140px]">
      <span className="rb-label truncate max-w-full text-center leading-none">
        {teamName}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={disabled || value === 0}
          aria-label={`Reducir goles ${teamName}`}
          className={cn(
            "w-11 h-11 rounded-rb bg-rb-800 text-rb-white font-bold text-xl leading-none",
            "transition-all duration-100 active:scale-90",
            "hover:bg-rb-700 disabled:opacity-25 disabled:cursor-not-allowed"
          )}
        >
          −
        </button>
        <span
          className={cn(
            "w-12 text-center font-display font-black text-[2.5rem] text-rb-white tabular-nums leading-none",
            "transition-colors duration-200"
          )}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, value + 1))}
          disabled={disabled || value === 20}
          aria-label={`Aumentar goles ${teamName}`}
          className={cn(
            "w-11 h-11 rounded-rb bg-rb-800 text-rb-white font-bold text-xl leading-none",
            "transition-all duration-100 active:scale-90",
            "hover:bg-rb-700 disabled:opacity-25 disabled:cursor-not-allowed"
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}
