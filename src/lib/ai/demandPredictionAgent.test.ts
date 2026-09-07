import { describe, it, expect } from "vitest";
import {
  predictCafeteriaDemand,
  calculateAccuracyMetrics,
  DemandPredictionInput,
} from "@/lib/ai/demandPredictionAgent";

describe("demandPredictionAgent — predictCafeteriaDemand", () => {
  const baseInput: DemandPredictionInput = {
    mealType: "LUNCH",
    expectedAttendance: 600,
    academicCalendarType: "REGULAR_CLASS",
    dayOfWeek: 2, // Tuesday
  };

  it("predicts consumption below full attendance for LUNCH on a regular day", () => {
    const result = predictCafeteriaDemand(baseInput);
    expect(result.predictedConsumption).toBeLessThan(baseInput.expectedAttendance);
    expect(result.predictedConsumption).toBeGreaterThan(0);
  });

  it("applies a 5% safety margin on top of predicted consumption", () => {
    const result = predictCafeteriaDemand(baseInput);
    expect(result.safetyMarginPercentage).toBe(5);
    expect(result.recommendedPreparation).toBe(
      result.predictedConsumption + result.safetyMarginPortions
    );
  });

  it("HOLIDAY days produce HIGH surplus risk", () => {
    const result = predictCafeteriaDemand({ ...baseInput, academicCalendarType: "HOLIDAY" });
    expect(result.surplusRiskLevel).toBe("HIGH");
  });

  it("REGULAR_EXAM produces MEDIUM surplus risk", () => {
    const result = predictCafeteriaDemand({ ...baseInput, academicCalendarType: "REGULAR_EXAM" });
    expect(result.surplusRiskLevel).toBe("MEDIUM");
  });

  it("REGULAR_CLASS weekday produces LOW surplus risk", () => {
    const result = predictCafeteriaDemand(baseInput);
    expect(result.surplusRiskLevel).toBe("LOW");
  });

  it("Saturday (dayOfWeek=6) reduces prediction via dayMultiplier", () => {
    const weekday = predictCafeteriaDemand(baseInput); // Tuesday
    const saturday = predictCafeteriaDemand({ ...baseInput, dayOfWeek: 6 });
    expect(saturday.predictedConsumption).toBeLessThan(weekday.predictedConsumption);
  });

  it("BREAKFAST predicts lower consumption than LUNCH for same attendance", () => {
    const lunch = predictCafeteriaDemand(baseInput);
    const breakfast = predictCafeteriaDemand({ ...baseInput, mealType: "BREAKFAST" });
    expect(breakfast.predictedConsumption).toBeLessThan(lunch.predictedConsumption);
  });

  it("SNACKS predicts lowest consumption", () => {
    const snacks = predictCafeteriaDemand({ ...baseInput, mealType: "SNACKS" });
    const dinner = predictCafeteriaDemand({ ...baseInput, mealType: "DINNER" });
    expect(snacks.predictedConsumption).toBeLessThan(dinner.predictedConsumption);
  });

  it("blends historical logs when available (weighted 60% history)", () => {
    const historicalLogs = [
      { mealType: "LUNCH", predictedConsumption: 400, actualConsumed: 410 },
      { mealType: "LUNCH", predictedConsumption: 420, actualConsumed: 430 },
      { mealType: "LUNCH", predictedConsumption: 450, actualConsumed: 440 },
      { mealType: "LUNCH", predictedConsumption: 460, actualConsumed: 455 },
      { mealType: "LUNCH", predictedConsumption: 470, actualConsumed: 465 },
    ];
    const withHistory = predictCafeteriaDemand({ ...baseInput, historicalLogs });
    const withoutHistory = predictCafeteriaDemand(baseInput);
    // Different results because history is blended
    expect(withHistory.predictedConsumption).not.toBe(withoutHistory.predictedConsumption);
    // With 5 logs confidence is higher
    expect(withHistory.confidenceScore).toBe(0.91);
    expect(withoutHistory.confidenceScore).toBe(0.82);
  });

  it("isSyntheticData is always true (prototype)", () => {
    expect(predictCafeteriaDemand(baseInput).isSyntheticData).toBe(true);
  });
});

describe("demandPredictionAgent — calculateAccuracyMetrics", () => {
  it("returns zero metrics when no logs have actualConsumed", () => {
    const result = calculateAccuracyMetrics([
      { predictedConsumption: 500 },
      { predictedConsumption: 480 },
    ]);
    expect(result).toEqual({ mae: 0, rmse: 0, sampleCount: 0 });
  });

  it("calculates correct MAE and RMSE for known values", () => {
    // errors: |500-490|=10, |480-490|=10 → MAE=10, RMSE=10
    const result = calculateAccuracyMetrics([
      { predictedConsumption: 500, actualConsumed: 490 },
      { predictedConsumption: 480, actualConsumed: 490 },
    ]);
    expect(result.mae).toBe(10);
    expect(result.rmse).toBe(10);
    expect(result.sampleCount).toBe(2);
  });

  it("skips null/undefined actualConsumed entries", () => {
    const result = calculateAccuracyMetrics([
      { predictedConsumption: 500, actualConsumed: 490 },
      { predictedConsumption: 480, actualConsumed: null },
      { predictedConsumption: 460, actualConsumed: undefined },
    ]);
    expect(result.sampleCount).toBe(1);
  });
});
