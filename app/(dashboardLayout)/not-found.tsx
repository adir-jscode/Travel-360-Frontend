import { ErrorState } from "@/components/shared/ErrorState";

export default function DashboardNotFound() {
  return (
    <ErrorState
      variant="not-found"
      eyebrow="Off the map"
      title="This page didn't make the itinerary"
      description="The dashboard page you're looking for may have been moved or never existed."
      primaryAction={{ label: "Back to dashboard", href: "/user/dashboard" }}
      secondaryAction={{ label: "My trips", href: "/user/dashboard/my-trips" }}
      showBrandMark={false}
      fullScreen={false}
    />
  );
}
