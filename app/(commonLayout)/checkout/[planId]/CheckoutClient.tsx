"use client";

import { ISubscriptionPlan } from "@/services/subscription/subscription.service";
import { IUser } from "@/types/user.types";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ExternalLink,
  Loader2,
  Lock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  plan: ISubscriptionPlan;
  user: IUser;
}

const PLAN_COLOR: Record<string, string> = {
  EXPLORER: "text-[oklch(0.55_0.13_230)]",
  WANDERER: "text-primary",
  VOYAGER: "text-[oklch(0.5_0.13_155)]",
};

export default function CheckoutClient({ plan, user }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const planKey = plan.name.toUpperCase();
  const planColor = PLAN_COLOR[planKey] ?? "text-primary";
  const planLabel = plan.name.charAt(0) + plan.name.slice(1).toLowerCase();

  async function handlePay() {
    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan._id }),
      });

      const data = await res.json();

      if (data.success && data.data?.checkoutUrl) {
        // Redirect browser to Stripe-hosted checkout page
        window.location.href = data.data.checkoutUrl;
      } else {
        setStatus("error");
        setServerError(
          data.message || "Something went wrong. Please try again.",
        );
      }
    } catch {
      setStatus("error");
      setServerError(
        "Network error. Please check your connection and try again.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/pricing")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to pricing
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* LEFT */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Complete your order
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {
                  "You'll be redirected to Stripe's secure checkout to enter your payment details."
                }
              </p>
            </div>

            {/* Account info */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-(--shadow-soft)">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Account
              </h2>
              <div className="flex items-center gap-4">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    height={38}
                    width={38}
                    className="w-11 h-11 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold text-base">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs rounded-full bg-success/15 text-success px-2.5 py-1 font-medium">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-(--shadow-soft)">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                What happens next
              </h2>
              <ol className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Redirect to Stripe",
                    desc: "Click the button below to go to Stripe's secure payment page.",
                  },
                  {
                    step: "2",
                    title: "Enter payment details",
                    desc: "Fill in your card information on Stripe's encrypted checkout.",
                  },
                  {
                    step: "3",
                    title: "Instant activation",
                    desc: `Your ${planLabel} plan activates the moment payment is confirmed.`,
                  },
                ].map(({ step, title, desc }) => (
                  <li key={step} className="flex gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-secondary text-foreground text-xs font-bold flex items-center justify-center">
                      {step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Error banner */}
            {serverError && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {serverError}
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-primary text-primary-foreground py-4 px-6 font-semibold text-base shadow-(--shadow-glow) hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing checkout...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ${plan.price.toFixed(2)} with Stripe
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </>
              )}
            </button>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
              {[
                { label: "Powered by Stripe" },
                { label: "PCI DSS compliant" },
                { label: "Global payments" },
              ].map(({ label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Order summary */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-(--shadow-elegant)">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                Order summary
              </h2>

              {/* Plan header */}
              <div className="flex items-start gap-3 pb-5 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <Zap className={`w-5 h-5 ${planColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${planColor}`}>
                    {planLabel} Plan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Monthly subscription · {plan.duration} days
                  </p>
                </div>
              </div>

              {/* Features */}
              <ul className="py-5 space-y-2.5 border-b border-border">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-foreground/70"
                  >
                    <Check
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${planColor}`}
                    />
                    {f}
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-xs text-muted-foreground pl-5">
                    +{plan.features.length - 4} more features
                  </li>
                )}
              </ul>

              {/* Price — no tax */}
              <div className="pt-5">
                <div className="flex justify-between font-bold text-foreground text-base">
                  <span>Total due today</span>
                  <span>${plan.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Billed monthly · Cancel anytime
                </p>
              </div>
            </div>

            {/* Guarantee */}
            <div className="rounded-xl border border-success/20 bg-success/8 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    7-day money-back guarantee
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {"Not happy? We'll refund you — no questions asked."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
