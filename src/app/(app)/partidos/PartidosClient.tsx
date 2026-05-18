"use client";

import { useState, useMemo } from "react";
import { MatchCard } from "@/components/match/MatchCard";
import { cn } from "@/lib/utils";
import type { MatchWithTeams, Prediction } from "@/types";

type PredictionMap = Record<
  string,
  Pick<Prediction, "predicted_home" | "predicted_away" | "points_earned" | "is_exact" | "is_correct_result">
>;

interface PartidosClientProps {
  matches: MatchWithTeams[];
  predictions: PredictionMap;
}

const STAGE_ORDER = [
  "group",
  "round_of_32",
  "round_of_16",
  "quarter",
  "semi",
  "third_place",
  "final",
] as const;

const STAGE_LABELS: Record<string, string> = {
  group: "Grupos",
  round_of_32: "32avos",
  round_of_16: "Octavos",
  quarter: "Cuartos",
  semi: "Semi",
  third_place: "3° Lugar",
  final: "Final",
};

export function PartidosClient({ matches, predictions }: PartidosClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  const { groupFilters, stageFilters } = useMemo(() => {
    const groups = new Set<string>();
    const stages = new Set<string>();
    for (const m of matches) {
      if (m.stage === "group" && m.group_name) groups.add(m.group_name);
      else stages.add(m.stage);
    }
    return {
      groupFilters: [...groups].sort(),
      stageFilters: STAGE_ORDER.filter((s) => stages.has(s)),
    };
  }, [matches]);

  const filtered = useMemo(() => {
    if (activeFilter === "todos") return matches;
    const match = matches.filter((m) => {
      if (m.stage === "group") return m.group_name === activeFilter;
      return m.stage === activeFilter;
    });
    return match;
  }, [matches, activeFilter]);

  const hasGroupFilters = groupFilters.length > 0;
  const hasStageFilters = stageFilters.length > 0;

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
        <div className="flex gap-1.5 pb-1 min-w-max">
          <FilterTab
            label="Todos"
            active={activeFilter === "todos"}
            onClick={() => setActiveFilter("todos")}
          />
          {hasGroupFilters && (
            <>
              <div className="w-px bg-rb-800 mx-1 self-stretch" />
              {groupFilters.map((g) => (
                <FilterTab
                  key={g}
                  label={`Grupo ${g}`}
                  active={activeFilter === g}
                  onClick={() => setActiveFilter(g)}
                />
              ))}
            </>
          )}
          {hasStageFilters && (
            <>
              <div className="w-px bg-rb-800 mx-1 self-stretch" />
              {stageFilters.map((s) => (
                <FilterTab
                  key={s}
                  label={STAGE_LABELS[s] ?? s}
                  active={activeFilter === s}
                  onClick={() => setActiveFilter(s)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Match list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <span className="text-5xl">⚽</span>
          <p className="font-display font-bold text-rb-white">Sin partidos</p>
          <p className="text-body text-rb-500">
            No hay partidos en esta categoría todavía.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions[match.id] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-rb font-display font-bold uppercase text-[0.65rem] tracking-wider",
        "transition-all duration-150 whitespace-nowrap",
        active
          ? "bg-rb-red text-white"
          : "bg-rb-800 text-rb-500 hover:text-rb-white hover:bg-rb-700"
      )}
    >
      {label}
    </button>
  );
}
