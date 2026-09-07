import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    const docs = await prisma.knowledgeDocument.findMany({
      orderBy: { category: "asc" },
    });
    return successResponse(docs);
  } catch (error: any) {
    return errorResponse(`Failed to fetch knowledge documents: ${error.message}`, 500);
  }
}
