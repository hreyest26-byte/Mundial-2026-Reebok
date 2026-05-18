import { cn } from "@/lib/utils";
import {
  SoccerBall,
  FootballBoot,
  FootballJersey,
  WorldCupTrophy,
} from "@/components/brand/FootballIcons";

/**
 * BrandedPageHeader — header reusable para Partidos / Predicciones / Ranking / Perfil.
 *
 * Estructura:
 * - Sello "REEBOK" stamp arriba (rojo)
 * - Título italic uppercase masivo (signature deportivo)
 * - Subtitulo en label muted
 * - Imagery lateral (balón / botín / camiseta / trofeo) al 7% opacidad
 * - Banda lateral roja diagonal opcional
 *
 * Ejemplo:
 *   <BrandedPageHeader
 *     kicker="Reebok Sports"
 *     title="Partidos"
 *     subtitle="48 partidos · Cierre 10 min antes del pitazo"
 *     imagery="ball"
 *   />
 */
type Imagery = "ball" | "boot" | "jersey" | "trophy" | "none";

interface BrandedPageHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  imagery?: Imagery;
  className?: string;
}

export function BrandedPageHeader({
  kicker = "Reebok Sports",
  title,
  subtitle,
  imagery = "ball",
  className,
}: BrandedPageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden mb-5 pb-5 border-b border-rb-800",
        className
      )}
    >
      {/* Imagery lateral muy sutil */}
      {imagery !== "none" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.06]"
        >
          {imagery === "ball" && <SoccerBall size={170} color="#F5F4F0" />}
          {imagery === "boot" && <FootballBoot size={170} color="#F5F4F0" />}
          {imagery === "jersey" && <FootballJersey size={170} color="#F5F4F0" />}
          {imagery === "trophy" && <WorldCupTrophy size={170} color="#F5F4F0" />}
        </div>
      )}

      {/* Banda diagonal lateral — Reebok kit signature */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #CC0000 0 4px, transparent 4px 10px)",
        }}
      />

      <div className="relative pl-3 pt-1">
        <div className="inline-flex items-center gap-2 mb-2">
          <span
            className="inline-block px-1.5 py-0.5 font-display font-black text-[0.55rem] tracking-[0.25em] uppercase text-rb-white"
            style={{ backgroundColor: "#CC0000" }}
          >
            {kicker}
          </span>
        </div>

        <h1 className="font-display font-black text-rb-white uppercase italic leading-none text-h1 tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-small text-rb-500 mt-2 leading-tight max-w-[80%]">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
