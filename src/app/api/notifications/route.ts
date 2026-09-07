import { NextRequest } from "next/server";
import { getSystemNotifications } from "@/lib/ai/coordinationAgent";
import { successResponse } from "@/lib/utils/apiResponse";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || undefined;

  const notifications = await getSystemNotifications(role);
  return successResponse(notifications);
}
