import { TravelType, Visibility } from "@/types/travelPlan.types";
import z from "zod";

const destinationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1).optional().or(z.literal("")),
});

const itinerarySchema = z.object({
  day: z.number().int().positive("Day must be a positive integer"),
  title: z.string().min(1, "Title is required"),
  activities: z
    .array(z.string().min(1))
    .min(1, "At least one activity is required"),
});

export const createTravelPlanZodSchema = z
  .object({
    destination: destinationSchema,
    days: z
      .number({ message: "Days must be a number" })
      .int()
      .positive("Days must be a positive number"),
    startDate: z.coerce.date({ message: "Start date is required" }),
    endDate: z.coerce.date({ message: "End date is required" }),
    budgetMin: z.number().nonnegative("Minimum budget must be ≥ 0"),
    budgetMax: z.number().nonnegative("Maximum budget must be ≥ 0"),
    travelType: z
      .enum([TravelType.SOLO, TravelType.FAMILY, TravelType.FRIENDS])
      .default(TravelType.SOLO),
    itinerary: z.array(itinerarySchema).optional(),
    visibility: z
      .enum([Visibility.PUBLIC, Visibility.PRIVATE])
      .default(Visibility.PUBLIC),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Max budget must be ≥ min budget.",
    path: ["budgetMax"],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

export const updateTravelPlanZodSchema = z
  .object({
    destination: destinationSchema.optional(),
    days: z.number().int().positive().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    budgetMin: z.number().nonnegative().optional(),
    budgetMax: z.number().nonnegative().optional(),
    travelType: z
      .enum([TravelType.SOLO, TravelType.FAMILY, TravelType.FRIENDS])
      .optional(),
    itinerary: z.array(itinerarySchema).optional(),
    visibility: z.enum([Visibility.PUBLIC, Visibility.PRIVATE]).optional(),
  })
  .refine(
    (data) =>
      data.budgetMin === undefined ||
      data.budgetMax === undefined ||
      data.budgetMax >= data.budgetMin,
    {
      message: "Max budget must be ≥ min budget.",
      path: ["budgetMax"],
    },
  );

export const createAiTravelPlanZodSchema = z.object({
  destination: destinationSchema,
  days: z.number().int().positive("Days must be a positive number"),
  startDate: z.coerce.date({ message: "Start date is required" }),
  endDate: z.coerce.date({ message: "End date is required" }),
  travelType: z
    .enum([TravelType.SOLO, TravelType.FAMILY, TravelType.FRIENDS])
    .default(TravelType.SOLO),
  visibility: z
    .enum([Visibility.PUBLIC, Visibility.PRIVATE])
    .default(Visibility.PUBLIC),
});
