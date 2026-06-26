import { Role } from "@/types/user.types";

export type UserRole = Role;

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

export const authRoutes = ["/login", "/register", "/forgot-password"];

export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-profile", "/change-password", "/reset-password"],
  patterns: [],
};

export const userProtectedRoutes: RouteConfig = {
  patterns: [/^\/user/],
  exact: [],
};

export const adminProtectedRoutes: RouteConfig = {
  patterns: [/^\/admin/],
  exact: [],
};

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): "ADMIN" | "USER" | "COMMON" | null => {
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }
  if (isRouteMatches(pathname, userProtectedRoutes)) {
    return "USER";
  }
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
  if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
    return "/admin/dashboard";
  }
  if (role === Role.USER || role === Role.GUIDE) {
    return "/user/dashboard";
  }
  return "/";
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  if (
    routeOwner === "ADMIN" &&
    (role === Role.ADMIN || role === Role.SUPER_ADMIN)
  ) {
    return true;
  }

  if (routeOwner === "USER" && (role === Role.USER || role === Role.GUIDE)) {
    return true;
  }

  return false;
};
