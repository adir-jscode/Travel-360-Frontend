import { CreateAiTravelPlanModal } from "@/components/modules/travelPlan/CreateAiTravelPlanModal";
import { CreateTravelPlanModal } from "@/components/modules/travelPlan/CreateTravelPlanModal";
import { EditTravelPlanModal } from "@/components/modules/travelPlan/EditTravelPlanModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyTravelPlans } from "@/services/travelPlan/travelPlan.service";
import { ITravelPlan } from "@/types/travelPlan.types";
import { Compass, Map, Plane } from "lucide-react";
import Link from "next/link";

export default async function UserTravelPlansPage() {
  const result = await getMyTravelPlans();
  const plans: ITravelPlan[] = result?.success ? result.data : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Plane className="w-8 h-8 mr-3 text-primary" />
            My Travel Plans
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your itineraries and plan your next big adventure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateTravelPlanModal />
          <CreateAiTravelPlanModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <Card className="col-span-full border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <Compass className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Plans Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                You have not created any travel plans yet. Start planning your
                next trip manually or let our AI do the heavy lifting!
              </p>
              <div className="flex gap-4">
                <CreateTravelPlanModal />
                <CreateAiTravelPlanModal />
              </div>
            </CardContent>
          </Card>
        ) : (
          plans.map((plan) => (
            <Card
              key={plan._id}
              className="group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl flex flex-col gap-1">
                    <span className="font-bold line-clamp-1">
                      {plan.destination.city
                        ? `${plan.destination.city}, `
                        : ""}
                      {plan.destination.country}
                    </span>
                    <Badge
                      variant={
                        plan.visibility === "PUBLIC" ? "default" : "secondary"
                      }
                      className="w-fit text-[10px] px-2 py-0"
                    >
                      {plan.visibility}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-5 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Duration
                    </p>
                    <p className="font-medium text-sm">{plan.days} Days</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Budget
                    </p>
                    <p className="font-medium text-sm text-green-600 dark:text-green-400">
                      ${plan.budgetMin} - ${plan.budgetMax}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Dates
                    </p>
                    <p className="font-medium text-sm">
                      {new Date(plan.startDate).toLocaleDateString()} -{" "}
                      {new Date(plan.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex gap-2 pt-4 border-t">
                  <Link href={`/travel-plans/${plan._id}`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full h-8">
                      <Map className="w-3.5 h-3.5 mr-2" />
                      View Full
                    </Button>
                  </Link>
                  <EditTravelPlanModal plan={plan} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
