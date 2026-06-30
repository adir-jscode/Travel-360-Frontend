import { getAllUsers } from "@/services/user/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  const result = await getAllUsers(qs || undefined);

  return NextResponse.json(result);
}
