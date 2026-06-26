import z from "zod";

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .optional(),
  bio: z
    .string()
    .max(500, { message: "Bio cannot exceed 500 characters." })
    .optional(),
  travelInterest: z
    .array(z.string())
    .max(5, { message: "You can add maximum 5 travel interests." })
    .optional(),
  visitedCountries: z.array(z.string()).optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Phone must be valid BD format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional()
    .or(z.literal("")),
  currentLocation: z
    .string()
    .max(200, { message: "Location cannot exceed 200 characters." })
    .optional(),
});

export const giveRatingZodSchema = z.object({
  value: z
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." }),
});

export const giveReviewZodSchema = z.object({
  description: z
    .string()
    .min(10, { message: "Review must be at least 10 characters." })
    .max(1000, { message: "Review cannot exceed 1000 characters." }),
});
