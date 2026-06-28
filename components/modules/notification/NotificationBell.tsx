"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { INotification } from "@/types/joinRequest.types";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface NotificationBellProps {
  onOpenPanel?: () => void;
  userId?: string; // Fix 1: added missing prop
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

export function NotificationBell({ onOpenPanel }: NotificationBellProps) {
  const { liveNotifications, unreadCount, markAllRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [newNotifId, setNewNotifId] = useState<string | null>(null);
  const prevCountRef = useRef(unreadCount);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fix 2: defer setState with setTimeout to avoid synchronous setState in effect
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      const newest = liveNotifications[0];
      if (newest) {
        timeoutRef.current = setTimeout(() => {
          setNewNotifId(newest._id);
        }, 0);
        setTimeout(() => setNewNotifId(null), 4000);
      }
    }
    prevCountRef.current = unreadCount;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [unreadCount, liveNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    setIsOpen((v) => !v);
    if (!isOpen && unreadCount > 0) markAllRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={handleToggle}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-muted/60 hover:bg-muted transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="w-5 h-5 text-foreground/70" />

        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-4.5 h-4.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1 shadow-md"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring on new notification */}
        <AnimatePresence>
          {newNotifId && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: 2 }}
              className="absolute inset-0 rounded-full bg-primary/40"
            />
          )}
        </AnimatePresence>
      </button>

      {/* Live toast for new notification */}
      <AnimatePresence>
        {newNotifId && liveNotifications[0] && (
          <LiveToast
            notification={liveNotifications[0]}
            onDismiss={() => setNewNotifId(null)}
          />
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-elegant z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <span className="font-semibold text-sm text-foreground">
                Notifications
              </span>
              {liveNotifications.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
              {liveNotifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                liveNotifications.map((notif) => (
                  <NotificationItem key={notif._id} notif={notif} />
                ))
              )}
            </div>

            <div className="px-4 py-3 border-t border-border/40 bg-muted/30">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenPanel?.();
                }}
                className="w-full text-center text-xs text-primary hover:underline font-medium"
              >
                View all join requests →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ notif }: { notif: INotification }) {
  const { joinRequest: req } = notif;

  return (
    <div
      className={`flex gap-3 px-4 py-3 transition-colors hover:bg-muted/40 ${!notif.isRead ? "bg-primary/4" : ""}`}
    >
      <div className="relative shrink-0">
        {req?.requester.picture ? (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={req.requester.picture}
              alt={req.requester.name}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {req?.requester.name.charAt(0)}
          </div>
        )}
        {!notif.isRead && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">
          <span className="font-semibold">{req?.requester.name}</span> wants to
          join your trip to{" "}
          <span className="font-semibold text-primary">
            {req?.travelPlan.destination.city ||
              req?.travelPlan.destination.country}
          </span>
        </p>
        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {req?.requester.currentLocation || "Unknown location"}
          <span className="ml-auto">{timeAgo(notif.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function LiveToast({
  notification,
  onDismiss,
}: {
  notification: INotification;
  onDismiss: () => void;
}) {
  const { joinRequest: req } = notification;

  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 right-6 z-9999 w-80 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-elegant overflow-hidden"
    >
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute top-0 left-0 h-0.5 w-full bg-primary origin-left"
      />

      <div className="flex gap-3 p-4">
        <div className="relative shrink-0">
          {req?.requester.picture ? (
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/30">
              <Image
                src={req.requester.picture}
                alt={req.requester.name}
                width={44}
                height={44}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {req?.requester.name.charAt(0)}
            </div>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <Bell className="w-2.5 h-2.5 text-primary-foreground" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">
            New Join Request
          </p>
          <p className="text-sm font-medium text-foreground leading-snug">
            {req?.requester.name} wants to join your trip to{" "}
            {req?.travelPlan.destination.city ||
              req?.travelPlan.destination.country}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {req?.requester.currentLocation}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}
