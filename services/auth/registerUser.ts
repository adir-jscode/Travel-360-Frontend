/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerValidationZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";
import z from "zod";
type RegisterForm = z.infer<typeof registerValidationZodSchema>;
export const registerUser = async (
  _currentState: any,
  formData: FormData,
): Promise<any> => {
  try {
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      phone: (formData.get("phone") as string) || undefined,
      currentLocation: (formData.get("currentLocation") as string) || undefined,
    };

    const validated = zodValidator(payload, registerValidationZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const { confirmPassword: _confirm, ...registerPayload } =
      validated.data as RegisterForm;

    const res = await serverFetch.post("/user/register", {
      body: JSON.stringify(registerPayload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Registration failed");
    }

    redirect("/login?registered=true");
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Registration failed. Please try again.",
    };
  }
};
