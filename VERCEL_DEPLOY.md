# Deploy a Vercel — Reebok World Cup Pool 2026

Esta guía deja la app corriendo en una URL pública (`https://pool-reebok.vercel.app` o similar) para que el resto del equipo Reebok pueda acceder y registrarse.

---

## Paso 1 — Sube el código a GitHub

Si todavía no tienes el repo en GitHub:

```powershell
cd "C:\Mundial 2026\reebok-world-cup-pool"
git status                          # ver qué cambió
git add .
git commit -m "feat: brand-forward v2.2 + fixture completo + logo oficial"
git push origin main
```

Si **NO** tienes repo todavía:

```powershell
git init
git branch -M main
git remote add origin https://github.com/TU_USUARIO/reebok-world-cup-pool.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

> Crea primero el repo desde github.com/new (privado recomendado).

---

## Paso 2 — Crea la cuenta de Vercel

1. Andá a https://vercel.com/signup
2. Elegí "Continue with GitHub" (autoriza Vercel a leer tus repos)
3. Plan **Hobby (Free)** es suficiente para 30-50 usuarios internos

---

## Paso 3 — Importa el proyecto

1. Click en "Add New..." → "Project"
2. Buscá `reebok-world-cup-pool` en la lista de repos → "Import"
3. **Framework Preset**: Next.js (lo detecta automáticamente)
4. **Root Directory**: dejarlo en `./` (la raíz del repo)
5. **Build Command**: `next build` (ya está en el package.json)
6. **NO** hagas deploy todavía — falta configurar variables de entorno

---

## Paso 4 — Variables de entorno (CRÍTICO)

Antes del primer deploy, agregá las variables que tu app usa para conectarse a Supabase. Click en **"Environment Variables"** y agregá:

| Name | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | (de tu Supabase project settings) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (de tu Supabase project settings) | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | (solo si la usas en server actions) | Production, Preview |
| `RESEND_API_KEY` | (si usas Resend para emails) | Production, Preview |

> Las dos primeras las encontrás en Supabase → tu proyecto → Settings → API.
> Las marcadas `NEXT_PUBLIC_` son públicas (van al cliente). Las demás son privadas (solo server).

---

## Paso 5 — Deploy

1. Click en **"Deploy"**.
2. Vercel tarda 1-3 minutos en build + deploy.
3. Cuando termina te da una URL tipo `https://reebok-world-cup-pool-abc123.vercel.app`.
4. Click en "Visit" → debería abrir la app en /login.

---

## Paso 6 — Dominio personalizado (opcional)

Si quieres una URL más limpia tipo `pool.reebok.cl`:

1. En Vercel: Settings → Domains
2. Add → escribí el dominio
3. Vercel te da los DNS records (CNAME / A) que tenés que poner en tu proveedor del dominio
4. Tarda 5-30 min en propagar

Si **NO** tenés dominio propio, podés cambiar el subdominio default a algo más memorable:
Settings → Domains → editar el dominio `.vercel.app` por `pool-reebok-2026.vercel.app` (gratis).

---

## Paso 7 — Habilitá redirect en Supabase

Crítico: para que el login funcione desde la URL pública, Supabase necesita saber que esa URL está autorizada.

1. Supabase → tu proyecto → Authentication → URL Configuration
2. **Site URL**: `https://pool-reebok-2026.vercel.app` (la URL de Vercel)
3. **Redirect URLs**: agregá la misma URL + `https://pool-reebok-2026.vercel.app/**`
4. Guardá.

Sin esto, el login va a fallar con "redirect_to no autorizado".

---

## Paso 8 — Comparte la URL

Mandá la URL al equipo. Cada persona se registra en `/registro` con:
- Email corporativo (`@reebok.cl`, `@adidas.com`, `@reebok.com` o `@fashionfitnessgroup.com` — ya validado en `src/lib/utils.ts`)
- Una contraseña

El email tiene que ser de uno de los dominios permitidos. Si necesitás agregar otros dominios:

```ts
// src/lib/utils.ts
export function isAllowedEmailDomain(email: string): boolean {
  const allowed = ["reebok.cl", "adidas.com", "reebok.com", "fashionfitnessgroup.com"];
  // agregá los nuevos dominios acá ↑
  ...
}
```

---

## Paso 9 — Auto-deploy de cambios

Cada vez que hagas `git push` a la rama `main`, Vercel re-deploya solo. No tenés que repetir los pasos 4-5.

Para preview de PRs antes de mergear: cada Pull Request te da una URL única tipo `https://pool-reebok-pr-12.vercel.app` automáticamente.

---

## Troubleshooting rápido

**"Build failed: Module not found"** → Faltó `npm install` antes del push. Hacé `npm install` local, commiteá el `package-lock.json`, push.

**"Auth redirect mismatch"** → Olvidaste el paso 7 (Site URL en Supabase).

**"Database connection error"** → Las env vars no están bien. Revisá Settings → Environment Variables.

**Imágenes no cargan** → `next.config.js` o `next.config.mjs` puede necesitar permitir el dominio externo. Por ahora la app usa `flagcdn.com` para banderas y el logo es local, debería andar.

**Caché viejo después de un deploy** → En Vercel → Deployments → click en el último → "Redeploy" sin caché.

---

## Costos

Para uso interno con <50 usuarios y <1k requests/día, todo gratis:
- Vercel Hobby: 100 GB-hours/mes, suficiente
- Supabase Free: 500 MB DB, 1 GB storage, suficiente

Si crece >100 usuarios concurrentes activos, considerar Pro plans (~$20/mes cada uno).
