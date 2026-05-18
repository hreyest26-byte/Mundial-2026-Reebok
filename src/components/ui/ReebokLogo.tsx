"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ReebokLogo — uses the OFFICIAL Reebok logo (Delta wordmark, 2014+).
 *
 * El archivo PNG vive en /public/brand/. Hay 3 variantes:
 *   - reebok-logo-white.png  (sobre dark mode, default)
 *   - reebok-logo-red.png    (acento sobre fondo neutro)
 *   - reebok-logo-black.png  (sobre fondo claro)
 *
 * La API se mantiene compatible con la versión anterior:
 * - ReebokWordmark, ReebokVector, ReebokFullLockup, ReebokSymbol
 * - todas usan la misma imagen oficial en lugar de SVG synthetic
 */

const LOGO_RATIO = 374 / 210; // ancho/alto del PNG oficial

const VARIANT_SRC: Record<"white" | "red" | "black", string> = {
  white: "/brand/reebok-logo-white.png",
  red: "/brand/reebok-logo-red.png",
  black: "/brand/reebok-logo-black.png",
};

export interface ReebokLogoProps {
  variant?: "white" | "red" | "black";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * ReebokWordmark — el logo Reebok oficial completo (wordmark + delta).
 * Es el mark principal de la app; aparece en navbar, login y footer.
 */
export function ReebokWordmark({
  variant = "white",
  size = "md",
  className,
}: ReebokLogoProps) {
  const widths = { sm: 80, md: 120, lg: 180, xl: 240 };
  const w = widths[size];
  const h = Math.round(w / LOGO_RATIO);

  return (
    <Image
      src={VARIANT_SRC[variant]}
      alt="Reebok"
      width={w}
      height={h}
      priority={size === "lg" || size === "xl"}
      className={cn("flex-shrink-0 select-none", className)}
      draggable={false}
    />
  );
}

/**
 * ReebokFullLockup — alias del wordmark oficial.
 * El logo nuevo ya incluye delta + wordmark juntos, así que no necesitamos
 * componer dos piezas como antes.
 */
export function ReebokFullLockup({
  size = "md",
  variant = "white",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "white" | "red" | "black";
  className?: string;
}) {
  return <ReebokWordmark size={size} variant={variant} className={className} />;
}

/**
 * ReebokVector — alias para retro-compatibilidad.
 *
 * El "Vector" de la era 1997-2014 (dos formas diagonales rojas) ya no
 * es el branding oficial. Esto ahora renderiza una versión chica del
 * lockup completo, manteniendo la API que ya consume el resto de la app.
 */
export function ReebokVector({
  size = 48,
  color = "#CC0000",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  // Si el color es rojo, usamos variant red; si es blanco, white; otros → white
  const variant: "white" | "red" | "black" =
    color === "#CC0000" || color.toLowerCase() === "red"
      ? "red"
      : color === "#0D0D0D" || color.toLowerCase() === "black"
        ? "black"
        : "white";

  // Mantengo el ancho aprox del Vector original (que era cuadrado),
  // pero el lockup oficial es horizontal — uso un ancho proporcional.
  const w = Math.round(size * 1.5);
  const h = Math.round(w / LOGO_RATIO);

  return (
    <Image
      src={VARIANT_SRC[variant]}
      alt="Reebok"
      width={w}
      height={h}
      className={cn("flex-shrink-0 select-none", className)}
      draggable={false}
    />
  );
}

/**
 * ReebokSymbol — cuadrado con el lockup centrado.
 * Útil para íconos / favicon donde necesitamos una shape contenida.
 */
export function ReebokSymbol({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-rb-red rounded-rb flex-shrink-0",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={VARIANT_SRC.white}
        alt="Reebok"
        width={Math.round(size * 0.75)}
        height={Math.round((size * 0.75) / LOGO_RATIO)}
        draggable={false}
      />
    </div>
  );
}
