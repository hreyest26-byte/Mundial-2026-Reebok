import { cn } from "@/lib/utils";

/**
 * FootballIcons — set de ornamentos visuales reutilizables para reforzar
 * la identidad "Reebok Football" en headers, side accents y empty states.
 *
 * Todos son SVG inline, mono-color (heredan currentColor o aceptan prop),
 * decorativos por default (aria-hidden) y stroke-based para mantenerse
 * crisp en cualquier tamaño.
 */

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

/** Balón clásico de fútbol — pentágonos black & white style */
export function SoccerBall({ size = 32, className, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn("flex-shrink-0", className)}
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="2.5" />
      {/* Pentágono central */}
      <path
        d="M32 20 L41 26 L37.5 36 L26.5 36 L23 26 Z"
        fill={color}
      />
      {/* Líneas que conectan a los bordes */}
      <line x1="32" y1="20" x2="32" y2="6" stroke={color} strokeWidth="2" />
      <line x1="41" y1="26" x2="54" y2="22" stroke={color} strokeWidth="2" />
      <line x1="37.5" y1="36" x2="48" y2="50" stroke={color} strokeWidth="2" />
      <line x1="26.5" y1="36" x2="16" y2="50" stroke={color} strokeWidth="2" />
      <line x1="23" y1="26" x2="10" y2="22" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/** Botín de fútbol con tacos */
export function FootballBoot({ size = 36, className, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn("flex-shrink-0", className)}
      aria-hidden
    >
      {/* Cuerpo del botín */}
      <path
        d="M8 38 C 8 32, 14 28, 24 28 L 42 28 C 52 28, 58 32, 58 38 L 58 44 L 8 44 Z"
        fill={color}
      />
      {/* Cordones marcados */}
      <path d="M22 28 L 22 38" stroke="#0D0D0D" strokeWidth="1.5" opacity="0.6" />
      <path d="M28 28 L 28 38" stroke="#0D0D0D" strokeWidth="1.5" opacity="0.6" />
      <path d="M34 28 L 34 38" stroke="#0D0D0D" strokeWidth="1.5" opacity="0.6" />
      {/* Suela con tacos */}
      <rect x="8" y="44" width="50" height="4" fill={color} opacity="0.7" />
      <circle cx="14" cy="50" r="2" fill={color} />
      <circle cx="24" cy="50" r="2" fill={color} />
      <circle cx="34" cy="50" r="2" fill={color} />
      <circle cx="44" cy="50" r="2" fill={color} />
      <circle cx="54" cy="50" r="2" fill={color} />
    </svg>
  );
}

/** Silueta de camiseta de fútbol con franja diagonal Reebok */
export function FootballJersey({ size = 36, className, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn("flex-shrink-0", className)}
      aria-hidden
    >
      {/* Cuerpo de la camiseta */}
      <path
        d="M16 16 L 24 8 L 40 8 L 48 16 L 56 22 L 50 30 L 44 24 L 44 56 L 20 56 L 20 24 L 14 30 L 8 22 Z"
        fill={color}
      />
      {/* Cuello */}
      <path
        d="M24 8 L 32 16 L 40 8"
        stroke="#0D0D0D"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      {/* Franja diagonal estilo Reebok 90s */}
      <path
        d="M20 28 L 44 48"
        stroke="#0D0D0D"
        strokeWidth="3"
        opacity="0.5"
      />
    </svg>
  );
}

/** Trofeo Mundial — copa estilizada */
export function WorldCupTrophy({ size = 32, className, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={cn("flex-shrink-0", className)}
      aria-hidden
    >
      {/* Base */}
      <rect x="20" y="52" width="24" height="6" fill={color} />
      <rect x="24" y="46" width="16" height="6" fill={color} />
      {/* Cuerpo de la copa */}
      <path d="M22 18 L 22 38 Q 32 46, 42 38 L 42 18 Z" fill={color} />
      {/* Asas */}
      <path
        d="M22 22 Q 14 22, 14 28 Q 14 34, 22 32"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M42 22 Q 50 22, 50 28 Q 50 34, 42 32"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      {/* Top */}
      <rect x="20" y="14" width="24" height="4" fill={color} />
      {/* Estrella superior */}
      <path
        d="M32 4 L 34 9 L 39 9 L 35 12 L 36.5 17 L 32 14 L 27.5 17 L 29 12 L 25 9 L 30 9 Z"
        fill={color}
      />
    </svg>
  );
}

/** Patrón Vector Reebok — repetición de chevrons diagonales */
export function VectorPattern({
  className,
  color = "#CC0000",
  opacity = 0.06,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{
        backgroundImage: `
          repeating-linear-gradient(135deg,
            ${color} 0 6px,
            transparent 6px 24px
          )`,
        opacity,
      }}
    />
  );
}

/** Banda diagonal Reebok (kit signature stripes) */
export function DiagonalStripes({
  className,
  color = "#CC0000",
  vertical = true,
}: {
  className?: string;
  color?: string;
  vertical?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{
        backgroundImage: `repeating-linear-gradient(${vertical ? 135 : 90}deg, ${color} 0 6px, transparent 6px 12px)`,
      }}
    />
  );
}

/**
 * BrandSidePattern — wrapper para colocar ornamentos decorativos en los
 * laterales de cards/headers. Renderiza un fondo con un patrón sutil
 * + un ícono de fútbol opcional muy tenue.
 */
export function BrandSidePattern({
  variant = "ball",
  side = "right",
  className,
}: {
  variant?: "ball" | "boot" | "jersey" | "trophy";
  side?: "left" | "right";
  className?: string;
}) {
  const Icon =
    variant === "boot"
      ? FootballBoot
      : variant === "jersey"
        ? FootballJersey
        : variant === "trophy"
          ? WorldCupTrophy
          : SoccerBall;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-[0.07]",
        side === "right" ? "-right-6" : "-left-6",
        className
      )}
    >
      <Icon size={140} color="#F5F4F0" />
    </div>
  );
}
