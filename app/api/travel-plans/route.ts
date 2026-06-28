import { getAllTravelPlans } from "@/services/travelPlan/travelPlan.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();

  const result = await getAllTravelPlans(qs || undefined);

  return NextResponse.json(result);
}
