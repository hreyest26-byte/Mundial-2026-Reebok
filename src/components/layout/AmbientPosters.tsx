"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * AmbientPosters — paneles laterales con posters Reebok SS25 "SPORT IS EVERYTHING".
 *
 * Solo visible en desktop (lg+), aprovecha el espacio vacío a los costados del
 * container central (max-w-2xl). Mobile no se ve.
 *
 * Cada página de la app muestra un poster diferente para que se sienta vivo:
 *   /home          → Luis Mejía arquero (football priority)
 *   /partidos      → Luis Mejía corriendo (football priority)
 *   /predicciones  → Paulina & Breakin' Kids (energy)
 *   /ranking       → Christian Harris (compite/gym)
 *   /perfil        → Lydia Oldham (running)
 *
 * Posters incluyen el watermark "SPORT IS EVERYTHING" original.
 * Side label vertical "REEBOK · MUNDIAL 2026" como cinta de marca.
 */

interface PosterConfig {
  src: string;
  athlete: string;
  tagline: string;
}

const POSTERS: Record<string, { left: PosterConfig; right: PosterConfig }> = {
  "/home": {
    left: {
      src: "/brand/posters/01-luis-mejia-goalkeeper.jpg",
      athlete: "Luis Mejía",
      tagline: "Reebok × Panamá",
    },
    right: {
      src: "/brand/posters/04-luis-mejia-running.jpg",
      athlete: "Luis Mejía",
      tagline: "Sport is Everything",
    },
  },
  "/partidos": {
    left: {
      src: "/brand/posters/04-luis-mejia-running.jpg",
      athlete: "Luis Mejía",
      tagline: "Reebok × Panamá",
    },
    right: {
      src: "/brand/posters/01-luis-mejia-goalkeeper.jpg",
      athlete: "Luis Mejía",
      tagline: "Sport is Everything",
    },
  },
  "/predicciones": {
    left: {
      src: "/brand/posters/02-paulina-breakin-kids.jpg",
      athlete: "Paulina & Breakin' Kids",
      tagline: "Reebok Movement",
    },
    right: {
      src: "/brand/posters/05-paulina-breakin-2.jpg",
      athlete: "Paulina",
      tagline: "Sport is Everything",
    },
  },
  "/ranking": {
    left: {
      src: "/brand/posters/06-christian-harris-gym.jpg",
      athlete: "Christian Harris",
      tagline: "Reebok Training",
    },
    right: {
      src: "/brand/posters/03-lydia-oldham-running.jpg",
      athlete: "Lydia Oldham",
      tagline: "Sport is Everything",
    },
  },
  "/perfil": {
    left: {
      src: "/brand/posters/03-lydia-oldham-running.jpg",
      athlete: "Lydia Oldham",
      tagline: "Reebok × Running",
    },
    right: {
      src: "/brand/posters/06-christian-harris-gym.jpg",
      athlete: "Christian Harris",
      tagline: "Sport is Everything",
    },
  },
};

const DEFAULT_CONFIG = POSTERS["/home"];

export function AmbientPosters() {
  const pathname = usePathname();
  // Match exact paths or fall back to the most specific match
  const config =
    POSTERS[pathname] ??
    (Object.entries(POSTERS).find(([k]) => pathname.startsWith(k))?.[1] as
      | (typeof POSTERS)[string]
      | undefined) ??
    DEFAULT_CONFIG;

  return (
    <>
      {/* Side panel IZQUIERDA — solo desktop xl+ */}
      <aside
        aria-hidden
        className="hidden xl:block fixed left-0 top-0 bottom-0 w-[240px] 2xl:w-[280px] pointer-events-none select-none z-0"
      >
        <PosterPanel poster={config.left} side="left" />
      </aside>

      {/* Side panel DERECHA — solo desktop xl+ */}
      <aside
        aria-hidden
        className="hidden xl:block fixed right-0 top-0 bottom-0 w-[240px] 2xl:w-[280px] pointer-events-none select-none z-0"
      >
        <PosterPanel poster={config.right} side="right" />
      </aside>
    </>
  );
}

function PosterPanel({
  poster,
  side,
}: {
  poster: PosterConfig;
  side: "left" | "right";
}) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Imagen del poster — fill todo el alto */}
      <Image
        src={poster.src}
        alt={poster.athlete}
        fill
        sizes="280px"
        priority={false}
        className="object-cover object-center opacity-70"
        draggable={false}
      />

      {/* Gradient overlay para fundir con el fondo de la app */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 pointer-events-none",
          side === "left"
            ? "bg-gradient-to-r from-rb-black/60 via-rb-black/30 to-rb-black"
            : "bg-gradient-to-l from-rb-black/60 via-rb-black/30 to-rb-black"
        )}
      />

      {/* Side label vertical — "REEBOK · MUNDIAL 2026" en cinta */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          side === "left" ? "left-3" : "right-3"
        )}
      >
        <p
          className="font-display font-black italic text-rb-white/90 uppercase tracking-[0.4em] text-[0.65rem] whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            transform: side === "left" ? "rotate(180deg)" : "none",
          }}
        >
          Reebok · Mundial 2026
        </p>
      </div>

      {/* Footer del panel — athlete + tagline */}
      <div
        className={cn(
          "absolute bottom-6 px-5",
          side === "left" ? "left-0 text-left" : "right-0 text-right"
        )}
      >
        <p className="font-display font-black italic uppercase text-rb-white text-[0.9rem] leading-tight tracking-tight">
          Sport is
          <br />
          Everything.
        </p>
        <p className="font-mono text-[0.55rem] text-rb-white/70 uppercase tracking-[0.2em] mt-2">
          Reebok × {poster.athlete}
        </p>
      </div>

      {/* Banda diagonal lateral roja en el borde interno (donde se cruza con el contenido) */}
      <div
        aria-hidden
        className={cn(
          "absolute top-8 bottom-8 w-1",
          side === "left" ? "right-0" : "left-0"
        )}
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(204,0,0,0.5) 0 6px, transparent 6px 14px)",
        }}
      />
    </div>
  );
}
