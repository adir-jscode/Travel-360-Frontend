import { markAllNotificationsRead } from "@/services/notification/notification.service";
import { NextResponse } from "next/server";

export async function PATCH() {
  const result = await markAllNotificationsRead();
  return NextResponse.json(result);
}
