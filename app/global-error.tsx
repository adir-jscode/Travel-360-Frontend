"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Travel360] Root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorState
          variant="server-error"
          eyebrow="Turbulence ahead"
          title="Travel360 hit a rough patch"
          description="A critical error kept this page from loading. Reloading usually clears it up."
          primaryAction={{ label: "Reload Travel360", onClick: reset }}
          footnote={
            error.digest ? `Reference code: ${error.digest}` : undefined
          }
        />
      </body>
    </html>
  );
}
