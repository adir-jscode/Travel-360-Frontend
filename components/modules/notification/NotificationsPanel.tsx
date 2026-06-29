"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { JoinRequestStatus } from "@/types/joinRequest.types";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, Inbox, X } from "lucide-react";
import { JoinRequestCard } from "./JoinRequestCard";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  userId,
}: NotificationsPanelProps) {
  const { pending, acceptRequest, rejectRequest } = useNotifications(userId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col bg-background/95 backdrop-blur-xl border-l border-border/60 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-lg leading-tight">
                    Join Requests
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {pending.length} pending{" "}
                    {pending.length === 1 ? "request" : "requests"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4.5 h-4.5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {pending.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-4">
                  {pending
                    .filter((r) => r.status === JoinRequestStatus.PENDING)
                    .map((req) => (
                      <JoinRequestCard
                        key={req._id}
                        request={req}
                        onAccept={acceptRequest}
                        onReject={rejectRequest}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/40 bg-muted/20">
              <p className="text-xs text-muted-foreground text-center">
                Accepted and rejected trips are in{" "}
                <a
                  href="/user/dashboard/trip-requests"
                  className="text-primary hover:underline font-medium"
                >
                  Trip Requests
                </a>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center">
        <Inbox className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <div>
        <p className="font-semibold text-foreground">All caught up</p>
        <p className="text-sm text-muted-foreground mt-1">
          No pending join requests right now.
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-xl">
        <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
        Requests appear here in real time
      </div>
    </div>
  );
}
