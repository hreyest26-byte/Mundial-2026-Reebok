/**
 * HypeBanner — refuerza pertenencia + escala del pool.
 *
 * - Background con gradient rojo/azul al 8% (sutil, premium)
 * - Ícono con rb-gradient sólido (única instancia de gradient pleno)
 * - Mensaje corto + subtítulo institucional
 */
interface HypeBannerProps {
  playerCount: number;
  subtitle?: string;
}

export function HypeBanner({
  playerCount,
  subtitle = "El pool oficial Reebok Chile está activo",
}: HypeBannerProps) {
  return (
    <section
      className="rb-card animate-slide-up"
      style={{
        animationDelay: "360ms",
        backgroundImage:
          "linear-gradient(135deg, rgba(204,0,0,0.08), rgba(0,61,165,0.08))",
      }}
    >
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[linear-gradient(135deg,#CC0000,#003DA5)] flex items-center justify-center flex-shrink-0 shadow-rb-red">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M22 11l-3-3-3 3" />
            <path d="M19 8v6" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-rb-white text-[0.95rem] leading-tight">
            {playerCount} jugador{playerCount === 1 ? "" : "es"} compitiendo
          </p>
          <p className="text-small text-rb-500 mt-0.5 leading-tight">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
