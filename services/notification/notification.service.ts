/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getMyNotifications(): Promise<any> {
  try {
    const response = await serverFetch.get("/notification", {
      next: { tags: ["notifications"] },
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message, data: [] };
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const response = await serverFetch.get("/notification/unread-count");
    const result = await response.json();
    return result.success ? result.data : 0;
  } catch {
    return 0;
  }
}

export async function markAllNotificationsRead(): Promise<any> {
  try {
    const response = await serverFetch.patch("/notification/mark-all-read");
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function markNotificationRead(id: string): Promise<any> {
  try {
    const response = await serverFetch.patch(`/notification/${id}/read`);
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
