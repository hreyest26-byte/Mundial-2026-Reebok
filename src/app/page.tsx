import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

// Ruta raíz: redirige al home si hay sesión activa, o al login si no
export default async function RootPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}
