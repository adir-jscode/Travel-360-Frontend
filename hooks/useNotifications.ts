"use client";

import {
  IJoinRequest,
  INotification,
  JoinRequestStatus,
} from "@/types/joinRequest.types";
import { useCallback, useEffect, useRef, useState } from "react";

// Mock data — replace with real SSE/WebSocket when API is ready
const MOCK_PENDING: IJoinRequest[] = [
  {
    _id: "req_001",
    travelPlan: {
      _id: "plan_001",
      destination: { city: "Lisbon", country: "Portugal" },
      startDate: "2025-09-10T00:00:00.000Z",
      endDate: "2025-09-20T00:00:00.000Z",
      days: 10,
      travelType: "FRIENDS",
    },
    requester: {
      _id: "usr_a",
      name: "Ayesha Rahman",
      email: "ayesha@example.com",
      picture: "https://i.pravatar.cc/80?img=47",
      currentLocation: "Dhaka, Bangladesh",
      travelInterest: ["Culture", "Food", "Architecture"],
      rating: 4.8,
    },
    planOwner: "me",
    status: JoinRequestStatus.PENDING,
    message:
      "Hey! I've been dreaming of Lisbon for years. Your itinerary looks perfect — would love to join if there's still room!",
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    _id: "req_002",
    travelPlan: {
      _id: "plan_001",
      destination: { city: "Lisbon", country: "Portugal" },
      startDate: "2025-09-10T00:00:00.000Z",
      endDate: "2025-09-20T00:00:00.000Z",
      days: 10,
      travelType: "FRIENDS",
    },
    requester: {
      _id: "usr_b",
      name: "Carlos Mendez",
      email: "carlos@example.com",
      picture: "https://i.pravatar.cc/80?img=68",
      currentLocation: "Madrid, Spain",
      travelInterest: ["Photography", "History", "Street Art"],
      rating: 4.5,
    },
    planOwner: "me",
    status: JoinRequestStatus.PENDING,
    message:
      "Your plan looks amazing. I'm a photographer and can document the whole trip!",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

const MOCK_ACCEPTED: IJoinRequest[] = [
  {
    _id: "req_003",
    travelPlan: {
      _id: "plan_002",
      destination: { city: "Kyoto", country: "Japan" },
      startDate: "2025-04-01T00:00:00.000Z",
      endDate: "2025-04-14T00:00:00.000Z",
      days: 14,
      travelType: "FRIENDS",
    },
    requester: {
      _id: "usr_c",
      name: "Sakura Tanaka",
      email: "sakura@example.com",
      picture: "https://i.pravatar.cc/80?img=32",
      currentLocation: "Tokyo, Japan",
      travelInterest: ["Temples", "Tea Ceremony", "Ikebana"],
      rating: 5.0,
    },
    planOwner: "me",
    status: JoinRequestStatus.ACCEPTED,
    message: "I know Kyoto well — happy to be a local guide for the group!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    _id: "req_004",
    travelPlan: {
      _id: "plan_002",
      destination: { city: "Kyoto", country: "Japan" },
      startDate: "2025-04-01T00:00:00.000Z",
      endDate: "2025-04-14T00:00:00.000Z",
      days: 14,
      travelType: "FRIENDS",
    },
    requester: {
      _id: "usr_d",
      name: "Jordan Lee",
      email: "jordan@example.com",
      picture: "https://i.pravatar.cc/80?img=12",
      currentLocation: "San Francisco, USA",
      travelInterest: ["Anime", "Street Food", "Technology"],
      rating: 4.2,
    },
    planOwner: "me",
    status: JoinRequestStatus.ACCEPTED,
    message: "First time to Japan! So excited to explore Kyoto with a group.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
];

const MOCK_REJECTED: IJoinRequest[] = [
  {
    _id: "req_005",
    travelPlan: {
      _id: "plan_001",
      destination: { city: "Lisbon", country: "Portugal" },
      startDate: "2025-09-10T00:00:00.000Z",
      endDate: "2025-09-20T00:00:00.000Z",
      days: 10,
      travelType: "FRIENDS",
    },
    requester: {
      _id: "usr_e",
      name: "Priya Sharma",
      email: "priya@example.com",
      picture: "https://i.pravatar.cc/80?img=56",
      currentLocation: "Mumbai, India",
      travelInterest: ["Beaches", "Nightlife", "Shopping"],
      rating: 3.9,
    },
    planOwner: "me",
    status: JoinRequestStatus.REJECTED,
    message: "Looking for travel buddies for the Portugal trip!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
];

export function useNotifications() {
  const [pending, setPending] = useState<IJoinRequest[]>(MOCK_PENDING);
  const [accepted, setAccepted] = useState<IJoinRequest[]>(MOCK_ACCEPTED);
  const [rejected, setRejected] = useState<IJoinRequest[]>(MOCK_REJECTED);
  const [liveNotifications, setLiveNotifications] = useState<INotification[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate a new incoming join request after 8 seconds
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const simulatedRequest: IJoinRequest = {
        _id: `req_live_${Date.now()}`,
        travelPlan: {
          _id: "plan_001",
          destination: { city: "Lisbon", country: "Portugal" },
          startDate: "2025-09-10T00:00:00.000Z",
          endDate: "2025-09-20T00:00:00.000Z",
          days: 10,
          travelType: "FRIENDS",
        },
        requester: {
          _id: "usr_live",
          name: "Nina Petrov",
          email: "nina@example.com",
          picture: "https://i.pravatar.cc/80?img=25",
          currentLocation: "Prague, Czech Republic",
          travelInterest: ["Architecture", "Wine", "Jazz"],
          rating: 4.7,
        },
        planOwner: "me",
        status: JoinRequestStatus.PENDING,
        message:
          "I noticed your Lisbon trip — I'll be in Portugal the same dates and would love to connect!",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const notification: INotification = {
        _id: `notif_${Date.now()}`,
        joinRequest: simulatedRequest,
        type: "JOIN_REQUEST",
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setPending((prev) => [simulatedRequest, ...prev]);
      setLiveNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }, 8000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
    setLiveNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const acceptRequest = useCallback((requestId: string) => {
    setPending((prev) => {
      const req = prev.find((r) => r._id === requestId);
      if (!req) return prev;
      setAccepted((acc) => [
        { ...req, status: JoinRequestStatus.ACCEPTED },
        ...acc,
      ]);
      return prev.filter((r) => r._id !== requestId);
    });
  }, []);

  const rejectRequest = useCallback((requestId: string) => {
    setPending((prev) => {
      const req = prev.find((r) => r._id === requestId);
      if (!req) return prev;
      setRejected((rej) => [
        { ...req, status: JoinRequestStatus.REJECTED },
        ...rej,
      ]);
      return prev.filter((r) => r._id !== requestId);
    });
  }, []);

  return {
    pending,
    accepted,
    rejected,
    liveNotifications,
    unreadCount,
    markAllRead,
    acceptRequest,
    rejectRequest,
  };
}
