import { ItineraryTimeline } from "@/components/modules/travelPlan/ItineraryTimeline";
import { getTravelPlanById } from "@/services/travelPlan/travelPlan.service";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Globe2,
  MapPin,
  Users,
} from "lucide-react";

export default async function TravelPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getTravelPlanById(id);
  console.log("Dynamic page rendered:", id);
  if (!plan) {
    return notFound();
  }

  const formattedStartDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(plan.startDate));

  const formattedEndDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(plan.endDate));

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-secondary/5 -z-10" />
        <div className="absolute top-0 right-0 w-200 h-200 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              <Globe2 className="w-3.5 h-3.5 mr-1.5" />
              {plan.visibility}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 text-xs capitalize border-primary/20 text-primary bg-primary/5"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              {plan.travelType.toLowerCase()} Trip
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-4">
            {plan.destination.city ? `${plan.destination.city}, ` : ""}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
              {plan.destination.country}
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-6 mt-8 text-muted-foreground">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Duration
                </p>
                <p className="font-medium text-foreground">{plan.days} Days</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Budget
                </p>
                <p className="font-medium text-foreground">
                  ${plan.budgetMin} - ${plan.budgetMax}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Dates
                </p>
                <p className="font-medium text-foreground">
                  {formattedStartDate} - {formattedEndDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section className="container mx-auto px-4 -mt-16">
        <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-xl max-w-5xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center md:justify-start">
                <MapPin className="w-8 h-8 mr-3 text-primary" />
                Detailed Itinerary
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                A day-by-day breakdown of activities and destinations for this
                awesome {plan.days}-day trip to {plan.destination.country}.
              </p>
            </div>

            {plan.itinerary && plan.itinerary.length > 0 ? (
              <ItineraryTimeline itinerary={plan.itinerary} />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border/60">
                <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No Itinerary Generated
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  This travel plan does not have a detailed itinerary yet. If
                  you are the owner, you can edit this plan to add activities.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
