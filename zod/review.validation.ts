import z from "zod";

export const createReviewZodSchema = z.object({
  reviewee: z.string().min(1, { message: "Reviewee is required." }),
  trip: z.string().min(1, { message: "Trip is required." }),
  rating: z.coerce
    .number({ message: "Rating is required." })
    .int()
    .min(1, { message: "Please select at least 1 star." })
    .max(5, { message: "Rating cannot exceed 5 stars." }),
  comment: z
    .string()
    .trim()
    .min(10, { message: "Review must be at least 10 characters." })
    .max(1000, { message: "Review cannot exceed 1000 characters." }),
});

export const updateReviewZodSchema = z
  .object({
    rating: z.coerce
      .number()
      .int()
      .min(1, { message: "Please select at least 1 star." })
      .max(5, { message: "Rating cannot exceed 5 stars." })
      .optional(),
    comment: z
      .string()
      .trim()
      .min(10, { message: "Review must be at least 10 characters." })
      .max(1000, { message: "Review cannot exceed 1000 characters." })
      .optional(),
  })
  .refine((data) => data.rating !== undefined || data.comment !== undefined, {
    message: "Change the rating or comment before saving.",
    path: ["comment"],
  });
