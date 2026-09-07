import { prisma } from "@/lib/db/prisma";

export interface SustainabilityMetrics {
  totalMealsRescued: number;
  totalSurplusRequests: number;
  successfulRedistributions: number;
  participatingEventsCount: number;
  verifiedOrganizationsCount: number;
  estimatedWeightKg: number;
  estimatedDisposalCostSavedUsd: number;
  estimatedCo2EmissionsAvoidedKg: number;
  matchSuccessRate: number;
  departmentBreakdown: { department: string; meals: number; count: number }[];
  monthlyTrend: { month: string; mealsRescued: number; requestsCount: number }[];
}

export async function calculateSustainabilityImpact(): Promise<SustainabilityMetrics> {
  const surplusRequests = await prisma.surplusRequest.findMany({
    include: { event: true, impactLog: true },
  });

  const impactLogs = await prisma.impactLog.findMany();
  const events = await prisma.event.findMany();
  const verifiedOrgs = await prisma.organization.findMany({
    where: { verificationStatus: "VERIFIED" },
  });

  const totalSurplusRequests = surplusRequests.length;
  const successfulRedistributions = surplusRequests.filter(
    (r) => r.status === "COMPLETED" || r.status === "ACCEPTED" || r.status === "PICKED_UP"
  ).length;

  let totalMealsRescued = 0;
  let estimatedWeightKg = 0;
  let estimatedDisposalCostSavedUsd = 0;
  let estimatedCo2EmissionsAvoidedKg = 0;

  impactLogs.forEach((log) => {
    totalMealsRescued += log.mealsRescued;
    estimatedWeightKg += log.weightKgPrevented;
    estimatedDisposalCostSavedUsd += log.disposalCostSavedUsd;
    estimatedCo2EmissionsAvoidedKg += log.co2EmissionsAvoidedKg;
  });

  // Include meals from completed requests not yet in an ImpactLog
  surplusRequests.forEach((req) => {
    if ((req.status === "COMPLETED" || req.status === "ACCEPTED") && !req.impactLog) {
      totalMealsRescued += req.quantityPortions;
      estimatedWeightKg += req.estimatedWeightKg;
      estimatedDisposalCostSavedUsd += req.estimatedWeightKg * 2.5;
      estimatedCo2EmissionsAvoidedKg += req.estimatedWeightKg * 2.5;
    }
  });

  const matchSuccessRate =
    totalSurplusRequests > 0
      ? Number(((successfulRedistributions / totalSurplusRequests) * 100).toFixed(1))
      : 0;

  // Department Breakdown — derived from real event + surplus data
  const deptMap: Record<string, { meals: number; count: number }> = {};
  events.forEach((evt) => {
    const dept = evt.department || "General Campus";
    if (!deptMap[dept]) deptMap[dept] = { meals: 0, count: 0 };
    deptMap[dept].count += 1;
  });
  surplusRequests.forEach((req) => {
    if (req.event) {
      const dept = req.event.department || "General Campus";
      if (!deptMap[dept]) deptMap[dept] = { meals: 0, count: 0 };
      deptMap[dept].meals += req.quantityPortions;
    }
  });
  const departmentBreakdown = Object.entries(deptMap).map(([department, data]) => ({
    department,
    meals: data.meals,
    count: data.count,
  }));

  // Monthly trend — derived from real SurplusRequest createdAt dates
  const trendMap: Record<string, { mealsRescued: number; requestsCount: number }> = {};
  surplusRequests
    .filter((r) => r.status === "COMPLETED" || r.status === "ACCEPTED" || r.status === "PICKED_UP")
    .forEach((req) => {
      const d = new Date(req.createdAt);
      const key = `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`;
      if (!trendMap[key]) trendMap[key] = { mealsRescued: 0, requestsCount: 0 };
      trendMap[key].mealsRescued += req.quantityPortions;
      trendMap[key].requestsCount += 1;
    });

  const monthlyTrend = Object.entries(trendMap)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => new Date("1 " + a.month).getTime() - new Date("1 " + b.month).getTime());

  return {
    totalMealsRescued,
    totalSurplusRequests,
    successfulRedistributions,
    participatingEventsCount: events.length,
    verifiedOrganizationsCount: verifiedOrgs.length,
    estimatedWeightKg: Number(estimatedWeightKg.toFixed(1)),
    estimatedDisposalCostSavedUsd: Number(estimatedDisposalCostSavedUsd.toFixed(2)),
    estimatedCo2EmissionsAvoidedKg: Number(estimatedCo2EmissionsAvoidedKg.toFixed(1)),
    matchSuccessRate,
    departmentBreakdown,
    monthlyTrend,
  };
}
