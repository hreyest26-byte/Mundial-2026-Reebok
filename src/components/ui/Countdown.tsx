"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface CountdownProps {
  targetDate: Date;
  label?: string;
  onExpire?: () => void;
  className?: string;
}

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcularTiempoRestante(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    segundos: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function Countdown({
  targetDate,
  label,
  onExpire,
  className,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(calcularTiempoRestante(targetDate));
  }, [targetDate]);

  const isUrgent =
    !expired &&
    !!timeLeft &&
    timeLeft.dias === 0 &&
    timeLeft.horas === 0 &&
    timeLeft.minutos < 10;

  const tick = useCallback(() => {
    const remaining = calcularTiempoRestante(targetDate);
    setTimeLeft(remaining);

    const isZero =
      remaining.dias === 0 &&
      remaining.horas === 0 &&
      remaining.minutos === 0 &&
      remaining.segundos === 0;

    if (isZero && !expired) {
      setExpired(true);
      onExpire?.();
    }
  }, [targetDate, expired, onExpire]);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  if (expired) {
    return (
      <div className={cn("text-center", className)}>
        <p className="font-display font-black text-h2 text-rb-red uppercase">
          ¡Comenzó!
        </p>
      </div>
    );
  }

  if (!timeLeft) {
    return <div className={cn("space-y-2", className)} />;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-end gap-2">
        {timeLeft.dias > 0 && (
          <CountdownUnit
            value={timeLeft.dias}
            label="días"
            urgent={isUrgent}
          />
        )}
        <CountdownUnit
          value={timeLeft.horas}
          label="hrs"
          urgent={isUrgent}
        />
        <CountdownSeparator urgent={isUrgent} />
        <CountdownUnit
          value={timeLeft.minutos}
          label="min"
          urgent={isUrgent}
        />
        <CountdownSeparator urgent={isUrgent} />
        <CountdownUnit
          value={timeLeft.segundos}
          label="seg"
          urgent={isUrgent}
        />
      </div>
      {label && <p className="rb-label text-rb-500">{label}</p>}
    </div>
  );
}

function CountdownUnit({
  value,
  label,
  urgent,
}: {
  value: number;
  label: string;
  urgent: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={cn(
          "font-display font-black tabular-nums leading-none transition-colors duration-300",
          "text-[2rem] md:text-[2.5rem]",
          urgent ? "text-rb-red" : "text-rb-white"
        )}
      >
        {pad(value)}
      </span>
      <span className="rb-label text-rb-500">{label}</span>
    </div>
  );
}

function CountdownSeparator({ urgent }: { urgent: boolean }) {
  return (
    <span
      className={cn(
        "font-display font-black text-[1.75rem] leading-[1.2] transition-colors duration-300 select-none mb-1",
        urgent ? "text-rb-red animate-pulse-live" : "text-rb-700"
      )}
    >
      :
    </span>
  );
}
