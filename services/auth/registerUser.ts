/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import z from "zod";
const registerValidationZodSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    address: z.string().optional(),
    email: z.email({ message: "Valid email is required" }),
    password: z
      .string()
      .min(6, {
        error: "Password is required and must be at least 6 characters long",
      })
      .max(100, {
        error: "Password must be at most 100 characters long",
      }),
    confirmPassword: z.string().min(6, {
      error:
        "Confirm Password is required and must be at least 6 characters long",
    }),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const registerUser = async (
  _currentState: any,
  formData: any,
): Promise<any> => {
  try {
    console.log(formData, "formdata");
    const validationData = {
      name: formData.get("name"),
      //address: formData.get('address'),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    //zod check
    const validatedFields =
      registerValidationZodSchema.safeParse(validationData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        }),
      };
    }

    const response = await fetch("http://localhost:5000/api/v1/user/register", {
      method: "POST",
      body: JSON.stringify(validationData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return { error: "Registration Failed" };
  }
};
