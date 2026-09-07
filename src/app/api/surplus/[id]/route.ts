import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const surplus = await prisma.surplusRequest.findUnique({
      where: { id: params.id },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        event: true,
        recommendations: { include: { organization: true } },
        pickupTask: { include: { assignedOrg: true } },
        impactLog: true,
      },
    });

    if (!surplus) {
      return errorResponse("Surplus request not found", 404);
    }

    return successResponse(surplus);
  } catch (error: any) {
    return errorResponse(`Failed to fetch surplus request: ${error.message}`, 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, urgencyLevel, notes } = body;

    const surplus = await prisma.surplusRequest.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(urgencyLevel && { urgencyLevel }),
        ...(notes && { notes }),
      },
    });

    return successResponse(surplus);
  } catch (error: any) {
    return errorResponse(`Failed to update surplus request: ${error.message}`, 500);
  }
}
