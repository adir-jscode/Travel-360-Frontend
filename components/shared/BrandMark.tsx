import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";
import Link from "next/link";

const sizeStyles = {
  sm: { badge: "h-8 w-8 rounded-lg", icon: "h-4 w-4", text: "text-base" },
  md: { badge: "h-9 w-9 rounded-xl", icon: "h-5 w-5", text: "text-lg" },
  lg: { badge: "h-11 w-11 rounded-xl", icon: "h-6 w-6", text: "text-xl" },
} as const;

export function BrandMark({
  size = "md",
  href = "/",
  className,
}: {
  size?: keyof typeof sizeStyles;
  href?: string | null;
  className?: string;
}) {
  const { badge, icon, text } = sizeStyles[size];

  const content = (
    <>
      <span
        className={cn(
          "grid shrink-0 place-items-center bg-gradient-sunset text-white shadow-glow",
          badge,
        )}
      >
        <Compass className={icon} />
      </span>
      <span className={cn("font-black tracking-tight text-foreground", text)}>
        Travel<span className="text-primary">360</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <div className={cn("flex items-center gap-2", className)}>{content}</div>
    );
  }

  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      {content}
    </Link>
  );
}
