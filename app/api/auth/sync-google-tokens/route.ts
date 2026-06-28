import { auth } from "@/auth";
import { verifyAccessToken } from "@/lib/jwtHandlers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.accessToken || !session?.refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Google session not found",
        },
        { status: 401 },
      );
    }

    // Optional: skip writing if already valid
    if (session.accessToken) {
      const verified = await verifyAccessToken(session.accessToken);

      if (!verified.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid access token",
          },
          { status: 401 },
        );
      }
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("accessToken", session.accessToken, {
      httpOnly: true,
      secure: true,
      // sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.set("refreshToken", session.refreshToken, {
      httpOnly: true,
      secure: true,
      // sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync cookies",
        error: error,
      },
      { status: 500 },
    );
  }
}
