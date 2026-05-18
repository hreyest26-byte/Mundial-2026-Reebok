import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Cliente para usar en componentes del NAVEGADOR ("use client")
// Usa las variables NEXT_PUBLIC_ que son seguras de exponer
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
