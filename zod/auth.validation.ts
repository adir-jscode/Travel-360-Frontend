import z from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/^(?=.*[A-Z])/, {
    message: "Password must contain at least 1 uppercase letter.",
  })
  .regex(/^(?=.*[!@#$%^&*])/, {
    message: "Password must contain at least 1 special character.",
  })
  .regex(/^(?=.*\d)/, {
    message: "Password must contain at least 1 number.",
  });

export const loginValidationZodSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: passwordSchema,
});

export const registerValidationZodSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
      .string()
      .email({ message: "Invalid email address format." })
      .min(5, { message: "Email must be at least 5 characters long." })
      .max(100, { message: "Email cannot exceed 100 characters." }),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
    phone: z
      .string()
      .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone must be valid BD format: +8801XXXXXXXXX or 01XXXXXXXXX",
      })
      .optional()
      .or(z.literal("")),
    currentLocation: z.string().min(2).max(50).optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
