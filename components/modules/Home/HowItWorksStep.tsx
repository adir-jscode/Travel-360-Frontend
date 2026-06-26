import { SectionHeader } from "@/components/shared/SectionHeader";
import { Compass, LucideIcon, Plane, Users } from "lucide-react";
interface HowItWorksStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  stepNumber: number;
}
export function HowItWorks() {
  const steps: HowItWorksStepProps[] = [
    {
      icon: Users,
      title: "Create your profile",
      description:
        "Tell us about your travel style, interests, and dream destinations.",
      stepNumber: 1,
    },
    {
      icon: Plane,
      title: "Share a travel plan",
      description: "Post your upcoming trip with dates, budget, and itinerary.",
      stepNumber: 2,
    },
    {
      icon: Compass,
      title: "Find your buddy",
      description:
        "Match with compatible travelers and start planning together.",
      stepNumber: 3,
    },
  ];
  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps to your next trip"
          subtitle="From signup to boarding pass in minutes."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-3xl border border-border bg-card p-8 shadow-soft"
            >
              <div className="absolute -top-4 left-8 inline-flex h-9 items-center rounded-full bg-gradient-sunset px-4 text-xs font-black uppercase tracking-wider text-white shadow-glow">
                Step {i + 1}
              </div>
              <s.icon className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
