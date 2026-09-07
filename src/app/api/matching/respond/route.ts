import { NextRequest } from "next/server";
import { processMatchResponse } from "@/lib/ai/coordinationAgent";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { surplusRequestId, organizationId, accepted, rejectionReason } = body;

    if (!surplusRequestId || !organizationId) {
      return errorResponse("surplusRequestId and organizationId are required", 400);
    }

    const result = await processMatchResponse(
      surplusRequestId,
      organizationId,
      Boolean(accepted),
      rejectionReason
    );

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(`Failed to process match response: ${error.message}`, 500);
  }
}
