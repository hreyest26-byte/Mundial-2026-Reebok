"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Team } from "@/types";

type PredType = "champion" | "runner_up" | "top_scorer" | "mvp" | "best_goalkeeper";

interface TorneoSaved {
  champion?: string;
  runner_up?: string;
  top_scorer?: string;
  mvp?: string;
  best_goalkeeper?: string;
}

interface TorneoFormProps {
  teams: Pick<Team, "id" | "name" | "country_code">[];
  saved: TorneoSaved;
  lockTime: string;
}

const LOCK_TIME = "2026-06-12T21:50:00Z";

const FIELDS: { key: PredType; label: string; icon: string; type: "team" | "player" }[] = [
  { key: "champion",       label: "Campeón",        icon: "🏆", type: "team" },
  { key: "runner_up",      label: "Subcampeón",     icon: "🥈", type: "team" },
  { key: "top_scorer",     label: "Goleador",       icon: "⚽", type: "player" },
  { key: "mvp",            label: "MVP",            icon: "⭐", type: "player" },
  { key: "best_goalkeeper",label: "Mejor Arquero",  icon: "🧤", type: "player" },
];

export function TorneoForm({ teams, saved }: TorneoFormProps) {
  const locked = new Date() >= new Date(LOCK_TIME);

  const [values, setValues] = useState<Record<PredType, string>>({
    champion:        saved.champion ?? "",
    runner_up:       saved.runner_up ?? "",
    top_scorer:      saved.top_scorer ?? "",
    mvp:             saved.mvp ?? "",
    best_goalkeeper: saved.best_goalkeeper ?? "",
  });

  const [saving, setSaving] = useState<PredType | null>(null);
  const [savedKeys, setSavedKeys] = useState<Set<PredType>>(
    new Set(Object.keys(saved).filter(k => saved[k as PredType]) as PredType[])
  );
  const [errors, setErrors] = useState<Partial<Record<PredType, string>>>({});

  const handleSave = useCallback(async (key: PredType, type: "team" | "player") => {
    const value = values[key].trim();
    if (!value) return;
    setSaving(key);
    setErrors(prev => ({ ...prev, [key]: undefined }));

    try {
      const body: Record<string, string> = { predictionType: key };
      if (type === "team") body.teamId = value;
      else body.playerName = value;

      const res = await fetch("/api/torneo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(prev => ({ ...prev, [key]: data.error ?? "Error al guardar" }));
      } else {
        setSavedKeys(prev => new Set([...prev, key]));
      }
    } catch {
      setErrors(prev => ({ ...prev, [key]: "Sin conexión" }));
    } finally {
      setSaving(null);
    }
  }, [values]);

  return (
    <div className="space-y-3">
      {locked && (
        <div className="rb-card rounded-rb px-4 py-3 border-rb-red/30 bg-rb-red/5 text-center">
          <p className="rb-label text-rb-red">Predicciones de torneo cerradas</p>
        </div>
      )}

      {!locked && (
        <p className="text-small text-rb-500">
          Cierra el 12 Jun · antes del primer partido
        </p>
      )}

      {FIELDS.map(({ key, label, icon, type }) => {
        const isSaved = savedKeys.has(key);
        const isSaving = saving === key;
        const error = errors[key];
        const value = values[key];

        return (
          <div key={key} className="rb-card rounded-rb p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="font-display font-bold text-rb-white text-[0.85rem] uppercase tracking-wide">
                {label}
              </span>
              {isSaved && (
                <span className="ml-auto rb-label text-rb-blue">✓ Guardado</span>
              )}
            </div>

            {type === "team" ? (
              <select
                value={value}
                onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
                disabled={locked}
                className={cn(
                  "w-full h-10 px-3 rounded-rb text-[0.85rem] font-body",
                  "bg-rb-800 border border-rb-700 text-rb-white",
                  "focus:outline-none focus:border-rb-red",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <option value="">— Selecciona un equipo —</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={value}
                onChange={e => setValues(prev => ({ ...prev, [key]: e.target.value }))}
                disabled={locked}
                placeholder={`Nombre del ${label.toLowerCase()}`}
                className={cn(
                  "w-full h-10 px-3 rounded-rb text-[0.85rem] font-body",
                  "bg-rb-800 border border-rb-700 text-rb-white placeholder:text-rb-500",
                  "focus:outline-none focus:border-rb-red",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            )}

            {error && <p className="text-small text-rb-red">{error}</p>}

            {!locked && (
              <button
                type="button"
                onClick={() => handleSave(key, type)}
                disabled={isSaving || !value}
                className={cn(
                  "w-full h-10 rounded-rb font-display font-bold uppercase tracking-wider text-[0.75rem]",
                  "transition-all duration-150 active:scale-[0.98]",
                  isSaved
                    ? "bg-rb-blue/20 text-rb-blue border border-rb-blue/30 hover:bg-rb-blue/30"
                    : "bg-rb-red text-white hover:bg-rb-red/90",
                  (isSaving || !value) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSaving ? "Guardando…" : isSaved ? "✓ Actualizar" : "Guardar"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
