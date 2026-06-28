"use client";

import { Badge } from "@/components/ui/badge";
import { IJoinRequest, JoinRequestStatus } from "@/types/joinRequest.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  MapPin,
  MessageSquare,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface JoinRequestCardProps {
  request: IJoinRequest;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  isProcessed?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const statusConfig = {
  [JoinRequestStatus.PENDING]: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  [JoinRequestStatus.ACCEPTED]: {
    label: "Accepted",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  [JoinRequestStatus.REJECTED]: {
    label: "Declined",
    className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
};

export function JoinRequestCard({
  request,
  onAccept,
  onReject,
  isProcessed = false,
}: JoinRequestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState<"accept" | "reject" | null>(null);

  const isPending = request.status === JoinRequestStatus.PENDING;
  const { label, className } = statusConfig[request.status];

  const handleAccept = () => {
    setAction("accept");
    setTimeout(() => onAccept?.(request._id), 400);
  };
  const handleReject = () => {
    setAction("reject");
    setTimeout(() => onReject?.(request._id), 400);
  };

  const startFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(request.travelPlan.startDate));
  const endFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(request.travelPlan.endDate));

  return (
    <AnimatePresence>
      {action !== "accept" && action !== "reject" && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/30 hover:shadow-soft transition-all duration-300"
        >
          {/* Status accent bar */}
          <div
            className={`h-0.5 w-full ${
              request.status === JoinRequestStatus.ACCEPTED
                ? "bg-linear-to-r from-emerald-400 to-teal-500"
                : request.status === JoinRequestStatus.REJECTED
                  ? "bg-linear-to-r from-rose-400 to-rose-600"
                  : "bg-linear-to-r from-primary to-amber-400"
            }`}
          />

          <div className="p-5">
            {/* Main row */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted ring-2 ring-border/50 group-hover:ring-primary/20 transition-all">
                  {request.requester.picture ? (
                    <Image
                      src={request.requester.picture}
                      alt={request.requester.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-primary bg-primary/10">
                      {request.requester.name.charAt(0)}
                    </div>
                  )}
                </div>
                {request.requester.rating && (
                  <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-0.5 bg-card border border-border/60 rounded-full px-1.5 py-0.5 shadow-soft">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold">
                      {request.requester.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-foreground leading-tight">
                      {request.requester.name}
                    </h3>
                    {request.requester.currentLocation && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {request.requester.currentLocation}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={`text-xs ${className}`}>
                      {label}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {timeAgo(request.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Trip info */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-primary" />
                    <span className="font-medium text-foreground">
                      {request.travelPlan.destination.city
                        ? `${request.travelPlan.destination.city}, `
                        : ""}
                      {request.travelPlan.destination.country}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    {startFmt} – {endFmt}
                  </span>
                  <span className="font-medium">
                    {request.travelPlan.days} days
                  </span>
                </div>

                {/* Interests */}
                {request.requester.travelInterest &&
                  request.requester.travelInterest.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {request.requester.travelInterest
                        .slice(0, 4)
                        .map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 rounded-full text-[11px] bg-primary/8 text-primary border border-primary/15 font-medium"
                          >
                            {interest}
                          </span>
                        ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Expandable message */}
            {request.message && (
              <div className="mt-4">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    Message from {request.requester.name.split(" ")[0]}
                  </span>
                  {expanded ? (
                    <ChevronUp className="w-3.5 h-3.5 ml-auto" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                  )}
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-3 rounded-xl bg-muted/50 border border-border/40 text-sm text-foreground/80 italic leading-relaxed">
                        {request.message}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Actions */}
            {isPending && !isProcessed && (
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 text-sm font-semibold"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/8 text-rose-500 border border-rose-500/20 hover:bg-rose-500/15 hover:border-rose-500/35 transition-all duration-200 text-sm font-semibold"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
