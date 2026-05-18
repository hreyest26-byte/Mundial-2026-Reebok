import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/**
 * SpecialPicksCard — CTA primario del Dashboard.
 *
 * Muestra progreso visual (segmentos) + labels de cada categoría.
 * El CTA usa el rb-gradient signature como única instancia de gradient
 * en botones de la app — refuerza que ESTA es la acción principal.
 */
const CATEGORIES = [
  { key: "campeon", short: "Camp." },
  { key: "subcampeon", short: "Sub." },
  { key: "goleador", short: "Gol." },
  { key: "mvp", short: "MVP" },
  { key: "arquero", short: "Arq." },
] as const;

interface SpecialPicksCardProps {
  /** Cantidad de predicciones especiales ya guardadas (0-5) */
  filled: number;
  /** Total de slots (default 5) */
  total?: number;
  /** Href del CTA — default /predicciones */
  href?: string;
}

export function SpecialPicksCard({
  filled,
  total = 5,
  href = "/predicciones",
}: SpecialPicksCardProps) {
  const safeFilled = Math.max(0, Math.min(filled, total));
  const complete = safeFilled === total;
  const ctaLabel = complete
    ? "Revisar predicciones"
    : safeFilled === 0
      ? "Completar predicciones"
      : "Seguir completando";

  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: "180ms" }}
    >
      <Card accent="blue">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="min-w-0">
              <p
                className="rb-label"
                style={{ color: "var(--rb-blue,#003DA5)" }}
              >
                Predicciones del torneo
              </p>
              <p className="font-display font-bold text-rb-white text-h3 leading-tight mt-1">
                Tus picks especiales
              </p>
            </div>
            <p className="font-display font-black text-h2 text-rb-white tabular-nums leading-none flex-shrink-0">
              {safeFilled}
              <span className="text-rb-500">/{total}</span>
            </p>
          </div>

          {/* Progress segments */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-300",
                  i < safeFilled ? "bg-rb-blue" : "bg-rb-800"
                )}
              />
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1 text-center">
            {CATEGORIES.slice(0, total).map((c, i) => (
              <span
                key={c.key}
                className={cn(
                  "rb-label",
                  i < safeFilled && "text-rb-blue"
                )}
              >
                {c.short}
              </span>
            ))}
          </div>

          <Link
            href={href}
            className={cn(
              "mt-4 w-full font-display font-bold uppercase tracking-widest text-[0.75rem]",
              "py-3 rounded-rb inline-flex items-center justify-center gap-2",
              "transition-all duration-150 active:scale-[0.98]",
              "bg-[linear-gradient(135deg,#CC0000_0%,#003DA5_100%)] text-rb-white",
              "hover:opacity-90 shadow-rb-red"
            )}
          >
            {ctaLabel}
            <svg
              width="12"
              height="12"
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
