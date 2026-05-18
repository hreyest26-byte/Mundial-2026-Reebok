"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { ReebokVector, ReebokWordmark } from "@/components/ui/ReebokLogo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" size="lg" loading={pending} className="w-full">
      {pending ? <Spinner size="sm" /> : "Entrar al Pool"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, { error: null });

  return (
    <div className="min-h-dvh bg-rb-black flex flex-col lg:flex-row">

      {/* Panel izquierdo — hero visual retro 90s */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-rb-900 flex-col items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5F4F0'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-rb-red to-transparent" />

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="flex flex-col items-center gap-3">
            <ReebokVector size={72} color="#CC0000" />
            <ReebokWordmark size="xl" variant="white" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-rb-700" />
              <span className="rb-label text-rb-500">FIFA 2026</span>
              <span className="h-px flex-1 bg-rb-700" />
            </div>
            <h1 className="font-display font-black uppercase leading-[0.9]">
              <span className="block text-[3.5rem] text-rb-white tracking-tight">Pool</span>
              <span className="block text-[5rem] text-rb-red tracking-tight">Mundial</span>
            </h1>
            <p className="font-display font-bold text-rb-500 uppercase tracking-widest text-sm">
              11 Jun — 19 Jul · USA · CAN · MEX
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-rb-800">
            {[
              { valor: "48", label: "Equipos" },
              { valor: "104", label: "Partidos" },
              { valor: "30", label: "Jugadores" },
            ].map(({ valor, label }) => (
              <div key={label} className="text-center">
                <p className="font-display font-black text-[2rem] text-rb-white leading-none">{valor}</p>
                <p className="rb-label text-rb-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 lg:px-12">

        {/* Logo móvil */}
        <div className="lg:hidden mb-10 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <ReebokVector size={44} color="#CC0000" />
            <ReebokWordmark size="lg" variant="white" />
          </div>
          <h1 className="font-display font-black text-[2.5rem] uppercase leading-none">
            <span className="text-rb-white">Pool </span>
            <span className="text-rb-red">Mundial</span>
            <span className="text-rb-white"> 2026</span>
          </h1>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="font-display font-black text-h2 text-rb-white uppercase leading-none">
              Iniciar sesión
            </h2>
            <p className="text-small text-rb-500 mt-1">
              Solo para empleados Reebok Chile
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <Input
              label="Email corporativo"
              type="email"
              name="email"
              placeholder="tu.nombre@reebok.cl"
              required
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              placeholder="Tu contraseña"
              required
              autoComplete="current-password"
            />

            {state.error && (
              <p className="text-small text-rb-red bg-rb-red/10 border border-rb-red/30 rounded-rb px-3 py-2">
                {state.error}
              </p>
            )}

            <SubmitButton />
          </form>

          <div className="pt-4 border-t border-rb-800 text-center">
            <p className="text-small text-rb-500">
              ¿Primera vez?{" "}
              <Link
                href="/registro"
                className="text-rb-red font-display font-bold hover:text-rb-white transition-colors"
              >
                Crear cuenta
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="h-px w-6 bg-rb-800" />
            <span className="rb-label text-rb-800">Reebok Chile · Interno</span>
            <span className="h-px w-6 bg-rb-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
