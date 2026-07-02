"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

/* ─────────────────── Read-only display ──────────────────── */
export function StarRatingDisplay({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          style={{ width: size, height: size }}
          className={
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/25"
          }
        />
      ))}
    </div>
  );
}

/* ─────────────────── Interactive input ──────────────────── */
interface StarRatingInputProps {
  name?: string;
  value: number;
  onChange: (value: number) => void;
  size?: number;
  disabled?: boolean;
}

/**
 * Accessible star-rating picker. Renders a hidden `<input type="number">`
 * alongside the visual stars so the value is picked up by native
 * `FormData` when used inside a `<form action={formAction}>`.
 */
export function StarRatingInput({
  name = "rating",
  value,
  onChange,
  size = 28,
  disabled,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  const labels = ["Poor", "Fair", "Good", "Very good", "Excellent"];

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="radiogroup"
        aria-label="Rating"
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(null)}
            onClick={() => onChange(star)}
            className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(
                "transition-colors",
                star <= display
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/30",
              )}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-muted-foreground min-w-20">
          {display > 0 ? labels[display - 1] : ""}
        </span>
      </div>
      <input type="hidden" name={name} value={value || ""} readOnly />
    </div>
  );
}
