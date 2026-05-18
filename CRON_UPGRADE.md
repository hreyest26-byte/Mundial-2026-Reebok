# Cron Jobs · Notas de upgrade a Vercel Pro

## Estado actual (Hobby / Free)

`vercel.json` está vacío (`{}`) porque Vercel Hobby sólo permite **un cron job al día** y nuestra configuración original corría cada 5 minutos. La definición completa quedó preservada en **`vercel.future.json`** para cuando upgradees.

**No hay ninguna lógica de cron activa.** Los partidos LIVE no se actualizan automáticamente — por ahora hay dos alternativas:

1. **Manual**: vos (admin) actualizás el score / estado del partido en Supabase Studio cuando termina cada partido.
2. **API-Football webhook** (si tu plan paga lo soporta): configurás un webhook que pushea cambios a tu Supabase.

## Cuando upgradees a Pro

Costo Vercel Pro: ~USD $20/mes. Permite crons cada 5 minutos sin límite, además de 1 TB de bandwidth y otras features.

Pasos para reactivar:

1. **Renombrar archivos**:
   ```powershell
   cd "C:\Mundial 2026\reebok-world-cup-pool"
   Remove-Item vercel.json
   Rename-Item vercel.future.json vercel.json
   ```

2. **Crear el endpoint `/api/cron`** (no existe todavía):
   ```ts
   // src/app/api/cron/route.ts
   import { createServerSupabase } from "@/lib/supabase-server";
   import { NextResponse } from "next/server";

   // GET /api/cron — corre cada 5 min en Vercel Pro
   export async function GET(request: Request) {
     // Validar que la request venga de Vercel
     const authHeader = request.headers.get("authorization");
     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
       return new NextResponse("Unauthorized", { status: 401 });
     }

     const supabase = createServerSupabase();

     // TODO: acá va tu lógica de update — por ejemplo:
     // 1) Obtener partidos status='live' de la DB
     // 2) Para cada uno, fetchear score actual desde API-Football
     // 3) UPDATE matches SET home_score=..., away_score=..., current_minute=..., last_event=...
     // 4) Si partido terminó, status='finished' y calcular puntos de predictions

     return NextResponse.json({ ok: true, ranAt: new Date().toISOString() });
   }
   ```

3. **Agregar `CRON_SECRET`** a las env vars de Vercel:
   - Settings → Environment Variables
   - Name: `CRON_SECRET`
   - Value: cualquier string random largo (ej: `openssl rand -hex 32`)
   - Environments: Production

4. **`git commit && git push`** — Vercel auto-deploya y el cron empieza a correr.

## Mientras tanto

Si necesitás actualizar un partido manualmente:

```sql
-- En Supabase SQL Editor, durante el partido:
UPDATE matches
SET status = 'live',
    home_score = 1,
    away_score = 0,
    current_minute = 27,
    last_event = '⚽ GOL Argentina (Messi 27'')',
    last_event_at = NOW()
WHERE home_team_id = (SELECT id FROM teams WHERE country_code = 'AR')
  AND match_time::date = '2026-06-13';

-- Cuando termina:
UPDATE matches
SET status = 'finished',
    home_score = 2,
    away_score = 1
WHERE id = '<match-uuid>';
```

El trigger `trg_clear_live_on_finish` (migration 007) limpia automáticamente `current_minute`, `last_event` y `last_event_at` cuando el partido pasa a `finished`.
