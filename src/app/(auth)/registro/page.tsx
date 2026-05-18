"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { ReebokVector, ReebokWordmark } from "@/components/ui/ReebokLogo";
import { NICKNAMES } from "@/constants/nicknames";

const ALLOWED_DOMAINS = ["reebok.cl", "adidas.com", "reebok.com", "fashionfitnessgroup.com"];

function validateEmailDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

export default function RegistroPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validación de dominio en el cliente (primera capa de seguridad)
    if (!validateEmailDomain(email)) {
      setError(
        "Solo se aceptan emails corporativos (@reebok.cl, @adidas.com, @reebok.com, @fashionfitnessgroup.com)"
      );
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!nickname) {
      setError("Debes elegir tu apodo Reebok");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          nickname,
        },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Este email ya tiene una cuenta. Ve a iniciar sesión.");
      } else {
        setError("Error al crear la cuenta. Intenta de nuevo.");
      }
      setLoading(false);
      return;
    }

    window.location.href = "/home";
  }

  return (
    <div className="min-h-dvh bg-rb-black flex flex-col items-center justify-center px-4 py-12">
      {/* Logo + título */}
      <div className="mb-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <ReebokVector size={44} color="#CC0000" />
          <ReebokWordmark size="lg" variant="white" />
        </div>
        <h1 className="font-display font-black uppercase leading-none">
          <span className="block text-[2rem] text-rb-white tracking-tight">Únete al</span>
          <span className="block text-[2.8rem] text-rb-red tracking-tight">Pool Mundial</span>
          <span className="block text-[2rem] text-rb-500 tracking-tight">FIFA 2026</span>
        </h1>
      </div>

      <div className="w-full max-w-sm">
        <div className="rb-card p-6 space-y-5">
          <div>
            <h2 className="font-display font-bold text-h3 text-rb-white">
              Crear cuenta
            </h2>
            <p className="text-small text-rb-500 mt-1">
              Solo para empleados con email corporativo
            </p>
          </div>

          <form onSubmit={handleRegistro} className="space-y-4">
            <Input
              label="Nombre completo"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre real"
              required
              autoComplete="name"
            />

            <Input
              label="Email corporativo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.nombre@reebok.cl"
              hint="@reebok.cl · @adidas.com · @reebok.com · @fashionfitnessgroup.com"
              required
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              autoComplete="new-password"
            />

            {/* Selector de nickname Reebok */}
            <div className="space-y-2">
              <label className="rb-label block">Tu apodo Reebok</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {NICKNAMES.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNickname(n)}
                    className={`px-3 py-2 rounded-rb border text-left transition-all duration-150 ${
                      nickname === n
                        ? "border-rb-red bg-rb-red/10 text-rb-white font-display font-bold"
                        : "border-rb-700 bg-rb-800 text-rb-500 hover:border-rb-500 hover:text-rb-white font-display"
                    }`}
                  >
                    <span className="text-small">{n}</span>
                  </button>
                ))}
              </div>
              {nickname && (
                <p className="text-small text-rb-gold">
                  Elegiste: <strong>{nickname}</strong>
                </p>
              )}
            </div>

            {error && (
              <p className="text-small text-rb-red bg-rb-red/10 border border-rb-red/30 rounded-rb px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? <Spinner size="sm" /> : "Crear mi cuenta"}
            </Button>
          </form>

          <div className="pt-2 border-t border-rb-800 text-center">
            <p className="text-small text-rb-500">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-rb-red font-display font-bold hover:text-rb-white transition-colors"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
