import { NextRequest } from "next/server";
import { advancePickupLifecycleStatus } from "@/lib/ai/coordinationAgent";
import { getCurrentSession } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return errorResponse("status is required", 400);
    }

    const updatedTask = await advancePickupLifecycleStatus(params.id, status, session?.id);

    return successResponse(updatedTask);
  } catch (error: any) {
    return errorResponse(`Failed to update pickup task: ${error.message}`, 500);
  }
}
