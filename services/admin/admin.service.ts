"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getDashboardSummary() {
  try {
    const response = await serverFetch.get("/analytics/dashboard", {
      next: { tags: ["admin-analytics"], revalidate: 60 },
    });
    return await response.json();
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function getUserStats() {
  try {
    const response = await serverFetch.get("/analytics/users", {
      next: { tags: ["admin-analytics"] },
    });
    return await response.json();
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function getTravelPlanStats() {
  try {
    const response = await serverFetch.get("/analytics/travel-plans", {
      next: { tags: ["admin-analytics"] },
    });
    return await response.json();
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}

export async function getPaymentStats() {
  try {
    const response = await serverFetch.get("/analytics/payments", {
      next: { tags: ["admin-analytics"] },
    });
    return await response.json();
  } catch (error: unknown) {
    const err = error as Error;
    return { success: false, message: err.message };
  }
}
