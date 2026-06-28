import { getUnreadCount } from "@/services/notification/notification.service";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await getUnreadCount();
  return NextResponse.json({ success: true, data: count });
}
