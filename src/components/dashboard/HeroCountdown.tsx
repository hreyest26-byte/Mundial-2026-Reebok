import { Countdown } from "@/components/ui/Countdown";
import { Badge } from "@/components/ui/Badge";

/**
 * HeroCountdown v2.1 — protagonista del Dashboard con identidad Reebok fuerte.
 *
 * Decisiones de diseño:
 * - Borde superior con gradient rojo→azul (signature Reebok 90s)
 * - Watermark del símbolo Vector al 8% de opacidad (más prominente que antes)
 * - Sello "REEBOK PRESENTS" arriba — retro stamp tipo cartel deportivo 90s
 * - Diagonal stripes lateral izquierdo — patrón de kit de fútbol Reebok
 * - Tipografía masiva con tabular-nums para que los números no "bailen"
 * - Footnote "EST. 1958" reforzando heritage
 */
interface HeroCountdownProps {
  targetDate: Date;
  label?: string;
  venueLabel?: string;
  matchTypeLabel?: string;
}

export function HeroCountdown({
  targetDate,
  label = "El torneo empieza en",
  venueLabel = "11 Jun · MEX / USA / CAN",
  matchTypeLabel = "Inauguración",
}: HeroCountdownProps) {
  return (
    <section
      className="rb-card relative overflow-hidden animate-slide-up"
      style={{
        ["--card-accent-gradient" as never]:
          "linear-gradient(90deg,#CC0000 0%,#CC0000 30%,#003DA5 70%,#003DA5 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-1.5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #CC0000 0 6px, transparent 6px 12px)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -bottom-12 opacity-[0.08]"
      >
        <svg width="240" height="240" viewBox="0 0 100 100" fill="none">
          <path d="M5 8 L62 8 L95 48 L38 48 Z" fill="#F5F4F0" />
          <path
            d="M5 52 L62 52 L95 92 L38 92 Z"
            fill="#F5F4F0"
            opacity="0.65"
          />
        </svg>
      </div>

      <div className="relative pl-6 pr-5 pt-4 pb-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span
              className="inline-block px-2 py-0.5 font-display font-black text-[0.55rem] tracking-[0.25em] uppercase text-rb-white"
              style={{ backgroundColor: "#CC0000" }}
            >
              Reebok presents
            </span>
            <span className="font-display font-bold text-[0.6rem] uppercase tracking-[0.2em] text-rb-500">
              FIFA World Cup 2026
            </span>
          </div>
          <Badge status="upcoming" text="Falta poco" />
        </div>

        <p className="font-display font-black text-rb-white text-h3 uppercase tracking-tight leading-none italic">
          {label}
        </p>

        <Countdown targetDate={targetDate} />

        <div className="flex items-center justify-between pt-3 border-t border-rb-800/70">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rb-red animate-pulse-live" />
            <p className="rb-label">{venueLabel}</p>
          </div>
          <p className="rb-label flex items-center gap-1.5">
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
              <path d="M5 12l5 5L20 7" />
            </svg>
            {matchTypeLabel}
          </p>
        </div>

        <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-rb-700 pt-1">
          Reebok · Est. 1958 · Football Pool Internal Edition
        </p>
      </div>
    </section>
  );
}
