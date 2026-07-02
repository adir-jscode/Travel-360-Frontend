/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { IReview } from "@/types/review.types";
import {
  createReviewZodSchema,
  updateReviewZodSchema,
} from "@/zod/review.validation";
import { revalidateTag } from "next/cache";

/**
 * Member-only: leave a review + star rating for a fellow trip member.
 * Backed by `POST /review`.
 *
 * Expects `reviewee`, `trip`, `rating`, and `comment` fields in `formData`,
 * so it can be used directly as a `useActionState` action.
 */
export async function createReview(
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const payload = {
      reviewee: formData.get("reviewee"),
      trip: formData.get("trip"),
      rating: formData.get("rating"),
      comment: formData.get("comment"),
    };

    const validated = zodValidator(payload, createReviewZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const response = await serverFetch.post("/review", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    });
    const result = await response.json();

    if (result.success) {
      revalidateTag("trip-reviews", "max");
      revalidateTag("user-info", "max");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to submit review.",
    };
  }
}

/**
 * Reviewer-only: edit the rating and/or comment on a review you wrote.
 * Backed by `PATCH /review/:id`.
 *
 * Expects a hidden `id` field (the review's `_id`) plus `rating` and/or
 * `comment` in `formData`, so it can be used directly as a
 * `useActionState` action.
 */
export async function updateReview(
  _prevState: any,
  formData: FormData,
): Promise<any> {
  try {
    const reviewId = formData.get("id") as string;
    if (!reviewId) {
      return { success: false, message: "Missing review id." };
    }

    const rawRating = formData.get("rating");
    const rawComment = formData.get("comment");

    const payload: Record<string, unknown> = {};
    if (rawRating !== null && rawRating !== "") payload.rating = rawRating;
    if (rawComment !== null) payload.comment = rawComment;

    const validated = zodValidator(payload, updateReviewZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const response = await serverFetch.patch(`/review/${reviewId}`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    });
    const result = await response.json();

    if (result.success) {
      revalidateTag("trip-reviews", "max");
      revalidateTag("user-info", "max");
    }
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update review.",
    };
  }
}

/**
 * All reviews written for a given trip (any reviewer/reviewee pair on it).
 * Used client-side to figure out who the current user has already reviewed.
 *
 * NOTE: assumes a `GET /review/trip/:tripId` route on the backend, populated
 * the same way as `createReview`/`updateReview`. This route isn't in the
 * snippet provided — add it alongside the existing controllers:
 *
 *   router.get("/trip/:tripId", authUser, ReviewControllers.getTripReviews);
 */
export async function getTripReviews(tripId: string): Promise<IReview[]> {
  try {
    const response = await serverFetch.get(`/review/trip/${tripId}`, {
      next: { tags: ["trip-reviews", `trip-reviews:${tripId}`] },
    });
    const result = await response.json();
    return result.success && Array.isArray(result.data) ? result.data : [];
  } catch {
    return [];
  }
}

/**
 * Paginated reviews *received* by a user — powers the "Community Reviews"
 * section on the public profile page.
 *
 * NOTE: assumes a `GET /review/user/:userId` route on the backend:
 *
 *   router.get("/user/:userId", ReviewControllers.getUserReviews);
 */
export async function getUserReviews(
  userId: string,
  page = 1,
  limit = 10,
): Promise<{ reviews: IReview[]; total: number }> {
  try {
    const response = await serverFetch.get(
      `/review/user/${userId}?page=${page}&limit=${limit}`,
      { next: { tags: [`user-reviews:${userId}`] } },
    );
    const result = await response.json();
    if (!result.success) return { reviews: [], total: 0 };
    return {
      reviews: Array.isArray(result.data) ? result.data : [],
      total: result.meta?.total ?? result.data?.length ?? 0,
    };
  } catch {
    return { reviews: [], total: 0 };
  }
}
