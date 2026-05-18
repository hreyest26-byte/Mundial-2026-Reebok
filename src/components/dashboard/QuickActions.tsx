"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * QuickActions — strip horizontal scrollable estilo ESPN/Bet365.
 *
 * - Mobile-first: scroll horizontal nativo, scrollbar oculto, snap suave
 * - El item activo (típicamente "Tus picks") usa accent rojo para señalar acción pendiente
 * - Cada chip es un Link → cero JS extra, navegación instantánea
 */
export interface QuickAction {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  accent?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <section
      className={cn(
        "-mx-4 px-4 animate-slide-up",
        className
      )}
      style={{ animationDelay: "60ms" }}
    >
      <div
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        role="list"
      >
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            role="listitem"
            className={cn(
              "snap-start inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap",
              "font-display font-bold uppercase tracking-wider text-[0.7rem]",
              "border transition-all duration-150 active:scale-[0.97]",
              a.accent
                ? "bg-rb-red/10 border-rb-red/35 text-rb-red"
                : "bg-rb-800 border-rb-700 text-rb-white hover:bg-rb-800/70"
            )}
          >
            <span aria-hidden className="flex-shrink-0">
              {a.icon}
            </span>
            <span>{a.label}</span>
            {a.badge && (
              <span
                className={cn(
                  "ml-0.5 font-mono text-[0.65rem] tabular-nums",
                  a.accent ? "text-rb-red/70" : "text-rb-500"
                )}
              >
                {a.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
