import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn("rb-label block", error && "text-rb-red")}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          "rb-input-base w-full px-4 py-3 text-body",
          error && "border-rb-red focus:border-rb-red focus:ring-rb-red",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-small text-rb-red">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-small text-rb-500">
          {hint}
        </p>
      )}
    </div>
  );
}
