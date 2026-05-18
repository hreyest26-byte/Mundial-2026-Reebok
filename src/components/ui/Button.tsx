import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-rb-red text-rb-white hover:bg-red-700 active:scale-[0.98] shadow-rb-red/20 shadow-md",
  secondary:
    "bg-transparent text-rb-white border border-rb-red hover:bg-rb-red/10 active:scale-[0.98]",
  ghost:
    "bg-transparent text-rb-500 hover:text-rb-white hover:bg-rb-800 active:scale-[0.98]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-small",
  md: "px-5 py-2.5 text-body",
  lg: "px-6 py-3.5 text-[0.875rem]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rb-btn-base inline-flex items-center justify-center gap-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {children}
    </button>
  );
}
