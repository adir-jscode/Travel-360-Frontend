/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import {
  createAiTravelPlanZodSchema,
  createTravelPlanZodSchema,
  updateTravelPlanZodSchema,
} from "@/zod/travelPlan.validation";
import { revalidateTag } from "next/cache";

export async function getAllTravelPlans(query?: string): Promise<any> {
  try {
    const endpoint = query
      ? `/travel-plan/travel-plans?${query}`
      : "/travel-plan/travel-plans";
    const response = await serverFetch.get(endpoint, {
      next: { tags: ["travel-plans"] },
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
export async function getMyTravelPlans(query?: string): Promise<any> {
  try {
    const endpoint = query
      ? `/travel-plan/my-travel-plans?${query}`
      : "/travel-plan/my-travel-plans";
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
    const days = Number(formData.get("days"));
    const itinerary = JSON.parse((formData.get("itinerary") as string) || "[]");
    const budgetMin = formData.get("budgetMin") as string;
    const budgetMax = formData.get("budgetMax") as string;

    const payload = {
      destination: {
        country: formData.get("destination.country") as string,
        city: (formData.get("destination.city") as string) || undefined,
      },
      days: days,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      budgetMin: budgetMin.trim() === "" ? undefined : Number(budgetMin),
      budgetMax: budgetMax.trim() === "" ? undefined : Number(budgetMax),
      travelType: formData.get("travelType") as string,
      visibility: formData.get("visibility") as string,
      itinerary: itinerary,
    };

    const validated = zodValidator(payload, createTravelPlanZodSchema);

    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const response = await serverFetch.post("/travel-plan/travel-plans", {
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
    const itinerary = JSON.parse((formData.get("itinerary") as string) || "[]");

    const payload = {
      destination: {
        country: (formData.get("destination.country") as string)?.trim(),
        city: (formData.get("destination.city") as string)?.trim() || undefined,
      },

      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,

      days: Number(formData.get("days")),

      budgetMin: Number(formData.get("budgetMin")),
      budgetMax: Number(formData.get("budgetMax")),

      travelType: formData.get("travelType") as string,
      visibility: formData.get("visibility") as string,

      itinerary,
    };

    const validated = zodValidator(payload, updateTravelPlanZodSchema);

    if (!validated.success) {
      return {
        success: false,
        errors: validated.errors,
      };
    }

    const response = await serverFetch.patch(
      `/travel-plan/travel-plans/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated.data),
      },
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag("travel-plans", "max");
      revalidateTag(`travel-plan-${id}`, "max");
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteTravelPlan(id: string): Promise<any> {
  try {
    const response = await serverFetch.delete(`travel-plan/travel-plans/${id}`);
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
      `/travel-plan/travel-plans/${id}/toggle-visibility`,
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
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const timeDifference: number = endDate.getTime() - startDate.getTime();

    const daysDifference: number = timeDifference / (1000 * 60 * 60 * 24);

    const payload = {
      destination: {
        country: formData.get("destination.country") as string,
        city: (formData.get("destination.city") as string) || undefined,
      },
      days: daysDifference,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      travelType: formData.get("travelType") as string,
      visibility: formData.get("visibility") as string,
    };

    const validated = zodValidator(payload, createAiTravelPlanZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const response = await serverFetch.post("/travel-plan/ai-travel-plans", {
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

// export async function getTravelPlanById(
//   id: string,
// ): Promise<ITravelPlan | null> {
//   try {
//     const response = await serverFetch.get(`/travel-plan/travel-plans/${id}`, {
//       next: { tags: ["travel-plans"] },
//     });
//     const result = await response.json();

//     return result.success ? result.data : null;
//   } catch {
//     return null;
//   }
// }
export async function getTravelPlanById(id: string) {
  try {
    const response = await serverFetch.get(`/travel-plan/travel-plans/${id}`);

    const result = await response.json();

    return result.success ? result.data : null;
  } catch (error) {
    console.error("getTravelPlanById error:", error);
    throw error; // Don't return null while debugging
  }
}
