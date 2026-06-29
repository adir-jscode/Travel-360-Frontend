"use client";

/**
 * useUserId
 * -----------
 * Reads the `accessToken` cookie and decodes the userId from the JWT payload
 * WITHOUT verifying the signature (signature verification needs the secret and
 * must stay server-side). This is safe for use as a socket-room key / fetch
 * guard — any forged token would still be rejected by the backend on actual
 * API calls.
 */
import { ITokenPayload } from "@/types/auth.types";
import { useEffect, useState } from "react";

function decodeJwtPayload(token: string): ITokenPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json) as ITokenPayload;
  } catch {
    return null;
  }
}

function getAccessTokenCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function useUserId(): string | undefined {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = getAccessTokenCookie();
    if (!token) return;
    const payload = decodeJwtPayload(token);
    if (payload?.userId) setUserId(payload.userId);
  }, []);

  return userId;
}
