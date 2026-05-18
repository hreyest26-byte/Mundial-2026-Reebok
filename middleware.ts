import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// El middleware corre en el Edge antes de cada request
// Es la primera línea de defensa para proteger rutas

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // Crear cliente Supabase que puede leer y actualizar cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Obtener sesión (refresca el token si hace falta)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  // Rutas públicas (no requieren autenticación)
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/registro");

  // Si está en login/registro y ya tiene sesión → redirigir al home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Rutas protegidas — si no hay sesión → redirigir al login
  const isProtectedRoute =
    pathname.startsWith("/home") ||
    pathname.startsWith("/partidos") ||
    pathname.startsWith("/predicciones") ||
    pathname.startsWith("/ranking") ||
    pathname.startsWith("/en-vivo") ||
    pathname.startsWith("/calendario") ||
    pathname.startsWith("/logros") ||
    pathname.startsWith("/premios") ||
    pathname.startsWith("/perfil");

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rutas admin — requieren role = admin
  // La verificación de rol se hace server-side dentro de cada página admin
  // El middleware solo verifica que haya sesión activa
  if (pathname.startsWith("/admin") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

// Definir en qué rutas se ejecuta el middleware
// Excluye archivos estáticos y assets de Next.js para no ralentizarlos
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
