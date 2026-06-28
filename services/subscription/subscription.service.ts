"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface ISubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  sortOrder: number;
  isActive?: boolean;
}

export const getSubscriptionPlans = async (): Promise<ISubscriptionPlan[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1"}/subscription-plan`,
      { next: { revalidate: 3600, tags: ["subscription-plans"] } },
    );
    const result = await res.json();
    if (!result.success) return [];
    return result.data as ISubscriptionPlan[];
  } catch {
    return [];
  }
};

export const createSubscription = async (planId: string) => {
  try {
    const res = await serverFetch.post("/subscription", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
};
