import { NextRequest } from "next/server";
import { nlpIntakeSchema } from "@/lib/validations";
import { extractSurplusFromText } from "@/lib/ai/surplusExtractorAgent";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = nlpIntakeSchema.parse(body);

    const extracted = extractSurplusFromText(validated.rawText);

    return successResponse(extracted);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(`Extraction failed: ${error.message}`, 500);
  }
}
