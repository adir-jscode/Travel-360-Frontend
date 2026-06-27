import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ITravelPlan, TravelType } from "@/types/travelPlan.types";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface TravelPlanCardProps {
  plan: ITravelPlan;
  href?: string;
}

export function TravelPlanCard({ plan, href }: TravelPlanCardProps) {
  const formattedStartDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(plan.startDate));

  const formattedEndDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(plan.endDate));

  // Determine accent color based on travel type
  const typeStyles = useMemo(() => {
    switch (plan.travelType) {
      case TravelType.FAMILY:
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case TravelType.FRIENDS:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case TravelType.SOLO:
      default:
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  }, [plan.travelType]);

  const CardBody = (
    <Card className="group h-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white/10 dark:bg-black/20 dark:hover:bg-black/40 relative">
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CardContent className="p-6 relative z-10 flex flex-col h-full">
        {/* Header section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 line-clamp-1">
              {plan.destination.city ? `${plan.destination.city}, ` : ""}
              {plan.destination.country}
            </h3>
            <div className="flex items-center text-muted-foreground mt-1 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{plan.destination.country}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`ml-2 whitespace-nowrap capitalize ${typeStyles}`}
          >
            <Users className="w-3 h-3 mr-1" />
            {plan.travelType.toLowerCase()}
          </Badge>
        </div>

        {/* Details section */}
        <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <span>{plan.days} Days</span>
            </div>
            <span className="font-medium text-foreground text-xs">
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
              <span>Budget</span>
            </div>
            <span className="font-semibold text-foreground">
              ${plan.budgetMin} - ${plan.budgetMax}
            </span>
          </div>
        </div>

        {/* Hover action indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-primary to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      >
        {CardBody}
      </Link>
    );
  }

  return CardBody;
}
