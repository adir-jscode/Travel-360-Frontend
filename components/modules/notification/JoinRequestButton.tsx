"use client";

import { sendJoinRequest } from "@/services/joinRequest/joinRequest.service";
import { ITravelPlan } from "@/types/travelPlan.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Loader2,
  MapPin,
  SendHorizontal,
  UserPlus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface JoinRequestButtonProps {
  plan: ITravelPlan;
  isLoggedIn: boolean;
  hasSubscription?: boolean;
  hasAlreadyRequested?: boolean;
  className?: string;
}

type ButtonState = "idle" | "confirming" | "loading" | "sent";

export function JoinRequestButton({
  plan,
  isLoggedIn,
  hasSubscription = false,
  hasAlreadyRequested = false,
  className = "",
}: JoinRequestButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<ButtonState>("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  // FIX: track client-side mount so createPortal only runs after hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const destination = plan.destination.city
    ? `${plan.destination.city}, ${plan.destination.country}`
    : plan.destination.country;

  const handleClick = () => {
    if (hasAlreadyRequested) return;
    if (!isLoggedIn) {
      router.push(`/login?redirect=/travel-plans`);
      return;
    }
    if (!hasSubscription) {
      toast.error("A subscription plan is required to request to join trips.", {
        description: "Upgrade to Wanderer or Voyager to continue.",
        action: {
          label: "View Plans",
          onClick: () => router.push("/pricing"),
        },
      });
      router.push("/pricing");
      return;
    }
    setState("confirming");
  };

  const handleSend = async () => {
    setState("loading");
    setError(null);
    try {
      const result = await sendJoinRequest(plan._id, message || undefined);
      if (result.success) {
        setState("sent");
        toast.success("Request sent!", {
          description: `Your request to join the trip to ${destination} has been sent.`,
        });
      } else {
        setError(result.message || "Failed to send request");
        setState("confirming");
        toast.error(result.message || "Failed to send request");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setState("confirming");
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCancel = () => {
    setState("idle");
    setMessage("");
    setError(null);
  };

  if (state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 font-semibold text-sm ${className}`}
      >
        <Check className="w-4 h-4" />
        Request sent
      </motion.div>
    );
  }

  const modalContent = (
    <AnimatePresence>
      {(state === "confirming" || state === "loading") && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl p-6 shadow-2xl pointer-events-auto">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg leading-tight">
                      Confirm Join Request
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        {destination}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Send a join request to the trip organizer. A personal message
                helps you get accepted faster!
              </p>

              <div className="space-y-2 mb-5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'd love to join your trip because..."
                  rows={4}
                  disabled={state === "loading"}
                  className="w-full resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-50"
                />
              </div>

              {error && <p className="text-xs text-rose-500 mb-4">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={state === "loading"}
                  className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:bg-muted/60 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={state === "loading"}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-primary to-amber-500 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="w-4 h-4" />
                      Confirm &amp; Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {state === "idle" && (
        <motion.button
          layout
          whileHover={hasAlreadyRequested ? undefined : { scale: 1.02 }}
          whileTap={hasAlreadyRequested ? undefined : { scale: 0.98 }}
          onClick={handleClick}
          disabled={hasAlreadyRequested}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-amber-500 text-primary-foreground font-semibold text-sm shadow-glow hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:shadow-none"
        >
          <UserPlus className="w-4 h-4" />
          {isLoggedIn ? "Request to Join" : "Sign in to Join"}
        </motion.button>
      )}

      {/* Only render portal after client mount to avoid SSR/hydration mismatch */}
      {mounted && createPortal(modalContent, document.body)}
    </div>
  );
}
