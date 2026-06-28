"use client";

import {
  getIncomingRequests,
  respondToJoinRequest,
} from "@/services/joinRequest/joinRequest.service";
import {
  IJoinRequest,
  INotification,
  JoinRequestStatus,
} from "@/types/joinRequest.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API_URL?.replace("/api/v1", "") ||
  "http://localhost:5000";

function notifToJoinRequest(notif: RawNotification): IJoinRequest | null {
  const meta = notif.metadata;
  if (!meta) return null;
  return {
    _id: meta.joinRequestId as string,
    travelPlan: {
      _id: (meta.travelPlanId as string) ?? "",
      destination: { city: undefined, country: "" },
      startDate: "",
      endDate: "",
      days: 0,
      travelType: "",
    },
    requester: {
      _id: (notif.sender?._id as string) ?? "",
      name:
        (meta.requesterName as string) ??
        (notif.sender?.name as string) ??
        "Unknown",
      email: "",
      picture:
        (meta.requesterPicture as string) ??
        (notif.sender?.picture as string) ??
        undefined,
    },
    planOwner: "",
    status: JoinRequestStatus.PENDING,
    message: notif.message,
    createdAt: notif.createdAt,
    updatedAt: notif.createdAt,
  };
}

interface RawNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
  sender?: { _id: string; name: string; picture?: string };
}

export function useNotifications(userId?: string) {
  const [pending, setPending] = useState<IJoinRequest[]>([]);
  const [accepted, setAccepted] = useState<IJoinRequest[]>([]);
  const [rejected, setRejected] = useState<IJoinRequest[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<INotification[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // ── Fetch incoming join requests ───────────────────────────────────────
  // Call the server action directly — it already handles auth via serverFetch,
  // so no cookie/header forwarding needed. The /api/join-request/incoming
  // route handler is no longer used and can be deleted.
  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getIncomingRequests();
      if (data.success && Array.isArray(data.data)) {
        const all: IJoinRequest[] = data.data;
        setPending(all.filter((r) => r.status === JoinRequestStatus.PENDING));
        setAccepted(all.filter((r) => r.status === JoinRequestStatus.ACCEPTED));
        setRejected(all.filter((r) => r.status === JoinRequestStatus.REJECTED));
      }
    } catch (err) {
      console.error("[useNotifications] fetchRequests error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Fetch unread count ─────────────────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/notifications/unread-count", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) setUnreadCount(data.data ?? 0);
    } catch (err) {
      console.error("[useNotifications] fetchUnreadCount error:", err);
    }
  }, [userId]);

  // ── Initial data load ──────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    fetchRequests();
    fetchUnreadCount();
  }, [userId, fetchRequests, fetchUnreadCount]);

  // ── Socket.IO connection for real-time notifications ───────────────────
  useEffect(() => {
    if (!userId) return;

    const socket = io(BASE_API, {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on("notification", (rawNotif: RawNotification) => {
      const notif: INotification = {
        _id: rawNotif._id,
        type: rawNotif.type as "JOIN_REQUEST",
        isRead: false,
        createdAt: rawNotif.createdAt,
        joinRequest: notifToJoinRequest(rawNotif) as IJoinRequest,
      };

      setLiveNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);

      if (
        rawNotif.type === "JOIN_REQUEST" ||
        rawNotif.type === "REQUEST_ACCEPTED" ||
        rawNotif.type === "REQUEST_REJECTED"
      ) {
        fetchRequests();
      }
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, fetchRequests]);

  // ── Mark all read ──────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    setUnreadCount(0);
    setLiveNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        credentials: "include",
      });
    } catch {
      // swallow
    }
  }, []);

  // ── Accept / Reject helpers ────────────────────────────────────────────
  const acceptRequest = useCallback(async (requestId: string) => {
    const result = await respondToJoinRequest(requestId, "accept");
    if (result.success) {
      setPending((prev) => {
        const req = prev.find((r) => r._id === requestId);
        if (req) {
          setAccepted((acc) => [
            { ...req, status: JoinRequestStatus.ACCEPTED },
            ...acc,
          ]);
        }
        return prev.filter((r) => r._id !== requestId);
      });
    }
    return result;
  }, []);

  const rejectRequest = useCallback(async (requestId: string) => {
    const result = await respondToJoinRequest(requestId, "reject");
    if (result.success) {
      setPending((prev) => {
        const req = prev.find((r) => r._id === requestId);
        if (req) {
          setRejected((rej) => [
            { ...req, status: JoinRequestStatus.REJECTED },
            ...rej,
          ]);
        }
        return prev.filter((r) => r._id !== requestId);
      });
    }
    return result;
  }, []);

  return {
    pending,
    accepted,
    rejected,
    liveNotifications,
    unreadCount,
    loading,
    markAllRead,
    acceptRequest,
    rejectRequest,
    refetch: fetchRequests,
  };
}
