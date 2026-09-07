import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { surplusRequestSchema } from "@/lib/validations";
import { getCurrentSession } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");

    const where: any = {};
    if (status) where.status = status;
    if (urgency) where.urgencyLevel = urgency;

    const requests = await prisma.surplusRequest.findMany({
      where,
      include: {
        reporter: {
          select: { id: true, name: true, email: true, role: true },
        },
        event: {
          select: { id: true, name: true, department: true },
        },
        recommendations: {
          include: { organization: true },
        },
        pickupTask: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(requests);
  } catch (error: any) {
    return errorResponse(`Failed to fetch surplus requests: ${error.message}`, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const reporterId = session?.id || (session?.role === "CAFETERIA_MANAGER" ? "user-cafeteria-1" : "user-event-1");

    const body = await req.json();
    const validated = surplusRequestSchema.parse(body);

    // Compute urgency based on hours remaining until deadline
    const now = new Date();
    const deadline = new Date(validated.pickupDeadline);
    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    let urgencyLevel = "MEDIUM";
    if (diffHours <= 1) urgencyLevel = "URGENT";
    else if (diffHours <= 2) urgencyLevel = "HIGH";
    else if (diffHours <= 4) urgencyLevel = "MEDIUM";
    else urgencyLevel = "LOW";

    const surplus = await prisma.surplusRequest.create({
      data: {
        sourceType: validated.sourceType,
        sourceId: validated.sourceId || null,
        reporterId,
        foodType: validated.foodType,
        quantityPortions: validated.quantityPortions,
        estimatedWeightKg: validated.estimatedWeightKg,
        availableFrom: new Date(validated.availableFrom),
        pickupDeadline: deadline,
        pickupLocation: validated.pickupLocation,
        contactPhone: validated.contactPhone,
        notes: validated.notes || null,
        urgencyLevel,
        status: "PENDING",
      },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, name: true } },
      },
    });

    return successResponse(surplus, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(`Failed to create surplus request: ${error.message}`, 500);
  }
}
