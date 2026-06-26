import { Role } from "./user.types";

export type UserRole = Role;

export interface ITokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface IAuthState {
  success: boolean;
  message?: string;
  errors?: { field: string; message: string }[];
  redirectToLogin?: boolean;
}
