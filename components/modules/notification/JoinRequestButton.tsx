"use client";

import { ITravelPlan } from "@/types/travelPlan.types";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, SendHorizontal, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JoinRequestButtonProps {
  plan: ITravelPlan;
  isLoggedIn: boolean;
  hasAlreadyRequested?: boolean;
  className?: string;
}

type ButtonState = "idle" | "composing" | "loading" | "sent";

export function JoinRequestButton({
  plan,
  isLoggedIn,
  hasAlreadyRequested = false,
  className = "",
}: JoinRequestButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<ButtonState>(
    hasAlreadyRequested ? "sent" : "idle",
  );
  const [message, setMessage] = useState("");

  const destination = plan.destination.city
    ? `${plan.destination.city}, ${plan.destination.country}`
    : plan.destination.country;

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/travel-plans");
      return;
    }
    if (state === "idle") setState("composing");
  };

  const handleSend = async () => {
    setState("loading");
    // Simulate API call — replace with real service call
    await new Promise((r) => setTimeout(r, 1200));
    setState("sent");
  };

  const handleCancel = () => {
    setState("idle");
    setMessage("");
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

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {state === "idle" && (
        <motion.button
          layout
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-amber-500 text-primary-foreground font-semibold text-sm shadow-glow hover:shadow-lg transition-all duration-200"
        >
          <UserPlus className="w-4 h-4" />
          {isLoggedIn ? "Request to Join" : "Sign in to Join"}
        </motion.button>
      )}

      <AnimatePresence>
        {state === "composing" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-border/60 bg-card/90 backdrop-blur-sm p-4 shadow-elegant">
              <p className="text-sm font-semibold text-foreground mb-1">
                Join trip to {destination}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Introduce yourself — a personal note gets faster responses.
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'd love to join your trip because..."
                className="w-full h-24 resize-none rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-primary to-amber-500 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <SendHorizontal className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {state === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-muted/60 text-muted-foreground text-sm font-medium"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending request…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
