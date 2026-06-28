import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}
