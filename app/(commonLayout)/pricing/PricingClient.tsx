"use client";

import { ISubscriptionPlan } from "@/services/subscription/subscription.service";
import { IUser } from "@/types/user.types";
import {
  ArrowRight,
  Check,
  Compass,
  Globe,
  Map,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  plans: ISubscriptionPlan[];
  user: IUser | null;
}

const PLAN_META: Record<
  string,
  {
    icon: React.ReactNode;
    tagline: string;
    accent: string;
    bg: string;
    border: string;
    badge?: string;
    textAccent: string;
    btnClass: string;
  }
> = {
  EXPLORER: {
    icon: <Compass className="w-6 h-6" />,
    tagline: "Start your journey",
    accent: "from-ocean/20 to-ocean/5",
    bg: "bg-card",
    border: "border-border",
    textAccent: "text-ocean",
    btnClass: "bg-foreground text-background hover:bg-foreground/90",
  },
  WANDERER: {
    icon: <Map className="w-6 h-6" />,
    tagline: "For the passionate traveler",
    accent: "from-primary/25 to-sunset/10",
    bg: "bg-card",
    border: "border-primary",
    badge: "Most Popular",
    textAccent: "text-primary",
    btnClass:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow)]",
  },
  VOYAGER: {
    icon: <Globe className="w-6 h-6" />,
    tagline: "Unlimited horizons",
    accent: "from-jungle/20 to-jungle/5",
    bg: "bg-card",
    border: "border-border",
    textAccent: "text-jungle",
    btnClass: "bg-foreground text-background hover:bg-foreground/90",
  },
};

const FALLBACK_PLANS: ISubscriptionPlan[] = [
  {
    _id: "explorer",
    name: "EXPLORER",
    price: 0,
    duration: 30,
    features: [
      "Browse public travel plans",
      "Join up to 2 trips per month",
      "Basic traveler profile",
      "Community access",
    ],
    sortOrder: 1,
  },
  {
    _id: "wanderer",
    name: "WANDERER",
    price: 9.99,
    duration: 30,
    features: [
      "Everything in Explorer",
      "Create unlimited travel plans",
      "AI itinerary generation",
      "Priority trip matching",
      "Advanced profile & portfolio",
    ],
    sortOrder: 2,
  },
  {
    _id: "voyager",
    name: "VOYAGER",
    price: 19.99,
    duration: 30,
    features: [
      "Everything in Wanderer",
      "Verified traveler badge",
      "Dedicated travel concierge",
      "Exclusive group expeditions",
      "Early access to new features",
      "Analytics & travel insights",
    ],
    sortOrder: 3,
  },
];

const TESTIMONIALS = [
  {
    name: "Sofia R.",
    plan: "WANDERER",
    text: "The AI trip builder alone is worth every cent. Planning Patagonia took me 20 minutes.",
    rating: 5,
    country: "🇧🇷",
  },
  {
    name: "James K.",
    plan: "VOYAGER",
    text: "Met my travel crew through this platform. Three continents together and counting.",
    rating: 5,
    country: "🇬🇧",
  },
  {
    name: "Amara T.",
    plan: "WANDERER",
    text: "Switched from another app and never looked back. The matching is genuinely good.",
    rating: 5,
    country: "🇬🇭",
  },
];

export default function PricingClient({ plans, user }: Props) {
  const router = useRouter();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const displayPlans = plans && plans.length > 0 ? plans : FALLBACK_PLANS;

  const currentPlan = user?.subscription?.plan;

  function handleSelectPlan(plan: ISubscriptionPlan) {
    if (!user) {
      router.push(`/login?redirect=/checkout/${plan._id}`);
      return;
    }
    router.push(`/checkout/${plan._id}`);
  }

  function getPlanKey(name: string): string {
    return name.toUpperCase();
  }

  function isCurrentPlan(planName: string): boolean {
    return currentPlan === planName.toUpperCase();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24 pb-16 px-4">
        {/* Background orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute top-20 right-0 w-75 h-75 rounded-full bg-ocean/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-62.5 h-62.5 rounded-full bg-jungle/8 blur-[80px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm text-primary font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple, honest pricing
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.08] mb-5">
            Choose your
            <br />
            <span className="bg-linear-to-r from-sunset via-primary to-primary-glow bg-clip-text text-transparent">
              adventure tier
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re taking your first trip or crossing your 50th
            border, there&apos;s a plan built for your rhythm.
          </p>
        </div>
      </section>

      {/* ── Plans grid ───────────────────────────────────────── */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {displayPlans.map((plan) => {
            const key = getPlanKey(plan.name);
            const meta = PLAN_META[key] ?? PLAN_META["EXPLORER"];
            const isCurrent = isCurrentPlan(plan.name);
            const isHovered = hoveredPlan === plan._id;
            const isPopular = !!meta.badge;

            return (
              <div
                key={plan._id}
                onMouseEnter={() => setHoveredPlan(plan._id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`
                  relative flex flex-col rounded-2xl border-2 p-7 transition-all duration-300
                  ${meta.bg} ${meta.border}
                  ${isPopular ? "md:-mt-4 md:mb-0 shadow-(--shadow-glow)" : "shadow-(--shadow-soft)"}
                  ${isHovered && !isPopular ? "shadow-(--shadow-elegant) -translate-y-1" : ""}
                `}
              >
                {/* Popular badge */}
                {meta.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground">
                      <Zap className="w-3 h-3" />
                      {meta.badge}
                    </span>
                  </div>
                )}

                {/* Gradient wash */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-linear-to-b ${meta.accent} pointer-events-none`}
                />

                <div className="relative">
                  {/* Icon + name */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div
                        className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-background border border-border mb-3 ${meta.textAccent}`}
                      >
                        {meta.icon}
                      </div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-0.5">
                        {meta.tagline}
                      </p>
                      <h2 className={`text-xl font-bold ${meta.textAccent}`}>
                        {plan.name.charAt(0) + plan.name.slice(1).toLowerCase()}
                      </h2>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-extrabold text-foreground">
                        Free
                      </span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-muted-foreground">
                          $
                        </span>
                        <span className="text-4xl font-extrabold text-foreground">
                          {plan.price.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          / mo
                        </span>
                      </>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature: string, index: number) => (
                      <li
                        key={`${plan._id}-${index}`}
                        className="flex items-start gap-3 text-sm text-foreground/80"
                      >
                        <span
                          className={`mt-0.5 fshrink-0 w-4 h-4 rounded-full flex items-center justify-center ${meta.textAccent} bg-background border border-current/30`}
                        >
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrent || plan.price === 0}
                    className={`
                      group w-full flex items-center justify-center gap-2 rounded-xl py-3 px-5
                      text-sm font-semibold transition-all duration-200
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${meta.btnClass}
                    `}
                  >
                    {isCurrent ? (
                      "Current Plan"
                    ) : (
                      <>
                        {plan.price === 0 ? "Get started free" : "Get started"}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  {plan.price > 0 && (
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      Cancel anytime · No hidden fees
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary/40 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { stat: "50K+", label: "Travelers" },
            { stat: "120+", label: "Countries covered" },
            { stat: "4.9★", label: "App rating" },
            { stat: "99%", label: "Satisfaction rate" },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold text-foreground">{stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-foreground mb-12">
            From travelers who&apos;ve been there
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => {
              const meta = PLAN_META[t.plan] ?? PLAN_META["EXPLORER"];
              return (
                <div
                  key={t.name}
                  className="rounded-2xl border border-border bg-card p-6 shadow-(--shadow-soft)"
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-base">
                      {t.country}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.name}
                      </p>
                      <p className={`text-xs ${meta.textAccent}`}>
                        {t.plan.charAt(0) + t.plan.slice(1).toLowerCase()} Plan
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ strip ────────────────────────────────────────── */}
      <section className="pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-foreground mb-10">
            Common questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes — upgrade or downgrade at any time. Changes take effect on your next billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major cards (Visa, Mastercard, Amex) and PayPal.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "The Explorer plan is free forever. Paid plans don't have a trial, but you can cancel within 7 days for a full refund.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="font-semibold text-foreground mb-1.5">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
