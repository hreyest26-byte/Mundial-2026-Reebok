import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { InstitutionalStrip } from "@/components/layout/InstitutionalStrip";
import { AmbientPosters } from "@/components/layout/AmbientPosters";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, nickname, avatar_url, rank_position")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="relative flex flex-col min-h-dvh">
      {/* Posters ambient laterales — solo desktop xl+ */}
      <AmbientPosters />

      {/* Contenido principal — siempre por encima de los posters */}
      <div className="relative z-10 flex flex-col min-h-dvh">
        <InstitutionalStrip />
        <Navbar profile={profile} />
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
