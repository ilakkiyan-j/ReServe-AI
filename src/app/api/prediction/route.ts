import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { predictCafeteriaDemand, calculateAccuracyMetrics } from "@/lib/ai/demandPredictionAgent";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    const historicalLogs = await prisma.cafeteriaDemandLog.findMany({
      orderBy: { date: "desc" },
      take: 20,
    });

    const metrics = calculateAccuracyMetrics(historicalLogs);

    // Generate forecast for current/upcoming lunch meal
    const latestPrediction = predictCafeteriaDemand({
      mealType: "LUNCH",
      expectedAttendance: 600,
      academicCalendarType: "REGULAR_CLASS",
      dayOfWeek: new Date().getDay(),
      historicalLogs,
    });

    return successResponse({
      latestPrediction,
      accuracyMetrics: metrics,
      historicalLogs,
    });
  } catch (error: any) {
    return errorResponse(`Failed to fetch prediction data: ${error.message}`, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mealType, expectedAttendance, academicCalendarType, date } = body;

    const targetDate = date ? new Date(date) : new Date();

    const historicalLogs = await prisma.cafeteriaDemandLog.findMany({
      orderBy: { date: "desc" },
      take: 20,
    });

    const prediction = predictCafeteriaDemand({
      mealType: mealType || "LUNCH",
      expectedAttendance: Number(expectedAttendance) || 600,
      academicCalendarType: academicCalendarType || "REGULAR_CLASS",
      dayOfWeek: targetDate.getDay(),
      historicalLogs,
    });

    // Save prediction record
    const log = await prisma.cafeteriaDemandLog.create({
      data: {
        date: targetDate,
        mealType: mealType || "LUNCH",
        expectedAttendance: Number(expectedAttendance) || 600,
        academicCalendarType: academicCalendarType || "REGULAR_CLASS",
        dayOfWeek: targetDate.getDay(),
        predictedConsumption: prediction.predictedConsumption,
        recommendedPreparation: prediction.recommendedPreparation,
      },
    });

    return successResponse({
      prediction,
      logRecord: log,
    }, 201);
  } catch (error: any) {
    return errorResponse(`Failed to generate prediction: ${error.message}`, 500);
  }
}
