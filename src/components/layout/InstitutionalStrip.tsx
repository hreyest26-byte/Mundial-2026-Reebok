/**
 * InstitutionalStrip — barra corporativa fina arriba del Navbar.
 *
 * Refuerza que esta es una app interna oficial Reebok, no un app público
 * genérico del Mundial. Es la primera línea visible al cargar el Dashboard.
 *
 * - NO sticky: se aleja al hacer scroll, libera espacio en mobile
 * - Altura 24px, texto en rb-500 tracking widget
 * - Borde inferior sutil para separarla del Navbar
 */
export function InstitutionalStrip() {
  return (
    <div className="h-6 bg-rb-black border-b border-rb-900 flex items-center justify-center px-4">
      <p className="font-display font-bold uppercase tracking-[0.25em] text-[0.55rem] text-rb-500 truncate">
        Reebok Chile{" "}
        <span className="text-rb-700 mx-1">·</span>
        Polla Interna Oficial{" "}
        <span className="hidden sm:inline">
          <span className="text-rb-700 mx-1">·</span>
          Mundial FIFA 2026
        </span>
      </p>
    </div>
  );
}
