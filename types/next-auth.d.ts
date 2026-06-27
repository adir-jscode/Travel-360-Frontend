import { DefaultJWT, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    dbUser?: Record<string, unknown>;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    dbUser?: Record<string, unknown>;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    dbUser?: Record<string, unknown>;
  }
}
