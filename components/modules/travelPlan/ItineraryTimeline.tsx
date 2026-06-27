import { IItinerary } from "@/types/travelPlan.types";
import { CheckCircle2, MapPin } from "lucide-react";

interface ItineraryTimelineProps {
  itinerary: IItinerary[];
}

export function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border/60 bg-muted/20">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium text-foreground">
          No Itinerary Found
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          This travel plan does not have a detailed itinerary yet.
        </p>
      </div>
    );
  }

  // Sort by day to ensure timeline order
  const sortedItinerary = [...itinerary].sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent">
      {sortedItinerary.map((dayPlan) => (
        <div
          key={dayPlan.day}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          {/* Timeline Node */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110">
            <span className="font-bold text-sm">{dayPlan.day}</span>
          </div>

          {/* Content Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:bg-card/80 hover:-translate-y-1">
            <div className="flex flex-col gap-2">
              <h4 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/80">
                Day {dayPlan.day}: {dayPlan.title}
              </h4>

              <div className="space-y-3 mt-3">
                {dayPlan.activities.map((activity, actIdx) => (
                  <div key={actIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
