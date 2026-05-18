import { cn } from "@/lib/utils";

const FLAG_OVERRIDES: Record<string, string> = {
  EN: "gb",
  S2: "sa",
};

function codeToFlagUrl(code: string): string {
  const c = (FLAG_OVERRIDES[code.toUpperCase()] ?? code).toLowerCase();
  return `https://flagcdn.com/w40/${c}.png`;
}

export interface FlagIconProps {
  countryCode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 24, height: 18, cls: "w-6 h-[18px]" },
  md: { width: 36, height: 27, cls: "w-9 h-[27px]" },
  lg: { width: 48, height: 36, cls: "w-12 h-9" },
};

export function FlagIcon({ countryCode, size = "md", className }: FlagIconProps) {
  const s = sizeMap[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={codeToFlagUrl(countryCode)}
      alt={countryCode}
      width={s.width}
      height={s.height}
      className={cn(s.cls, "object-cover rounded-sm select-none flex-shrink-0", className)}
    />
  );
}
