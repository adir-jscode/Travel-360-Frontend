import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "@/services/auth/tokenHandlers";
import { NextRequest, NextResponse } from "next/server";

const BASE_API =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

export async function POST(req: NextRequest) {
  try {
    const { planId } = await req.json();

    // Refresh the access token before calling the backend
    await getNewAccessToken();
    const accessToken = await getCookie("accessToken");

    // Backend route: POST /subscription/:id  (plan ID in URL param)
    const res = await fetch(`${BASE_API}/subscription/${planId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: accessToken ? `accessToken=${accessToken}` : "",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
