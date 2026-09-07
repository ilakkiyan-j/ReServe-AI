import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { calculateRecipientMatches } from "@/lib/ai/matchingAgent";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET(req: NextRequest, { params }: { params: { surplusRequestId: string } }) {
  try {
    const surplus = await prisma.surplusRequest.findUnique({
      where: { id: params.surplusRequestId },
      include: {
        recommendations: {
          include: { organization: true },
        },
      },
    });

    if (!surplus) {
      return errorResponse("Surplus request not found", 404);
    }

    const verifiedOrgs = await prisma.organization.findMany({
      where: { verificationStatus: "VERIFIED" },
    });

    const matchResult = calculateRecipientMatches(surplus, verifiedOrgs);

    return successResponse({
      surplus,
      matchResult,
    });
  } catch (error: any) {
    return errorResponse(`Failed to fetch match recommendations: ${error.message}`, 500);
  }
}
