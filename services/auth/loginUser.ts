/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
} from "@/lib/auth-utils";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { ITokenPayload } from "@/types/auth.types";
import { loginValidationZodSchema } from "@/zod/auth.validation";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandlers";

export const loginUser = async (
  _currentState: any,
  formData: FormData,
): Promise<any> => {
  try {
    const redirectTo = formData.get("redirect") as string | null;

    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validated = zodValidator(payload, loginValidationZodSchema);
    if (!validated.success) {
      return { success: false, errors: validated.errors };
    }

    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify(validated.data),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Login failed");
    }

    let accessTokenObject: any = null;
    let refreshTokenObject: any = null;

    const setCookieHeaders = res.headers.getSetCookie();
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

    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 3600,
      path: accessTokenObject.Path || "/",
      sameSite: accessTokenObject["SameSite"] || "none",
    });

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 7776000,
      path: refreshTokenObject.Path || "/",
      sameSite: refreshTokenObject["SameSite"] || "none",
    });

    const verifiedToken = jwt.verify(
      accessTokenObject.accessToken,
      process.env.JWT_SECRET as string,
    ) as ITokenPayload;

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");
    }

    const userRole = verifiedToken.role;

    if (redirectTo) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        redirect(`${requestedPath}?loggedIn=true`);
      } else {
        redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
      }
    } else {
      redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
    }
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Login failed. Please check your credentials.",
    };
  }
};
