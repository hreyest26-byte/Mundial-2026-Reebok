// Force /login y /registro a render dynamic (no SSG).
// Esto previene que Vercel intente pre-renderizar las páginas en build,
// cuando el cliente Supabase necesita env vars o auth state que solo
// existen en runtime.
export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
