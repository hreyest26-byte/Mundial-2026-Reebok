import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  rank?: 1 | 2 | 3;
  className?: string;
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-8 h-8 text-small",
  md: "w-10 h-10 text-body",
  lg: "w-14 h-14 text-h3",
  xl: "w-20 h-20 text-h2",
};

const rankBorderClasses: Record<NonNullable<AvatarProps["rank"]>, string> = {
  1: "ring-2 ring-rb-gold ring-offset-2 ring-offset-rb-black",
  2: "ring-2 ring-rb-silver ring-offset-2 ring-offset-rb-black",
  3: "ring-2 ring-rb-bronze ring-offset-2 ring-offset-rb-black",
};

export function Avatar({
  src,
  initials,
  size = "md",
  rank,
  className,
}: AvatarProps) {
  const sizePx =
    size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 56 : 80;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center",
        "bg-rb-800 border border-rb-700",
        sizeClasses[size],
        rank && rankBorderClasses[rank],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={initials}
          width={sizePx}
          height={sizePx}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="font-display font-bold text-rb-500 select-none">
          {initials.slice(0, 2)}
        </span>
      )}
    </div>
  );
}
