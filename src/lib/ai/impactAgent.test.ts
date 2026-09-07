import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    surplusRequest: { findMany: vi.fn() },
    impactLog: { findMany: vi.fn() },
    event: { findMany: vi.fn() },
    organization: { findMany: vi.fn() },
  },
}));

import { calculateSustainabilityImpact } from "@/lib/ai/impactAgent";
import { prisma } from "@/lib/db/prisma";

const mockOrg = { id: "org-1", verificationStatus: "VERIFIED" };
const mockEvent = { id: "evt-1", department: "Computer Science" };
const makeRequest = (status: string, qty: number, weightKg: number) => ({
  id: `req-${status}`, status, quantityPortions: qty, estimatedWeightKg: weightKg,
  event: mockEvent, impactLog: null, createdAt: new Date("2026-08-01"),
});

describe("impactAgent — calculateSustainabilityImpact", () => {
  beforeEach(() => {
    vi.mocked(prisma.impactLog.findMany).mockResolvedValue([]);
    vi.mocked(prisma.event.findMany).mockResolvedValue([mockEvent] as any);
    vi.mocked(prisma.organization.findMany).mockResolvedValue([mockOrg] as any);
  });

  it("returns 0 meals rescued when no requests exist", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([]);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.totalMealsRescued).toBe(0);
    expect(metrics.totalSurplusRequests).toBe(0);
  });

  it("counts COMPLETED requests as successful redistributions", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([
      makeRequest("COMPLETED", 60, 15),
    ] as any);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.successfulRedistributions).toBe(1);
  });

  it("counts ACCEPTED requests as successful redistributions", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([
      makeRequest("ACCEPTED", 40, 10),
    ] as any);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.successfulRedistributions).toBe(1);
  });

  it("PENDING requests do NOT count as successful redistribution", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([
      makeRequest("PENDING", 30, 8),
    ] as any);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.successfulRedistributions).toBe(0);
  });

  it("does NOT inflate metrics with Math.max floor values", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([]);
    const metrics = await calculateSustainabilityImpact();
    // Old code returned Math.max(0, 2840) = 2840. New code returns 0.
    expect(metrics.totalMealsRescued).toBe(0);
    expect(metrics.totalSurplusRequests).toBe(0);
    expect(metrics.participatingEventsCount).toBe(1); // real event count
    expect(metrics.verifiedOrganizationsCount).toBe(1); // real org count
  });

  it("matchSuccessRate is 0 when no requests exist (not 100)", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([]);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.matchSuccessRate).toBe(0);
  });

  it("matchSuccessRate calculates correctly (1 of 2 completed = 50%)", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([
      makeRequest("COMPLETED", 60, 15),
      makeRequest("PENDING", 40, 10),
    ] as any);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.matchSuccessRate).toBe(50);
  });

  it("monthly trend is empty when no completed requests exist", async () => {
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([
      makeRequest("PENDING", 30, 8),
    ] as any);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.monthlyTrend).toHaveLength(0);
  });

  it("monthly trend groups COMPLETED requests by month", async () => {
    const req1 = { ...makeRequest("COMPLETED", 60, 15), createdAt: new Date("2026-07-05") };
    const req2 = { ...makeRequest("COMPLETED", 40, 10), createdAt: new Date("2026-07-20") };
    const req3 = { ...makeRequest("COMPLETED", 30, 8),  createdAt: new Date("2026-08-01") };
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([req1, req2, req3] as any);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.monthlyTrend).toHaveLength(2); // Jul + Aug
    const julEntry = metrics.monthlyTrend.find((t) => t.month.includes("Jul"));
    expect(julEntry?.mealsRescued).toBe(100); // 60 + 40
    expect(julEntry?.requestsCount).toBe(2);
  });

  it("adds impactLog meals to totals", async () => {
    vi.mocked(prisma.impactLog.findMany).mockResolvedValue([
      { mealsRescued: 65, weightKgPrevented: 16.25, disposalCostSavedUsd: 40.62, co2EmissionsAvoidedKg: 40.62 },
    ] as any);
    vi.mocked(prisma.surplusRequest.findMany).mockResolvedValue([]);
    const metrics = await calculateSustainabilityImpact();
    expect(metrics.totalMealsRescued).toBe(65);
    // toFixed(1) rounds 16.25 → 16.3, so check with 0-decimal precision
    expect(metrics.estimatedWeightKg).toBeCloseTo(16.25, 0);
  });
});
