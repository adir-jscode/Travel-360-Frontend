/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { IUser } from "@/types/user.types";
import { updateUserZodSchema } from "@/zod/user.validation";
import { revalidateTag } from "next/cache";

export async function updateMyProfile(
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const uploadFormData = new FormData();

    const data: Record<string, any> = {};
    const travelInterests: string[] = [];
    const visitedCountries: string[] = [];

    formData.forEach((value, key) => {
      if (key === "file") return;
      if (key === "travelInterest[]") {
        travelInterests.push(value as string);
      } else if (key === "visitedCountries[]") {
        visitedCountries.push(value as string);
      } else if (value) {
        data[key] = value;
      }
    });

    if (travelInterests.length > 0) data.travelInterest = travelInterests;
    if (visitedCountries.length > 0) data.visitedCountries = visitedCountries;

    const validated = zodValidator(data, updateUserZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    uploadFormData.append("data", JSON.stringify(validated.data));

    const file = formData.get("file");
    if (file && file instanceof File && file.size > 0) {
      uploadFormData.append("file", file);
    }
    const response = await serverFetch.patch("/user/profile", {
      body: uploadFormData,
    });

    const result = await response.json();
    console.log({ result, uploadFormData });

    if (result.success) {
      revalidateTag("user-info", "max");
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update profile.",
    };
  }
}

export async function getAllUsers(query?: string): Promise<any> {
  try {
    const endpoint = query ? `/user?${query}` : "/user";
    const response = await serverFetch.get(endpoint, {
      next: { tags: ["users-list"] },
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteUser(id: string): Promise<any> {
  try {
    const response = await serverFetch.delete(`/user/${id}`);
    const result = await response.json();
    if (result.success) {
      revalidateTag("users-list", "max");
    }
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getUserProfile(id?: string): Promise<IUser | null> {
  try {
    const endpoint = id ? `/user/me/${id}` : "/user/me";
    const response = await serverFetch.get(endpoint, {
      next: { tags: ["user-info"] },
    });
    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function giveRating(
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const userId = formData.get("userId") as string;
    const value = parseInt(formData.get("value") as string);

    const response = await serverFetch.post(`/user/rating/${userId}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });

    const result = await response.json();
    if (result.success) revalidateTag("user-info", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function giveReview(
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const userId = formData.get("userId") as string;
    const description = formData.get("description") as string;

    const response = await serverFetch.post(`/user/review/${userId}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    const result = await response.json();
    if (result.success) revalidateTag("user-info", "max");
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
