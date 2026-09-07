import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { calculateRecipientMatches } from "@/lib/ai/matchingAgent";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { surplusRequestId } = body;

    if (!surplusRequestId) {
      return errorResponse("surplusRequestId is required", 400);
    }

    const surplus = await prisma.surplusRequest.findUnique({
      where: { id: surplusRequestId },
      include: { event: true },
    });

    if (!surplus) {
      return errorResponse("Surplus request not found", 404);
    }

    // Query ONLY verified organizations stored in database
    const verifiedOrgs = await prisma.organization.findMany({
      where: { verificationStatus: "VERIFIED" },
    });

    if (verifiedOrgs.length === 0) {
      return errorResponse("No verified recipient organizations found in system", 404);
    }

    // Build reliability map: completed / (completed + failed) per org
    const pickupStats = await prisma.pickupTask.groupBy({
      by: ["assignedOrgId", "status"],
      where: {
        assignedOrgId: { in: verifiedOrgs.map((o) => o.id) },
        status: { in: ["COMPLETED", "FAILED"] },
      },
      _count: { id: true },
    });

    const reliabilityMap: Record<string, number> = {};
    for (const org of verifiedOrgs) {
      const completed = pickupStats.find(
        (s) => s.assignedOrgId === org.id && s.status === "COMPLETED"
      )?._count.id ?? 0;
      const failed = pickupStats.find(
        (s) => s.assignedOrgId === org.id && s.status === "FAILED"
      )?._count.id ?? 0;
      const total = completed + failed;
      // Only compute a score if there is at least one resolved task; otherwise leave out (agent defaults to 70)
      if (total > 0) {
        reliabilityMap[org.id] = Math.round((completed / total) * 100);
      }
    }

    // Calculate transparent multi-criteria matches
    const matchResult = calculateRecipientMatches(surplus, verifiedOrgs, reliabilityMap);

    // Save Top Recommendation to database
    const topRec = matchResult.recommendedCandidate;

    await prisma.matchRecommendation.create({
      data: {
        surplusRequestId: surplus.id,
        organizationId: topRec.organizationId,
        matchScore: topRec.totalMatchScore,
        scoreBreakdown: JSON.stringify(topRec.scoreBreakdown),
        explanation: topRec.explanation,
        status: "PROPOSED",
      },
    });

    // Update SurplusRequest status -> MATCH_FOUND
    await prisma.surplusRequest.update({
      where: { id: surplus.id },
      data: { status: "MATCH_FOUND" },
    });

    return successResponse(matchResult, 201);
  } catch (error: any) {
    return errorResponse(`Matching failed: ${error.message}`, 500);
  }
}
