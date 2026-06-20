import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "EXPLORER",
    price: "Free",
    period: "forever",
    description: "Browse and connect with the community.",
    features: [
      "Browse travelers",
      "3 travel plans",
      "Basic matching",
      "Community support",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "WANDERER",
    price: "$9",
    period: "per month",
    description: "For travelers who plan multiple trips a year.",
    features: [
      "Unlimited travel plans",
      "Smart matching",
      "Verified badge",
      "Priority in search",
      "Group itinerary tools",
    ],
    cta: "Start 7-day trial",
    featured: true,
  },
  {
    name: "VOYAGER",
    price: "$79",
    period: "per year",
    description: "Save 27% — best for frequent travelers.",
    features: [
      "Everything in Wanderer",
      "Concierge support",
      "Early access to features",
      "Annual swag drop",
    ],
    cta: "Go annual",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <section className="bg-[#faf8f6] py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
            Pricing
          </p>

          <h1 className="font-serif text-5xl font-black leading-none tracking-tight text-[#1f0d08] md:text-7xl">
            Simple plans for
            <br />
            every traveler
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Start free. Upgrade when you are ready for unlimited matches and a
            verified badge.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-[28px] border bg-white p-8 transition-all duration-300",
                plan.featured
                  ? "border-orange-300 shadow-xl shadow-orange-100"
                  : "border-neutral-200",
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 rounded-full lass `bg-gradient-to-r` can be written as `bg-linear-to-r from-orange-400 to-red-500 px-4 py-1 text-xs font-bold uppercase text-white">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <p className="text-sm font-extrabold tracking-widest text-[#5a4b45]">
                {plan.name}
              </p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-6xl font-black text-[#1f0d08]">
                  {plan.price}
                </span>

                <span className="mb-2 text-muted-foreground">
                  / {plan.period}
                </span>
              </div>

              <p className="mt-3 text-muted-foreground">{plan.description}</p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-orange-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  "mt-10 h-12 w-full rounded-full text-base font-semibold",
                  plan.featured
                    ? "border-0 ten as `bg-linear-to-r from-orange-400 to-red-500 text-white hover:opacity-90"
                    : "border border-neutral-200 bg-white text-black hover:bg-neutral-50",
                )}
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
