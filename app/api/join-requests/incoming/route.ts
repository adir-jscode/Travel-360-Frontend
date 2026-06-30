/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/join-request/incoming/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  // ── DEBUG: see exactly what cookies/auth we have ──────────────────────

  // ─────────────────────────────────────────────────────────────────────

  try {
    const res = await fetch(`${BACKEND_URL}/join-request/incoming`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        // Also forward Authorization header if the browser sent one
        ...(request.headers.get("authorization")
          ? { Authorization: request.headers.get("authorization")! }
          : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("[/api/join-request/incoming] fetch error:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch join requests", data: [] },
      { status: 500 },
    );
  }
}
