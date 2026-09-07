import { getCurrentSession } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return errorResponse("Unauthenticated", 401);
  }

  return successResponse({ user: session });
}
