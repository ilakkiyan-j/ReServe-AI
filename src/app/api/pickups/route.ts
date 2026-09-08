import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const pickups = await prisma.pickupTask.findMany({
      include: {
        surplusRequest: {
          include: {
            reporter: { select: { id: true, name: true, email: true } },
            event: { select: { id: true, name: true } },
          },
        },
        assignedOrg: true,
      },
      orderBy: { pickupDeadline: "asc" },
    });

    return successResponse(pickups);
  } catch (error: any) {
    return errorResponse(`Failed to fetch pickup tasks: ${error.message}`, 500);
  }
}
