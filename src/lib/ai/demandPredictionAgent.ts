export interface DemandPredictionInput {
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS";
  expectedAttendance: number;
  academicCalendarType: "REGULAR_CLASS" | "REGULAR_EXAM" | "HOLIDAY";
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  historicalLogs?: any[];
}

export interface DemandPredictionResult {
  expectedAttendance: number;
  predictedConsumption: number;
  recommendedPreparation: number;
  safetyMarginPortions: number;
  safetyMarginPercentage: number;
  surplusRiskLevel: "LOW" | "MEDIUM" | "HIGH";
  confidenceScore: number;
  rationale: string;
  isSyntheticData: boolean;
}

export function predictCafeteriaDemand(input: DemandPredictionInput): DemandPredictionResult {
  const { mealType, expectedAttendance, academicCalendarType, dayOfWeek, historicalLogs = [] } = input;

  // Meal type multiplier baseline
  let mealMultiplier = 0.85; // LUNCH default: ~85% of attendance eats in cafeteria
  if (mealType === "BREAKFAST") mealMultiplier = 0.65;
  if (mealType === "DINNER") mealMultiplier = 0.75;
  if (mealType === "SNACKS") mealMultiplier = 0.40;

  // Calendar multiplier
  let calendarMultiplier = 1.0;
  if (academicCalendarType === "REGULAR_EXAM") calendarMultiplier = 0.90; // Fewer stay for full meals
  if (academicCalendarType === "HOLIDAY") calendarMultiplier = 0.30;

  // Weekend multiplier
  let dayMultiplier = 1.0;
  if (dayOfWeek === 0 || dayOfWeek === 6) dayMultiplier = 0.70;

  // Compute baseline forecast
  let rawPrediction = expectedAttendance * mealMultiplier * calendarMultiplier * dayMultiplier;

  // Incorporate historical log moving average if available
  if (historicalLogs.length > 0) {
    const relevantLogs = historicalLogs.filter((log) => log.mealType === mealType);
    if (relevantLogs.length > 0) {
      const avgConsumed = relevantLogs.reduce((acc, curr) => acc + (curr.actualConsumed || curr.predictedConsumption), 0) / relevantLogs.length;
      rawPrediction = rawPrediction * 0.4 + avgConsumed * 0.6; // Weighted blend
    }
  }

  const predictedConsumption = Math.round(rawPrediction);

  // 5% Safety Buffer for preparation recommendation
  const safetyMarginPercentage = 5;
  const safetyMarginPortions = Math.ceil(predictedConsumption * (safetyMarginPercentage / 100));
  const recommendedPreparation = predictedConsumption + safetyMarginPortions;

  // Assess surplus risk level
  let surplusRiskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (academicCalendarType === "HOLIDAY" || dayOfWeek === 5) {
    surplusRiskLevel = "HIGH";
  } else if (academicCalendarType === "REGULAR_EXAM") {
    surplusRiskLevel = "MEDIUM";
  }

  const confidenceScore = historicalLogs.length >= 5 ? 0.91 : 0.82;

  const rationale = `Based on ${expectedAttendance} expected attendance for ${mealType} on ${academicCalendarType.replace("_", " ")}, baseline consumption is predicted at ${predictedConsumption} portions. A conservative ${safetyMarginPercentage}% safety buffer (+${safetyMarginPortions} portions) is applied to formulate the recommended preparation of ${recommendedPreparation} portions while minimizing over-preparation waste.`;

  return {
    expectedAttendance,
    predictedConsumption,
    recommendedPreparation,
    safetyMarginPortions,
    safetyMarginPercentage,
    surplusRiskLevel,
    confidenceScore,
    rationale,
    isSyntheticData: true,
  };
}

export function calculateAccuracyMetrics(logs: { actualConsumed?: number | null; predictedConsumption: number }[]) {
  const validLogs = logs.filter((l) => l.actualConsumed !== undefined && l.actualConsumed !== null);

  if (validLogs.length === 0) {
    return { mae: 0, rmse: 0, sampleCount: 0 };
  }

  let totalAbsoluteError = 0;
  let totalSquaredError = 0;

  validLogs.forEach((l) => {
    const error = Math.abs((l.actualConsumed as number) - l.predictedConsumption);
    totalAbsoluteError += error;
    totalSquaredError += error * error;
  });

  const mae = Number((totalAbsoluteError / validLogs.length).toFixed(2));
  const rmse = Number((Math.sqrt(totalSquaredError / validLogs.length)).toFixed(2));

  return {
    mae,
    rmse,
    sampleCount: validLogs.length,
  };
}
