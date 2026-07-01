import { Globe2, PlaneTakeoff, Star, Users } from "lucide-react";

const stats = [
  { icon: Users, value: "12,400+", label: "Travelers matched", tone: "text-primary" },
  { icon: Globe2, value: "86", label: "Countries covered", tone: "text-ocean" },
  { icon: PlaneTakeoff, value: "3,150", label: "Trips hosted", tone: "text-jungle" },
  { icon: Star, value: "4.8/5", label: "Average trip rating", tone: "text-amber-500" },
];

export function StatsBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map(({ icon: Icon, value, label, tone }) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-current/10 ${tone}`}
            >
              <Icon className={`h-5 w-5 ${tone}`} />
            </span>
            <div>
              <p className="text-2xl font-black leading-none text-foreground">
                {value}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
