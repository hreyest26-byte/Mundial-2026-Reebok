import { ReebokVector } from "@/components/ui/ReebokLogo";

/**
 * DashboardBrandHeader — header de marca explícito para /home.
 *
 * Hace que el Dashboard tenga la misma "anatomía visible" que el resto de
 * páginas (/partidos, /predicciones, /ranking): sello rojo arriba, título
 * masivo italic, ornamento lateral. La diferencia es que aquí el "título"
 * es "Dashboard" / "Inicio" y el ornamento es el Vector Reebok (no balón).
 */
export function DashboardBrandHeader() {
  return (
    <header
      className="relative overflow-hidden mb-2 pb-4 border-b border-rb-800 animate-slide-up"
      style={{ animationDelay: "0ms" }}
    >
      {/* Vector Reebok grande al costado derecho */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 opacity-[0.08]"
      >
        <ReebokVector size={150} color="#F5F4F0" />
      </div>

      {/* Banda diagonal roja lateral izquierda */}
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
            Reebok Sports
          </span>
          <span className="font-display font-bold text-[0.6rem] uppercase tracking-[0.2em] text-rb-500">
            Dashboard
          </span>
        </div>

        <h1 className="font-display font-black text-rb-white uppercase italic leading-none text-h1 tracking-tight">
          Inicio
        </h1>

        <p className="text-small text-rb-500 mt-2 leading-tight">
          Pool oficial interno · Mundial FIFA 2026
        </p>
      </div>
    </header>
  );
}
