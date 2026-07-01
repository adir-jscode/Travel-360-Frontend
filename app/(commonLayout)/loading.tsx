import { Compass, Plane } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Ambient brand blobs — same treatment used on explore/travel-plans pages */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-ocean/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-56 w-56 rounded-full bg-jungle/10 blur-3xl" />

      {/* Orbit emblem */}
      <div className="relative flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
        {/* Dashed flight-path rings */}
        <div
          className="absolute inset-0 rounded-full border border-dashed border-primary/25"
          style={{ animation: "t360-spin 16s linear infinite" }}
        />
        <div
          className="absolute inset-3 rounded-full border border-dashed border-ocean/20"
          style={{ animation: "t360-spin-reverse 22s linear infinite" }}
        />

        {/* Orbiting plane, nose following the path */}
        <div
          className="absolute inset-0"
          style={{ animation: "t360-orbit 2.8s linear infinite" }}
        >
          <span className="absolute left-1/2 top-0 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Plane className="h-3.5 w-3.5 rotate-45" />
          </span>
        </div>

        {/* Center badge */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-glow shadow-glow">
          <Compass
            className="h-7 w-7 text-primary-foreground"
            style={{ animation: "t360-spin 7s linear infinite" }}
          />
        </div>
      </div>

      {/* Wordmark */}
      <div className="mt-8 text-2xl font-black tracking-tight text-foreground">
        Travel<span className="text-primary">360</span>
      </div>

      {/* Tagline */}
      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        Charting your next adventure
        <span className="flex items-end gap-0.5">
          <span
            className="h-1 w-1 rounded-full bg-primary"
            style={{ animation: "t360-dot 1.4s ease-in-out infinite" }}
          />
          <span
            className="h-1 w-1 rounded-full bg-primary"
            style={{ animation: "t360-dot 1.4s ease-in-out 0.2s infinite" }}
          />
          <span
            className="h-1 w-1 rounded-full bg-primary"
            style={{ animation: "t360-dot 1.4s ease-in-out 0.4s infinite" }}
          />
        </span>
      </p>

      {/* Progress shimmer */}
      <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full w-1/3 rounded-full bg-linear-to-br from-primary via-primary-glow to-primary"
          style={{ animation: "t360-shimmer 1.6s ease-in-out infinite" }}
        />
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        Loading Travel360…
      </span>

      <style>{`
        @keyframes t360-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes t360-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes t360-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes t360-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-3px); opacity: 1; }
        }
        @keyframes t360-shimmer {
          0% { transform: translateX(-110%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(220%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="t360-"] {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
