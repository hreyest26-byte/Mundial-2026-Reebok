import { cn } from "@/lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: "red" | "blue" | "gold" | "none";
  onClick?: () => void;
}

const accentClasses: Record<NonNullable<CardProps["accent"]>, string> = {
  none: "",
  red: "[--card-accent-gradient:linear-gradient(to_right,#CC0000,#CC0000)]",
  blue: "[--card-accent-gradient:linear-gradient(to_right,#003DA5,#003DA5)]",
  gold: "[--card-accent-gradient:linear-gradient(to_right,#C9A84C,#C9A84C)]",
};

export function Card({
  children,
  className,
  accent = "none",
  onClick,
}: CardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        "rb-card",
        accent !== "none" && accentClasses[accent],
        isClickable &&
          "cursor-pointer transition-shadow duration-200 hover:shadow-card-hover hover:-translate-y-0.5",
        className
      )}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}
