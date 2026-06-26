"use server";

import { ITokenPayload } from "@/types/auth.types";
import jwt from "jsonwebtoken";

export const verifyAccessToken = async (token: string) => {
  try {
    const verifiedAccessToken = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as ITokenPayload;

    return {
      success: true,
      message: "Token is valid",
      payload: verifiedAccessToken,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err?.message || "Invalid token",
    };
  }
};
