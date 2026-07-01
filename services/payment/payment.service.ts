"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IPayment } from "@/types/payment.types";

export async function getMyPayments(): Promise<IPayment[]> {
  try {
    const response = await serverFetch.get("/payment/my-payments", {
      next: { tags: ["my-payments"] },
    });
    const result = await response.json();
    return result.success ? (result.data as IPayment[]) : [];
  } catch {
    return [];
  }
}
