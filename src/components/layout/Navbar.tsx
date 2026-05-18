"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Avatar } from "@/components/ui/Avatar";
import { ReebokVector, ReebokWordmark } from "@/components/ui/ReebokLogo";
import { cn, getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

const NAV_LINKS = [
  { href: "/home", label: "Inicio" },
  { href: "/partidos", label: "Partidos" },
  { href: "/predicciones", label: "Mis picks" },
  { href: "/ranking", label: "Ranking" },
];

interface NavbarProps {
  profile: Pick<Profile, "full_name" | "nickname" | "avatar_url" | "rank_position">;
}

export function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-rb-800 bg-rb-900/95 backdrop-blur-sm">
      <div className="h-full max-w-4xl mx-auto px-4 flex items-center justify-between">

        {/* Logo Reebok oficial + sublabel del producto */}
        <Link
          href="/home"
          className="flex items-center gap-2.5 select-none flex-shrink-0"
          aria-label="Reebok Pool 2026 — Inicio"
        >
          <ReebokVector size={22} color="#CC0000" />
          <div className="flex items-center gap-2 leading-none">
            <ReebokWordmark size="sm" variant="white" />
            <span className="hidden sm:inline-block w-px h-4 bg-rb-700" aria-hidden />
            <span className="hidden sm:inline-block font-display font-black uppercase tracking-[0.18em] text-[0.65rem] text-rb-500">
              Pool <span className="text-rb-red">2026</span>
            </span>
          </div>
        </Link>

        {/* Nav links — solo desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-rb font-display font-bold uppercase text-[0.7rem] tracking-wider transition-colors duration-150",
                  isActive
                    ? "text-rb-white bg-rb-800"
                    : "text-rb-500 hover:text-rb-white hover:bg-rb-800/50"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Usuario + salir */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="font-display font-bold text-[0.8rem] text-rb-white leading-none">
              {profile.nickname}
            </span>
            <span className="text-[0.65rem] text-rb-500 leading-none mt-0.5">
              {profile.rank_position > 0 ? `#${profile.rank_position}` : "Sin ranking"} · {profile.full_name.split(" ")[0]}
            </span>
          </div>

          <Avatar
            initials={getInitials(profile.full_name)}
            src={profile.avatar_url ?? undefined}
            size="sm"
          />

          <button
            onClick={handleLogout}
            className="text-rb-500 hover:text-rb-white transition-colors p-1.5 rounded-rb hover:bg-rb-800"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
