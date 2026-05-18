import { ReebokVector, ReebokWordmark } from "@/components/ui/ReebokLogo";

/**
 * ReebokFooterMark — cierre de marca del Dashboard.
 *
 * Última cosa que ve el usuario antes del bottom-nav. Es el equivalente
 * al "tag de marca" en una camiseta de fútbol: el sello que confirma
 * que ESTO es Reebok.
 *
 * - Vector + wordmark blanco centrados
 * - "Est. 1958" reforzando heritage
 * - "Internal Build · 2026" en mono dándole feel de software corporativo
 */
export function ReebokFooterMark() {
  return (
    <footer
      className="animate-slide-up pt-6 pb-2 flex flex-col items-center gap-3"
      style={{ animationDelay: "420ms" }}
    >
      <div className="flex items-center gap-2.5 opacity-80">
        <ReebokVector size={20} color="#F5F4F0" />
        <ReebokWordmark size="sm" variant="white" />
      </div>

      <div className="flex items-center gap-2 font-mono text-[0.6rem] text-rb-700 uppercase tracking-[0.2em]">
        <span>Est. 1958</span>
        <span>·</span>
        <span>Reebok Chile</span>
        <span>·</span>
        <span>Internal 2026</span>
      </div>

      {/* Diagonal stripes accent — Reebok kit signature */}
      <div
        className="w-16 h-1 mt-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #CC0000 0 4px, transparent 4px 8px)",
        }}
        aria-hidden
      />
    </footer>
  );
}
