import PublicFooter from "@/components/shared/PublicFooter";
import { Button } from "@/components/ui/button";
import { destinations, travelPlans } from "@/lib/mock-data";
import { ArrowRight, Mountain } from "lucide-react";
import Link from "next/link";
import { DestinationCard } from "./DestinationCard";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorksStep";
import { StatsBar } from "./StatsBar";
import { Testimonials } from "./Testimonials";
import { TopTravelers } from "./TopTravelers";
import { TripCard } from "./TripCard";

export function TravelHome() {
  // Upcoming trips are derived from the same public travel plans shown on
  // /travel-plans, so "View Details" always lands on a real page.
  const upcomingTrips = travelPlans.slice(0, 4).map((plan) => ({
    id: plan.id,
    title: `${plan.destination.city ? `${plan.destination.city}, ` : ""}${plan.destination.country}`,
    date: `${new Date(plan.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(plan.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    groupSize: plan.travelType === "SOLO" ? "1" : "2-6",
    imageUrl: destinations.find(
      (d) => d.title.split(",")[0] === plan.destination.city,
    )?.imageUrl,
    spotsLeft: Math.max(1, 8 - (plan.days % 5)),
  }));

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Trust bar */}
      <StatsBar />

      {/* 3. Popular Destinations */}
      <section className="px-4 py-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-4xl font-black text-foreground md:text-5xl">
                Popular{" "}
                <span className="text-gradient-sunset">Destinations</span>
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Discover the most sought-after spots for adventure.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <Link
                href="/travel-plans"
                className="group flex items-center gap-2"
              >
                View All
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 5).map((dest) => (
              <DestinationCard key={dest.title} {...dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Upcoming Trips */}
      <section className="bg-secondary/40 px-4 py-20 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean/10 text-ocean">
              <Mountain className="h-6 w-6" />
            </div>
            <h2 className="text-4xl font-black text-foreground md:text-5xl">
              Upcoming <span className="text-gradient-sunset">Trips</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingTrips.map((trip) => (
              <TripCard
                key={trip.id}
                title={trip.title}
                date={trip.date}
                groupSize={trip.groupSize}
                imageUrl={trip.imageUrl ?? destinations[0].imageUrl}
                spotsLeft={trip.spotsLeft}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Top Travelers */}
      <TopTravelers />

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. Final CTA */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-6 text-5xl font-black text-white md:text-7xl">
            Ready to Explore?
          </h2>
          <p className="mb-10 text-xl font-medium text-white/85 md:text-2xl">
            Join thousands of travelers who have found their perfect travel
            buddies.
          </p>
          <Button
            asChild
            size="lg"
            className="h-auto rounded-full bg-white px-10 py-5 text-xl font-bold text-primary shadow-2xl transition-transform hover:scale-105 hover:bg-white/90"
          >
            <Link href="/register">Join the Adventure</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
