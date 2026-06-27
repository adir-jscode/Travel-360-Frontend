import { TravelPlanCard } from "@/components/modules/travelPlan/TravelPlanCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllTravelPlans } from "@/services/travelPlan/travelPlan.service";
import { ITravelPlan } from "@/types/travelPlan.types";
import { MapPin, Search } from "lucide-react";
import Image from "next/image";

export default async function TravelPlansExplorePage() {
  const result = await getAllTravelPlans();
  const plans: ITravelPlan[] = result?.success ? result.data : [];

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
          alt="Travel Plans"
          width={1920}
          height={600}
          className="h-112.5 w-full object-cover"
        />

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            Discover the World
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight">
            Explore Curated{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-300 to-emerald-300">
              Travel Plans
            </span>
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto font-light">
            Find inspiration for your next adventure. Browse public itineraries
            created by our community and AI, and start packing.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-30">
        {/* Results Info */}
        <div className="bg-card/90 backdrop-blur-xl border shadow-xl rounded-2xl p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Public Itineraries</h2>
            <p className="text-sm text-muted-foreground">
              Showing {plans.length} available travel plans
            </p>
          </div>
        </div>

        {/* Grid */}
        {plans.length === 0 ? (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-2xl font-semibold mb-2">
                No travel plans found
              </h3>
              <p className="text-muted-foreground max-w-sm">
                There are no public travel plans available right now. Be the
                first to create one!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <TravelPlanCard
                key={plan._id}
                plan={plan}
                href={`/travel-plans/${plan._id}`}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
