import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// Combina clases Tailwind sin conflictos — úsala siempre para clases condicionales
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatea una fecha para mostrar: "Jue 12 Jun · 19:00"
export function formatMatchDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "EEE d MMM · HH:mm", { locale: es });
}

// Formatea un número de puntos: 1500 → "1.500 pts"
export function formatPoints(points: number): string {
  return `${points.toLocaleString("es-CL")} pts`;
}

// "Hace 2 horas" o "en 3 días"
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { locale: es, addSuffix: true });
}

// Posición en ranking con ordinal: 1 → "1°", 2 → "2°"
export function formatRank(position: number): string {
  return `${position}°`;
}

// Iniciales para Avatar: "Juan Pérez" → "JP"
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Valida que un email pertenezca a los dominios permitidos
export function isAllowedEmailDomain(email: string): boolean {
  const allowed = ["reebok.cl", "adidas.com", "reebok.com", "fashionfitnessgroup.com"];
  const domain = email.split("@")[1]?.toLowerCase();
  return allowed.includes(domain ?? "");
}
