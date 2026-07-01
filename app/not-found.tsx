import type { Metadata } from "next";
import { ErrorState } from "@/components/shared/ErrorState";

export const metadata: Metadata = {
  title: "Page not found — Travel360",
};

export default function NotFound() {
  return (
    <ErrorState
      variant="not-found"
      eyebrow="Off the map"
      title="This page didn't make the itinerary"
      description="The page you're looking for may have been moved, renamed, or never existed. Let's get you back on route."
      primaryAction={{ label: "Back to home", href: "/" }}
      secondaryAction={{ label: "Explore travelers", href: "/explore" }}
    />
  );
}
