import { calculateSustainabilityImpact } from "@/lib/ai/impactAgent";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    const metrics = await calculateSustainabilityImpact();
    return successResponse(metrics);
  } catch (error: any) {
    return errorResponse(`Failed to calculate sustainability impact: ${error.message}`, 500);
  }
}
