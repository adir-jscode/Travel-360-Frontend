import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type TokenPayload = JwtPayload & {
  role: UserRole;
};

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = request.cookies.get("accessToken")?.value ?? null;
  const refreshToken = request.cookies.get("refreshToken")?.value ?? null;

  let role: UserRole | null = null;
  let isLoggedIn = false;

  /**
   * ---------------------------------------------------------
   * Verify JWT
   * ---------------------------------------------------------
   */
  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET as string,
      ) as TokenPayload;

      role = decoded.role;
      isLoggedIn = true;
    } catch {
      // Invalid or expired access token
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      const response = NextResponse.redirect(new URL("/login", request.url));

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
    }
  } else if (refreshToken) {
    // Refresh token exists (consider logged in)
    // You can optionally verify it here if needed.
    isLoggedIn = true;
  }

  const routeOwner = getRouteOwner(pathname);

  /**
   * ---------------------------------------------------------
   * Logged-in user visiting auth pages
   * ---------------------------------------------------------
   */
  if (isLoggedIn && role && isAuthRoute(pathname)) {
    const redirect = searchParams.get("redirect");

    if (redirect && isValidRedirectForRole(redirect, role)) {
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(role), request.url),
    );
  }

  /**
   * ---------------------------------------------------------
   * Public route
   * ---------------------------------------------------------
   */
  if (routeOwner === null) {
    return NextResponse.next();
  }

  /**
   * ---------------------------------------------------------
   * Protected route but not authenticated
   * ---------------------------------------------------------
   */
  if (!isLoggedIn || !role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  /**
   * ---------------------------------------------------------
   * Common protected routes
   * ---------------------------------------------------------
   */
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }

  /**
   * ---------------------------------------------------------
   * Role-based authorization
   * ---------------------------------------------------------
   */
  if (routeOwner === "ADMIN" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(role), request.url),
    );
  }

  if (routeOwner === "USER" && role !== "USER" && role !== "GUIDE") {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
