import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { eventSchema } from "@/lib/validations";
import { getCurrentSession } from "@/lib/auth/session";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
        surplusRequests: true,
      },
      orderBy: { eventDate: "desc" },
    });

    return successResponse(events);
  } catch (error: any) {
    return errorResponse(`Failed to fetch events: ${error.message}`, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    // Default fallback to seed user if session not active in local testing
    const organizerId = session?.id || "user-event-1";

    const body = await req.json();
    const validated = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        name: validated.name,
        department: validated.department,
        eventDate: new Date(validated.eventDate),
        startTime: validated.startTime,
        endTime: validated.endTime,
        location: validated.location,
        expectedAttendance: validated.expectedAttendance,
        mealsPrepared: validated.mealsPrepared || null,
        foodProvider: validated.foodProvider,
        organizerId,
      },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return successResponse(event, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse(error.errors[0].message, 400);
    }
    return errorResponse(`Failed to create event: ${error.message}`, 500);
  }
}
