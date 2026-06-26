import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const authRoutes = ["/login", "/register", "/forgot-password"];

const adminRoutes = [/^\/admin/];
const userRoutes = [/^\/user/];
const commonProtectedRoutes = [
  "/my-profile",
  "/change-password",
  "/reset-password",
];

function isAuthRoute(pathname: string): boolean {
  return authRoutes.includes(pathname);
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((p) => p.test(pathname));
}

function isUserRoute(pathname: string): boolean {
  return userRoutes.some((p) => p.test(pathname));
}

function isProtectedRoute(pathname: string): boolean {
  return (
    commonProtectedRoutes.includes(pathname) ||
    isAdminRoute(pathname) ||
    isUserRoute(pathname)
  );
}

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isLoggedIn = !!(accessToken || refreshToken);

  // Redirect logged-in users away from auth routes
  if (isAuthRoute(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: "/pricing",
};
