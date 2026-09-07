import { NextRequest } from "next/server";
import { answerRagQuery } from "@/lib/ai/ragAssistantAgent";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length < 3) {
      return errorResponse("query string of at least 3 characters is required", 400);
    }

    const response = await answerRagQuery(query);
    return successResponse(response);
  } catch (error: any) {
    return errorResponse(`Assistant error: ${error.message}`, 500);
  }
}
