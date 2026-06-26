"use client";

import { usePathname } from "next/navigation";

export function useAuthToken(): boolean {
  // pathname triggers re-render on navigation, forcing cookie re-check
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();

  if (typeof window === "undefined") return false;

  const cookies = document.cookie.split(";");
  return cookies.some((cookie) => cookie.trim().startsWith("accessToken="));
}
