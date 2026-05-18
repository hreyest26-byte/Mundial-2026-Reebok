# Reebok World Cup Pool 2026 — Design System

> Guía visual y de interacción. Mobile-first. Dark mode nativo.
> Referencias: Reebok fútbol 90s/2000s · Nike App · Bet365 · ESPN FC.

---

## 1. Principios

### 1.1 Premium pero atlético
No somos un dashboard corporativo. Somos una app de fútbol para los días más emocionales del calendario deportivo. La estética es **oscura, densa, decidida** — como Bet365 cuando hay partido en vivo o ESPN FC en día de Champions. Nada decorativo, todo informativo.

### 1.2 Un hero por scroll
En cada pantalla hay un solo protagonista visual. En el Dashboard antes del Mundial es el **countdown**. Durante el Mundial será el **partido en vivo**. Post-Mundial será el **ranking final**. Todo lo demás es soporte y no debe competir con el hero.

### 1.3 Jerarquía por número, no por color
Bet365/ESPN enseñan que la jerarquía deportiva se construye con tipografía masiva (números grandes, tabular), no con cards rojas pidiendo atención. Reservar el rojo Reebok (`#CC0000`) para señalar **acción pendiente** o **estado en vivo**, nunca para decoración.

### 1.4 Microinteracciones cortas
150–300ms máximo. Nada lento, nada decorativo. Stagger de entrada (`animate-slide-up`), feedback de press (`active:scale-[0.98]`), pulse para live (`animate-pulse-live`). Si una animación dura más de medio segundo, está mal.

### 1.5 Confianza tipográfica
Barlow Condensed lleva el peso de la marca. Es la voz Reebok 90s en pantalla. Usar **font-display + uppercase + tracking widget** para todo lo que sea label, header, número grande, navegación. Barlow regular solo para body copy y descripciones.

---

## 2. Tokens de color

Todos los colores se consumen vía CSS variables o clases Tailwind. **Nunca usar hex directamente en componentes.**

| Token | Valor | Uso |
|---|---|---|
| `rb-red` | `#CC0000` | Acento primario, CTA destructivo, estado live, acción pendiente |
| `rb-blue` | `#003DA5` | Acento secundario, "upcoming", info, ring de selección |
| `rb-white` | `#F5F4F0` | Texto primario sobre fondo oscuro |
| `rb-black` | `#0D0D0D` | Fondo base de la app |
| `rb-900` | `#1A1A1A` | Fondo de cards y surfaces elevadas |
| `rb-800` | `#2A2A2A` | Borders, chips inactivos, hover states |
| `rb-700` | `#3D3D3D` | Borders sutiles, dividers, "VS" placeholder |
| `rb-500` | `#737373` | Texto secundario, labels muted |
| `rb-gold` | `#C9A84C` | Posición #1, ring de avatar campeón, valor de logro |
| `rb-silver` | `#A0A0A0` | Posición #2 |
| `rb-bronze` | `#8B5E3C` | Posición #3 |

**Gradiente signature Reebok** (rojo→azul): solo para el CTA primario del Dashboard, la línea superior del HeroCountdown, y el ícono circular del HypeBanner. **Una sola instancia visible por scroll.** Si aparece en dos lugares al mismo tiempo, dejas de tener un signature, tienes ruido.

### Combos válidos

- Texto sobre fondo: `text-rb-white` sobre `bg-rb-black/900` ✓
- Texto muted sobre fondo: `text-rb-500` sobre `bg-rb-black/900` ✓
- Texto sobre acento rojo: `text-rb-white` sobre `bg-rb-red` ✓
- Texto sobre azul tint: `text-rb-blue` sobre `bg-rb-blue/10` ✓
- Border de tint: `border-rb-red/30` sobre cualquier fondo ✓

### Combos prohibidos

- `text-rb-blue` sobre `bg-rb-black` — contraste insuficiente
- `text-rb-500` sobre `bg-rb-500/10` — texto muerto
- Cualquier gradient en background de card que no sea el HeroCountdown ✗

---

## 3. Tipografía

| Token Tailwind | Tamaño | Peso | Uso |
|---|---|---|---|
| `text-hero` | 4.5rem / 72px | 900 | Marcador en vivo, countdown final |
| `text-h1` | 3rem / 48px | 800 | Página principal "Ranking", "Perfil" |
| `text-h2` | 2rem / 32px | 700 | Hero del Dashboard, posición #1 dorada |
| `text-h3` | 1.375rem / 22px | 700 | Títulos de card, nombre del usuario |
| `text-label` | 0.6875rem / 11px | 700 | Labels uppercase con tracking — **el ADN visual de la app** |
| `text-body` | 0.875rem / 14px | 400 | Body copy, descripciones |
| `text-small` | 0.75rem / 12px | 400 | Captions, fechas, "pts" |

### Regla de oro

> **Todo número grande lleva `tabular-nums` o `tabular-nums` aplicado vía clase.**
> Los números deportivos no pueden "bailar" entre estados. Marcadores, countdowns, puntos, posiciones — todos tabulares.

### Helper class `rb-label`

```css
.rb-label {
  @apply font-display font-bold uppercase tracking-[0.15em] text-rb-500;
  font-size: 0.6875rem;
  line-height: 1;
}
```

Úsala en lugar de `text-label` cuando quieras también el color muted + display font + uppercase, que es lo normal.

---

## 4. Componentes patterns

### 4.1 Card (`Card.tsx`)

Toda card tiene una línea de 2px en el borde superior (`::before`). Por defecto es el gradient rojo→azul. Los `accent="red|blue|gold"` la dejan en color sólido.

**Cuándo usar `accent`:**
- `red` — card crítica, acción pendiente, evento próximo importante (HeroCountdown, FeaturedMatch)
- `blue` — info estructural, CTA primario (SpecialPicksCard)
- `gold` — logro, ranking, premio
- `none` (default) — todas las demás (TopThree, listados, secundarias)

**No combinar más de 2 `accent` distintos en un solo scroll.** Si tres cards consecutivas tienen accent, ninguna destaca.

### 4.2 Badge (`Badge.tsx`)

Reutilizar los status existentes:
- `live` — partido en vivo, pulse rojo
- `upcoming` — próximo, tint azul
- `finished` — terminado, gris
- `locked` — cerrado para predicciones, rojo claro
- `saved` — pick guardado, azul tint
- `exact` — marcador exacto acertado, dorado

Nunca crear un badge custom sin agregar al `Badge.tsx`. La consistencia visual del status es crítica.

### 4.3 Avatar (`Avatar.tsx`)

Soporta `rank={1|2|3}` que pinta un ring dorado/plateado/bronce. **Usar siempre en TopThreeCard y en el WelcomeHeader cuando el usuario está en el podio.**

Tamaños: `sm` (32px) para listas, `md` (40px) para nav, `lg` (56px) para perfil/header, `xl` (80px) para perfil grande.

### 4.4 Botones (`Button.tsx` + CTAs custom)

- **CTA primario del Dashboard** — gradient `bg-[linear-gradient(135deg,#CC0000,#003DA5)]` solo en el botón de "Completar predicciones". **Una sola instancia por pantalla.**
- **CTA secundario** — `bg-rb-800/60 border border-rb-700` con tap-feedback `active:scale-[0.98]`.
- **Botón destructivo** — `bg-rb-red text-rb-white` solo para acciones irreversibles (logout, cerrar pool, etc.).
- **Ghost button** — `text-rb-500 hover:text-rb-white` sin background — solo para acciones terciarias en nav y headers.

### 4.5 Countdown (`Countdown.tsx`)

Ya está implementado. Tres reglas al usarlo:
1. Cuando es protagonista (HeroCountdown), envolverlo en una card con `accent` gradient.
2. Cuando es de un partido específico, usarlo más pequeño dentro de la MatchCard.
3. Cuando faltan menos de 10 minutos, el componente ya pinta los números en rojo y los `:` pulsantes. No tocar esa lógica.

---

## 5. Microinteracciones

### 5.1 Entrada de cards

Stagger de 60ms entre cards consecutivas, usando `animate-slide-up` + `animationDelay`:

```tsx
<section className="animate-slide-up" style={{ animationDelay: "60ms" }}>
```

Orden recomendado en el Dashboard:
1. WelcomeHeader — `0ms`
2. HeroCountdown — `60ms`
3. QuickActions — `120ms` (pero ya delegado a `60ms` para que aparezca casi junto con countdown)
4. SpecialPicksCard — `180ms`
5. FeaturedMatchCard — `240ms`
6. TopThreeCard — `300ms`
7. HypeBanner — `360ms`

### 5.2 Press feedback

Cualquier elemento clickable lleva `active:scale-[0.98]` + `transition-all duration-150`. No es decorativo: es feedback haptic-style que aprendimos de Nike App e iOS nativo.

### 5.3 Hover (desktop)

`hover:bg-rb-800/70` para chips y botones secundarios. `hover:opacity-90` para CTAs primarios. Cards con `onClick` ya tienen `hover:-translate-y-0.5 hover:shadow-card-hover` desde el componente base.

### 5.4 Live pulse

`animate-pulse-live` solo en:
- Dot rojo de "En vivo" (Badge `status="live"`)
- Dot rojo del HeroCountdown junto al label "FIFA World Cup 2026"
- Separador `:` del Countdown cuando es urgente (<10 min)

**Nunca pulsar texto de descripción ni cards completas.** El pulso es señal urgente — pierde fuerza si se abusa.

---

## 6. Layout & spacing

### 6.1 Container

```tsx
<div className="container mx-auto px-4 py-5 max-w-2xl space-y-5">
```

- `max-w-2xl` (672px) — la app es mobile-first pero se ve bien en desktop sin estirar info.
- `space-y-5` — 20px entre secciones del Dashboard. Más respira mejor.
- `px-4 py-5` — padding horizontal de 16px, vertical de 20px.

### 6.2 Bottom nav clearance

`<main>` tiene `pb-20 md:pb-6` para no chocar con la BottomNav fija de 64px + safe-area.

### 6.3 Hit targets

Mínimo 44×44px para cualquier elemento tappeable. Los chips de QuickActions llegan a 36px de alto pero compensan con padding horizontal generoso (14px).

---

## 7. Iconografía

- Stroke icons inline (no librerías). Stroke width 2.5 para action icons, 2 para navigation.
- Tamaños estándar: 12 (chip inline), 16 (nav inactive), 20 (nav active), 22 (botones), 32 (heroes).
- Color: hereda de `currentColor`. Nunca hardcodear fill/stroke.
- Bandera: usar `FlagIcon` que ya consulta flagcdn. No traer imágenes locales.

---

## 8. Do's & Don'ts

### ✅ DO

- Usar `tabular-nums` en todo número que pueda cambiar (score, countdown, puntos, posición).
- Stagger entrada con `animate-slide-up` + delays incrementales.
- Reservar gradient rojo→azul para máximo 1 instancia visible.
- Marcar al usuario actual en listados con accent rojo + texto "(tú)".
- Mantener labels en uppercase + tracking widget — es el ADN Reebok 90s.
- Tap feedback en todo clickable.
- Fallar en silencio en queries opcionales (ranking, partidos) y mostrar empty state elegante.

### ❌ DON'T

- Usar hex directamente en componentes (siempre tokens).
- Sumar más de 2 colores accent en una sola card.
- Animar elementos por puro placer estético (>300ms = mal).
- Mezclar fonts: `font-display` para display/labels, `font-body` para body, `font-mono` solo para data densa o code.
- Mostrar "—" o "0 pts" como hero — siempre dar contexto ("Aún no comienza el torneo", etc.).
- Usar emojis como decoración estructural (sí en empty states puntuales, no en hero copy).
- Crear cards sin la línea superior — rompe el ritmo visual del sistema.

---

## 9. Referencias visuales

| Inspiración | Qué tomamos |
|---|---|
| **Reebok fútbol 90s/2000s** | Tipografía Barlow Condensed condensada, labels uppercase, gradient rojo/azul, símbolo Vector como watermark sutil |
| **Nike App** | Press feedback con scale, jerarquía de un solo hero, transitions cortas y atléticas |
| **Bet365** | Densidad informativa sin saturar, números masivos tabular, badge live pulsante, scroll horizontal de quick filters |
| **ESPN FC** | Featured match card con flags grandes + "VS" tipográfico, top-3 leaderboard preview, watermark de marca en heroes |

---

## 10. Roadmap del design system

### Sprint actual (Dashboard)

- [x] Hero countdown con watermark Vector
- [x] Quick actions strip
- [x] Special picks progress card
- [x] Featured match card con fallback
- [x] Top 3 preview
- [x] Hype banner

### Siguiente sprint (Partidos + Predicciones)

- [ ] Match detail view con countdown propio y form de predicción
- [ ] Picks list con filtros (pendientes, guardadas, cerradas)
- [ ] Bottom sheet para confirmar pick (no modal centrado)
- [ ] Skeleton states para todas las listas

### Backlog visual

- [ ] Tab bar animada con underline que se desliza entre items (estilo Nike App).
- [ ] Toast component con `animate-slide-up` desde el bottom nav.
- [ ] Dark mode toggle (aunque la app nace dark, agregar light mode quitaría carácter).
- [ ] Modo "post-Mundial" con podio dorado animado.

---

## 11. Quick reference

```tsx
// CTA primario (un máximo por pantalla)
<Link
  className="bg-[linear-gradient(135deg,#CC0000_0%,#003DA5_100%)] text-rb-white
             font-display font-bold uppercase tracking-widest text-[0.75rem]
             py-3 rounded-rb inline-flex items-center justify-center gap-2
             transition-all duration-150 active:scale-[0.98]"
/>

// Card con accent
<Card accent="red"> ... </Card>

// Label estándar Reebok
<p className="rb-label">Posición</p>

// Número heroico tabular
<p className="font-display font-black text-h2 text-rb-gold tabular-nums">#1</p>

// Stagger de entrada
<section className="animate-slide-up" style={{ animationDelay: "180ms" }} />
```
