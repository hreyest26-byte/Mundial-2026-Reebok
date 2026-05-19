"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ALLOWED_DOMAINS = ["reebok.cl", "adidas.com", "reebok.com", "fashionfitnessgroup.com"];

function isAllowedDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain ?? "");
}

function makeSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email    = (formData.get("email")    as string).trim().toLowerCase();
  const password = (formData.get("password") as string);

  const supabase = makeSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email o contraseña incorrectos. Intenta de nuevo." };
  }

  redirect("/home");
}

export async function registroAction(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const fullName = (formData.get("fullName")  as string).trim();
  const email    = (formData.get("email")     as string).trim().toLowerCase();
  const password = (formData.get("password")  as string);
  const nickname = (formData.get("nickname")  as string).trim();

  if (!isAllowedDomain(email)) {
    return { error: "Solo se aceptan emails corporativos (@reebok.cl, @adidas.com, @reebok.com, @fashionfitnessgroup.com)" };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }

  if (!nickname) {
    return { error: "Debes elegir tu apodo Reebok" };
  }

  const supabase = makeSupabase();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, nickname } },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Este email ya tiene una cuenta. Ve a iniciar sesión." };
    }
    return { error: "Error al crear la cuenta. Intenta de nuevo." };
  }

  redirect("/home");
}
