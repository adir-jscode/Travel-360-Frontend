/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/auth";
import { verifyAccessToken } from "@/lib/jwtHandlers";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/zod/auth.validation";
import { parse } from "cookie";
import { deleteCookie, getCookie, setCookie } from "./tokenHandlers";

export async function getNewAccessToken() {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken && !refreshToken) {
      return { tokenRefreshed: false };
    }

    if (accessToken) {
      const verifiedToken = await verifyAccessToken(accessToken);
      if (verifiedToken.success) {
        return { tokenRefreshed: false };
      }
    }

    if (!refreshToken) {
      return { tokenRefreshed: false };
    }

    let accessTokenObject: any = null;
    let refreshTokenObject: any = null;

    const response = await serverFetch.post("/auth/refresh-token", {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const result = await response.json();
    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);
        if (parsedCookie["accessToken"]) accessTokenObject = parsedCookie;
        if (parsedCookie["refreshToken"]) refreshTokenObject = parsedCookie;
      });
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject || !refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    await deleteCookie("accessToken");
    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 3600,
      path: accessTokenObject.Path || "/",
      sameSite: accessTokenObject["SameSite"] || "none",
    });

    await deleteCookie("refreshToken");
    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 7776000,
      path: refreshTokenObject.Path || "/",
      sameSite: refreshTokenObject["SameSite"] || "none",
    });

    if (!result.success) {
      throw new Error(result.message || "Token refresh failed");
    }

    return { tokenRefreshed: true, success: true };
  } catch (error: any) {
    return {
      tokenRefreshed: false,
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

export async function logoutUser() {
  try {
    await serverFetch.post("/auth/logout", {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Silently ignore logout API errors
  } finally {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
  }
  return { success: true };
}
export async function signOut() {
  // Clear credential JWT cookies
  try {
    await serverFetch.post("/auth/logout", {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Ignore — backend may not have a credential session
  } finally {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
  }

  // Sign out of NextAuth (Google session)
  await nextAuthSignOut({ redirectTo: "/login" });
}
export async function signIn() {
  await nextAuthSignIn("google", { redirectTo: "/user/dashboard" });
}

export async function forgotPassword(_prevState: any, formData: FormData) {
  const validationPayload = {
    email: formData.get("email") as string,
  };

  const validatedPayload = zodValidator(
    validationPayload,
    forgotPasswordSchema,
  );

  if (!validatedPayload.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedPayload.errors,
    };
  }

  try {
    const response = await serverFetch.post("/auth/forgot-password", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: validationPayload.email }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to send reset link");
    }

    return {
      success: true,
      message: "Password reset link has been sent to your email!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

export async function resetPassword(_prevState: any, formData: FormData) {
  const validationPayload = {
    id: formData.get("id") as string,
    token: formData.get("token") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validatedPayload = zodValidator(validationPayload, resetPasswordSchema);

  if (!validatedPayload.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedPayload.errors,
    };
  }

  try {
    const response = await serverFetch.post("/auth/reset-password", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: validationPayload.id,
        token: validationPayload.token,
        newPassword: validationPayload.newPassword,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Password reset failed");
    }

    return {
      success: true,
      message: "Password reset successfully! You can now log in.",
      redirectToLogin: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

export async function changePassword(_prevState: any, formData: FormData) {
  const validationPayload = {
    oldPassword: formData.get("oldPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validatedPayload = zodValidator(
    validationPayload,
    changePasswordSchema,
  );
  if (!validatedPayload.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedPayload.errors,
    };
  }

  try {
    const response = await serverFetch.post("/auth/change-password", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword: validationPayload.oldPassword,
        newPassword: validationPayload.newPassword,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Password change failed");
    }

    return {
      success: true,
      message: result.message || "Password changed successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}
export async function syncGoogleTokensToCookies() {
  // const session = await auth();
  // if (!session?.accessToken || !session?.refreshToken) return;
  // // Only sync if not already in cookies (avoid unnecessary writes)
  // const existingAccessToken = await getCookie("accessToken");
  // if (existingAccessToken) {
  //   const verified = await verifyAccessToken(existingAccessToken);
  //   if (verified.success) return; // already valid, no need to resync
  // }
  // const cookieStore = await cookies();
  // cookieStore.set("accessToken", session.accessToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   path: "/",
  //   maxAge: 60 * 60, // 1 hour
  // });
  // cookieStore.set("refreshToken", session.refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   path: "/",
  //   maxAge: 60 * 60 * 24 * 90, // 90 days
  // });
}
