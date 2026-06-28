/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/join-request/incoming/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  try {
    const res = await fetch(`${BACKEND_URL}/join-request/incoming`, {
      headers: {
        "Content-Type": "application/json",

        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const data = await res.json();
    console.log({ data });
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("[/api/join-request/incoming] fetch error:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch join requests", data: [] },
      { status: 500 },
    );
  }
}
