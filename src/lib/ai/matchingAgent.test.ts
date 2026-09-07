import { describe, it, expect } from "vitest";
import { calculateRecipientMatches } from "@/lib/ai/matchingAgent";

// Minimal Organization shape matching Prisma's generated type
const makeOrg = (overrides: Partial<any> = {}): any => ({
  id: "org-test-1",
  name: "Test Shelter",
  type: "SHELTER",
  verificationStatus: "VERIFIED",
  serviceArea: "North Campus (0-5 km)",
  maxCapacityMeals: 100,
  acceptedCategories: '["VEGETARIAN"]',
  pickupAvailability: '{"hours":"08:00-21:00","days":"Mon-Sun"}',
  contactName: "Jane Doe",
  contactPhone: "+1-555-0001",
  locationAddress: "123 North St",
  latitude: 40.715,
  longitude: -74.005,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const baseSurplus = {
  id: "req-test-1",
  foodType: "VEGETARIAN",
  quantityPortions: 60,
  pickupLocation: "Science Hall, North Campus",
  pickupDeadline: new Date(Date.now() + 3 * 3600 * 1000), // 3 hours from now
  latitude: 40.7128,
  longitude: -74.006,
};

describe("matchingAgent — calculateRecipientMatches", () => {
  it("throws when no organizations are provided", () => {
    expect(() => calculateRecipientMatches(baseSurplus, [])).toThrow();
  });

  it("returns a recommendedCandidate and alternativeCandidates", () => {
    const org1 = makeOrg({ id: "org-1", name: "Org A", maxCapacityMeals: 100 });
    const org2 = makeOrg({ id: "org-2", name: "Org B", maxCapacityMeals: 80 });
    const result = calculateRecipientMatches(baseSurplus, [org1, org2]);
    expect(result.recommendedCandidate).toBeDefined();
    expect(result.alternativeCandidates).toHaveLength(1);
  });

  it("isVerifiedOnlyBoundary is always true", () => {
    const result = calculateRecipientMatches(baseSurplus, [makeOrg()]);
    expect(result.isVerifiedOnlyBoundary).toBe(true);
  });

  it("sorts candidates by totalMatchScore descending", () => {
    const highCapacity = makeOrg({ id: "org-high", name: "High Cap", maxCapacityMeals: 200 });
    const lowCapacity = makeOrg({ id: "org-low", name: "Low Cap", maxCapacityMeals: 10 });
    const result = calculateRecipientMatches(baseSurplus, [lowCapacity, highCapacity]);
    expect(result.recommendedCandidate.organizationId).toBe("org-high");
  });

  it("totalMatchScore is between 0 and 100", () => {
    const result = calculateRecipientMatches(baseSurplus, [makeOrg()]);
    expect(result.recommendedCandidate.totalMatchScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendedCandidate.totalMatchScore).toBeLessThanOrEqual(100);
  });

  it("score breakdown weights sum to 100% of total", () => {
    const result = calculateRecipientMatches(baseSurplus, [makeOrg()]);
    const { capacityScore, distanceScore, deadlineScore, reliabilityScore } =
      result.recommendedCandidate.scoreBreakdown;
    const weighted = capacityScore * 0.3 + distanceScore * 0.3 + deadlineScore * 0.2 + reliabilityScore * 0.2;
    expect(Math.abs(result.recommendedCandidate.totalMatchScore - weighted)).toBeLessThan(0.2);
  });

  it("adds potentialIssue when portions exceed org capacity", () => {
    const org = makeOrg({ maxCapacityMeals: 10 }); // surplus needs 60
    const result = calculateRecipientMatches(baseSurplus, [org]);
    expect(result.recommendedCandidate.potentialIssues?.some((p) => p.includes("capacity"))).toBe(true);
  });

  it("adds potentialIssue for very tight deadline (≤1.5h)", () => {
    const tightDeadline = {
      ...baseSurplus,
      pickupDeadline: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    };
    const result = calculateRecipientMatches(tightDeadline, [makeOrg()]);
    expect(result.recommendedCandidate.potentialIssues?.some((p) => p.includes("deadline"))).toBe(true);
  });

  it("uses Haversine scoring when both lat/lon are present", () => {
    // org is placed exactly at the same coords as surplus → distance ≈ 0 → score 98
    const nearOrg = makeOrg({ latitude: baseSurplus.latitude, longitude: baseSurplus.longitude });
    const result = calculateRecipientMatches(baseSurplus, [nearOrg]);
    expect(result.recommendedCandidate.scoreBreakdown.distanceScore).toBe(98);
  });

  it("falls back to string heuristic and adds potentialIssue when org has no coordinates", () => {
    const noCoords = makeOrg({ latitude: null, longitude: null });
    const result = calculateRecipientMatches(baseSurplus, [noCoords]);
    expect(result.recommendedCandidate.potentialIssues?.some((p) => p.includes("GPS"))).toBe(true);
  });

  it("uses reliabilityMap value when provided", () => {
    const org = makeOrg({ id: "org-reliable" });
    const reliabilityMap = { "org-reliable": 95 };
    const result = calculateRecipientMatches(baseSurplus, [org], reliabilityMap);
    expect(result.recommendedCandidate.scoreBreakdown.reliabilityScore).toBe(95);
  });

  it("defaults reliability to 70 for orgs not in reliabilityMap", () => {
    const org = makeOrg({ id: "org-new" });
    const result = calculateRecipientMatches(baseSurplus, [org], {});
    expect(result.recommendedCandidate.scoreBreakdown.reliabilityScore).toBe(70);
  });
});
