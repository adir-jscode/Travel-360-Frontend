/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { ITravelPlan } from "@/types/travelPlan.types";
import {
  createAiTravelPlanZodSchema,
  createTravelPlanZodSchema,
  updateTravelPlanZodSchema,
} from "@/zod/travelPlan.validation";
import { revalidateTag } from "next/cache";

export async function getAllTravelPlans(query?: string): Promise<any> {
  try {
    const endpoint = query ? `/travel-plans?${query}` : "/travel-plans";
    const response = await serverFetch.get(endpoint, {
      next: { tags: ["travel-plans"] },
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createTravelPlan(
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const payload = {
      destination: {
        country: formData.get("destination.country") as string,
        city: (formData.get("destination.city") as string) || undefined,
      },
      days: parseInt(formData.get("days") as string),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      budgetMin: parseFloat(formData.get("budgetMin") as string),
      budgetMax: parseFloat(formData.get("budgetMax") as string),
      travelType: formData.get("travelType") as string,
      visibility: formData.get("visibility") as string,
    };

    const validated = zodValidator(payload, createTravelPlanZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const response = await serverFetch.post("/travel-plans", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    });

    const result = await response.json();
    if (result.success) revalidateTag("travel-plans", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateTravelPlan(
  id: string,
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const raw: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (value !== "" && value !== null) {
        if (key.startsWith("destination.")) {
          const field = key.split(".")[1];
          raw.destination = raw.destination || {};
          raw.destination[field] = value;
        } else if (
          key === "days" ||
          key === "budgetMin" ||
          key === "budgetMax"
        ) {
          raw[key] = parseFloat(value as string);
        } else {
          raw[key] = value;
        }
      }
    });

    const validated = zodValidator(raw, updateTravelPlanZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const response = await serverFetch.patch(`/travel-plans/${id}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    });

    const result = await response.json();
    if (result.success) revalidateTag("travel-plans", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteTravelPlan(id: string): Promise<any> {
  try {
    const response = await serverFetch.delete(`/travel-plans/${id}`);
    const result = await response.json();
    if (result.success) revalidateTag("travel-plans", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function toggleTravelPlanVisibility(id: string): Promise<any> {
  try {
    const response = await serverFetch.patch(
      `/travel-plans/${id}/toggle-visibility`,
    );
    const result = await response.json();
    if (result.success) revalidateTag("travel-plans", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function generateAiTravelPlan(
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const payload = {
      destination: {
        country: formData.get("destination.country") as string,
        city: (formData.get("destination.city") as string) || undefined,
      },
      days: parseInt(formData.get("days") as string),
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      travelType: formData.get("travelType") as string,
      visibility: formData.get("visibility") as string,
    };

    const validated = zodValidator(payload, createAiTravelPlanZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const response = await serverFetch.post("/ai-travel-plans", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    });

    const result = await response.json();
    if (result.success) revalidateTag("travel-plans", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getTravelPlanById(
  id: string,
): Promise<ITravelPlan | null> {
  try {
    const response = await serverFetch.get(`/travel-plans/${id}`, {
      next: { tags: ["travel-plans"] },
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
