import { TravelPlanSearch } from "@/components/modules/travelPlan/TravelPlanSearch";
import { Badge } from "@/components/ui/badge";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getAllTravelPlans } from "@/services/travelPlan/travelPlan.service";
import { ITravelPlan } from "@/types/travelPlan.types";
import { SUBSCRIPTION_PLAN } from "@/types/user.types";
import { Compass, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";

export default async function TravelPlansExplorePage() {
  const [result, user] = await Promise.all([
    getAllTravelPlans(),
    getUserInfo(),
  ]);
  const plans: ITravelPlan[] = result?.success ? result.data : [];

  const isLoggedIn = !!user;
  const hasSubscription =
    !!user?.subscription?.isActive &&
    !!user?.subscription?.plan &&
    user.subscription.plan !== SUBSCRIPTION_PLAN.EXPLORER;

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
            alt="World travel"
            fill
            priority
            className="object-cover"
          />
          {/* Layered gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-background" />
          <div className="absolute inset-0 bg-linear-to-r from-primary/30 via-transparent to-ocean/20 mix-blend-color" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-16 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-ocean/10 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 pt-20 pb-40">
          {/* Eyebrow */}
          <div className="flex justify-center mb-6">
            <Badge className="bg-white/15 text-white border-white/25 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide">
              <Compass className="w-3.5 h-3.5 mr-1.5" />
              Community Itineraries
            </Badge>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              Find your next
              <br />
              <span className="text-gradient-sunset">adventure</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Browse real itineraries from real travelers. Filter by destination
              and dates to find a plan that matches your dream trip.
            </p>

            {/* Stats strip */}
            <div className="mt-10 flex items-center justify-center gap-8 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  <strong className="text-white font-semibold">
                    {plans.length}+
                  </strong>{" "}
                  public plans
                </span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI-powered & human-crafted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search + Results ──────────────────────────────────── */}
      <section className="container mx-auto px-4 -mt-20 relative z-20">
        <TravelPlanSearch
          initialPlans={plans}
          isLoggedIn={isLoggedIn}
          hasSubscription={hasSubscription}
          currentUserId={user?._id}
        />
      </section>
    </main>
  );
}
