/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { IMyTripsResponse } from "@/types/trip.types";

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
