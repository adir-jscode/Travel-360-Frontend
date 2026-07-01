"use client";

import { updateTripStatus } from "@/services/trip/trip.service";
import { TripStatus } from "@/types/trip.types";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, CheckCircle2, Loader2, PartyPopper, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type PendingAction = "complete" | "cancel" | null;

interface TripStatusActionsProps {
  tripId: string;
  /** Is the current user the host of this trip? Only hosts may change status. */
  isHost: boolean;
  /** Date-derived status: has the trip's window started/ended? */
  dateStatus: "upcoming" | "ongoing" | "completed";
  /** Persisted status field on the trip document, if the host already set one. */
  persistedStatus?: TripStatus;
  destination: string;
  /** Called after a successful status change, with the new status. */
  onStatusChange?: (status: TripStatus) => void;
}

/**
 * Host controls for finishing up or calling off a trip.
 *
 * - "Cancel Trip" shows while the trip hasn't ended yet (upcoming/ongoing)
 *   and hasn't already been cancelled or completed.
 * - "Mark as Complete" shows once the trip is underway or its dates have
 *   passed, so the host can close it out (and unlock photo uploads for
 *   everyone on the trip).
 */
export function TripStatusActions({
  tripId,
  isHost,
  dateStatus,
  persistedStatus,
  destination,
  onStatusChange,
}: TripStatusActionsProps) {
  const [confirming, setConfirming] = useState<PendingAction>(null);
  const [isPending, startTransition] = useTransition();

  if (!isHost) return null;
  if (persistedStatus === TripStatus.CANCELLED) return null;

  const isAlreadyCompleted = persistedStatus === TripStatus.COMPLETED;
  const canCancel = !isAlreadyCompleted && dateStatus !== "completed";
  const canComplete =
    !isAlreadyCompleted && (dateStatus === "ongoing" || dateStatus === "completed");

  if (!canCancel && !canComplete) return null;

  const runUpdate = (action: PendingAction, status: TripStatus) => {
    startTransition(async () => {
      const result = await updateTripStatus(tripId, status);
      if (result.success) {
        toast.success(
          action === "complete" ? "Trip marked as complete!" : "Trip cancelled",
          {
            description:
              action === "complete"
                ? `Time to relive ${destination} — you can now add photos.`
                : `Your trip to ${destination} has been cancelled.`,
          },
        );
        onStatusChange?.(status);
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
      setConfirming(null);
    });
  };

  return (
    <>
      <div className="flex gap-2">
        {canComplete && (
          <button
            type="button"
            onClick={() => setConfirming("complete")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 text-sm font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            onClick={() => setConfirming("cancel")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all duration-200 text-sm font-semibold"
          >
            <Ban className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>

      <AnimatePresence>
        {confirming && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setConfirming(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card/95 backdrop-blur-xl p-6 shadow-2xl pointer-events-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      confirming === "complete"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {confirming === "complete" ? (
                      <PartyPopper className="w-5 h-5" />
                    ) : (
                      <TriangleAlert className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="font-bold text-foreground text-lg leading-tight">
                    {confirming === "complete" ? "Mark trip as complete?" : "Cancel this trip?"}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {confirming === "complete"
                    ? `This wraps up your trip to ${destination} and lets everyone upload photos and memories from it.`
                    : `This will cancel the trip to ${destination} for you and everyone joined. This can't be undone.`}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirming(null)}
                    disabled={isPending}
                    className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm text-muted-foreground hover:bg-muted/60 transition-colors font-medium disabled:opacity-50"
                  >
                    Go back
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      runUpdate(
                        confirming,
                        confirming === "complete"
                          ? TripStatus.COMPLETED
                          : TripStatus.CANCELLED,
                      )
                    }
                    disabled={isPending}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70 ${
                      confirming === "complete"
                        ? "bg-emerald-500 hover:opacity-90"
                        : "bg-rose-500 hover:opacity-90"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {confirming === "complete" ? "Completing…" : "Cancelling…"}
                      </>
                    ) : confirming === "complete" ? (
                      "Yes, mark complete"
                    ) : (
                      "Yes, cancel trip"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
