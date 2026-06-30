/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IJoinRequest } from "@/types/joinRequest.types";
import { revalidateTag } from "next/cache";

export async function sendJoinRequest(
  travelPlanId: string,
  message?: string,
): Promise<any> {
  try {
    console.log({ travelPlanId });
    const response = await serverFetch.post(`/join-request/${travelPlanId}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const result = await response.json();
    console.log({ result });
    if (result.success) revalidateTag("join-requests", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
export interface IncomingRequestsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IJoinRequest[];
}
export async function getIncomingRequests(): Promise<IncomingRequestsResponse> {
  try {
    const response = await serverFetch.get("/join-request/incoming", {
      next: { tags: ["join-requests"] },
    });

    return await response.json();
  } catch (error: any) {
    return {
      statusCode: 200,
      success: false,
      message: error.message,
      data: [],
    };
  }
}

export async function getOutgoingRequests(): Promise<any> {
  try {
    const response = await serverFetch.get("/join-request/outgoing", {
      next: { tags: ["join-requests"] },
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message, data: [] };
  }
}

export async function respondToJoinRequest(
  joinRequestId: string,
  action: "accept" | "reject",
): Promise<any> {
  try {
    const response = await serverFetch.patch(
      `/join-request/${joinRequestId}/respond`,
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      },
    );
    const result = await response.json();
    console.log({ result });
    if (result.success) revalidateTag("join-requests", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function cancelJoinRequest(joinRequestId: string): Promise<any> {
  try {
    const response = await serverFetch.delete(`/join-request/${joinRequestId}`);
    const result = await response.json();
    if (result.success) revalidateTag("join-requests", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
