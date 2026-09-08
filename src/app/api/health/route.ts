import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const verifiedOrgCount = await prisma.organization.count();
    const userCount = await prisma.user.count();

    return successResponse({
      status: "HEALTHY",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        verifiedOrgCount,
        userCount,
      },
    });
  } catch (error: any) {
    return errorResponse(`Database health check failed: ${error.message}`, 500);
  }
}
