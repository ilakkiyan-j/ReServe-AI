import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { logId, actualPrepared, actualConsumed } = body;

    const log = await prisma.cafeteriaDemandLog.findUnique({
      where: { id: logId },
    });

    if (!log) {
      return errorResponse("Log record not found", 404);
    }

    const prep = Number(actualPrepared);
    const consumed = Number(actualConsumed);
    const surplus = Math.max(0, prep - consumed);
    const mae = Math.abs(consumed - log.predictedConsumption);

    const updated = await prisma.cafeteriaDemandLog.update({
      where: { id: logId },
      data: {
        actualPrepared: prep,
        actualConsumed: consumed,
        actualSurplus: surplus,
        maeScore: mae,
      },
    });

    return successResponse(updated);
  } catch (error: any) {
    return errorResponse(`Failed to log actual consumption: ${error.message}`, 500);
  }
}
