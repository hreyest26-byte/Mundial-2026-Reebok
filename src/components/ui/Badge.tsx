import { cn } from "@/lib/utils";

export interface BadgeProps {
  status: "live" | "upcoming" | "finished" | "locked" | "saved" | "exact";
  text?: string;
  className?: string;
}

const statusConfig: Record<
  BadgeProps["status"],
  { label: string; classes: string; pulse?: boolean }
> = {
  live: {
    label: "En vivo",
    classes: "bg-rb-red/20 text-rb-red border border-rb-red/30",
    pulse: true,
  },
  upcoming: {
    label: "Próximo",
    classes: "bg-rb-blue/20 text-rb-blue border border-rb-blue/30",
  },
  finished: {
    label: "Finalizado",
    classes: "bg-rb-800 text-rb-500 border border-rb-700",
  },
  locked: {
    label: "Cerrado",
    classes: "bg-rb-red/10 text-rb-red border border-rb-red/20",
  },
  saved: {
    label: "Guardado",
    classes: "bg-rb-blue/20 text-rb-blue border border-rb-blue/30",
  },
  exact: {
    label: "¡Exacto!",
    classes: "bg-rb-gold/20 text-rb-gold border border-rb-gold/30",
  },
};

export function Badge({ status, text, className }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn("rb-badge", config.classes, className)}>
      {config.pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-rb-red animate-pulse-live" />
      )}
      {text ?? config.label}
    </span>
  );
}
