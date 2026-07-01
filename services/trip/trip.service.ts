/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  IMyTripsResponse,
  ITrip,
  ITripPhoto,
  TripStatus,
} from "@/types/trip.types";
import { revalidateTag } from "next/cache";

export async function getMyTrips(): Promise<IMyTripsResponse> {
  try {
    const response = await serverFetch.get("/trip/my-trips", {
      next: { tags: ["trips"] },
    });

    return await response.json();
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error.message,
      data: [],
    };
  }
}

/**
 * Host-only: transition a trip's lifecycle status.
 * Backed by `PATCH /trip/:id/status`.
 */
export async function updateTripStatus(
  tripId: string,
  status: TripStatus,
): Promise<{ success: boolean; message: string; data?: ITrip }> {
  try {
    const response = await serverFetch.patch(`/trip/${tripId}/status`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();

    if (result.success) revalidateTag("trips", "max");
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update trip status.",
    };
  }
}

/**
 * Member-only: upload photos (with optional captions) for a trip.
 * Backed by `POST /trip/:id/photos` (multipart, field name "photos").
 *
 * Bind the tripId with `uploadTripPhotos.bind(null, tripId)` so it can be
 * used directly as a `useActionState` action: `(prevState, formData)`.
 */
export async function uploadTripPhotos(
  tripId: string,
  _prevState: any,
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: ITripPhoto[] }> {
  try {
    const files = formData
      .getAll("photos")
      .filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length === 0) {
      return { success: false, message: "Please choose at least one photo." };
    }

    const uploadFormData = new FormData();
    files.forEach((file) => uploadFormData.append("photos", file));

    const captions = formData.getAll("captions");
    captions.forEach((caption) =>
      uploadFormData.append("captions", caption as string),
    );

    const response = await serverFetch.post(`/trip/${tripId}/photos`, {
      body: uploadFormData,
    });
    const result = await response.json();

    if (result.success) revalidateTag("trips", "max");
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to upload photos.",
    };
  }
}
