import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Compass, MapPinOff, TriangleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";

type ErrorVariant = "not-found" | "server-error";

const VARIANTS: Record<ErrorVariant, { code: string; icon: typeof MapPinOff }> =
  {
    "not-found": { code: "404", icon: MapPinOff },
    "server-error": { code: "500", icon: TriangleAlert },
  };

/**
 * Full-page illustration for "lost route" states (404 / 500). Shares the
 * dashed flight-path emblem used on the loading screens, but here the plane
 * has drifted off the ring — a quiet visual metaphor for "off course."
 */
export function ErrorState({
  variant,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  footnote,
  showBrandMark = true,
  fullScreen = true,
}: {
  variant: ErrorVariant;
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href?: string; onClick?: () => void };
  footnote?: ReactNode;
  showBrandMark?: boolean;
  fullScreen?: boolean;
}) {
  const { code, icon: Icon } = VARIANTS[variant];

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center overflow-hidden bg-background px-6",
        fullScreen ? "min-h-screen" : "min-h-[60vh] rounded-3xl",
      )}
    >
      {/* Ambient brand blobs — matches loading / explore treatment */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-ocean/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-56 w-56 rounded-full bg-jungle/10 blur-3xl" />

      {showBrandMark && (
        <div className="relative z-10 w-full max-w-2xl pt-10 pb-16">
          <BrandMark size="sm" />
        </div>
      )}

      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col items-center justify-center text-center",
          showBrandMark ? "-mt-6" : "py-16",
        )}
      >
        {/* Off-course emblem */}
        <div className="relative flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
          {/* Broken flight-path ring */}
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1.5"
              pathLength={100}
              style={{ strokeDasharray: "70 30" }}
            />
          </svg>

          {/* Plane, drifted off the ring's end */}
          <span className="absolute -right-2 -top-1 grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground shadow-soft">
            <Compass
              className="h-4 w-4"
              style={{ transform: "rotate(35deg)" }}
            />
          </span>

          {/* Center badge with the status glyph */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
            <Icon className="h-8 w-8" />
          </div>
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-7xl font-black leading-none tracking-tight text-gradient-sunset sm:text-8xl">
          {code}
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {primaryAction.href ? (
            <Button asChild size="lg">
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          ) : (
            <Button size="lg" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ))}
        </div>

        {footnote && (
          <p className="mt-6 max-w-sm text-xs text-muted-foreground/80">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
