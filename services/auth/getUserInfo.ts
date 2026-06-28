"use server";

import { verifyAccessToken } from "@/lib/jwtHandlers";
import { serverFetch } from "@/lib/server-fetch";
import { IUser } from "@/types/user.types";
import { getCookie } from "./tokenHandlers";

export const getUserInfo = async (): Promise<IUser | null> => {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) return null;

    const verified = await verifyAccessToken(accessToken);
    if (!verified.success) return null;

    const res = await serverFetch.get("/user/me", {
      next: { tags: ["user-info"] },
    });

    const result = await res.json();
    if (!result.success) return null;

    return result.data as IUser;
  } catch {
    return null;
  }
};

export const getTokenPayload = async () => {
  try {
    const accessToken = await getCookie("accessToken");
    if (!accessToken) return null;

    const verified = await verifyAccessToken(accessToken);
    if (!verified.success) return null;

    return verified.payload;
  } catch {
    return null;
  }
};
