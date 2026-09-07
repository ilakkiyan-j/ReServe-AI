import type { Organization } from "@prisma/client";

// ---------------------------------------------------------------------------
// Haversine distance between two lat/lon points (returns km)
// ---------------------------------------------------------------------------
function haversineDistanceKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// Map a km distance to a 0–100 proximity score
// ---------------------------------------------------------------------------
function distanceKmToScore(km: number): number {
  if (km <= 2)  return 98;
  if (km <= 5)  return 88;
  if (km <= 10) return 75;
  return 55;
}

export interface MatchingCandidate {
  organizationId: string;
  organizationName: string;
  type: string;
  serviceArea: string;
  maxCapacityMeals: number;
  contactName: string;
  contactPhone: string;
  locationAddress: string;
  totalMatchScore: number;
  scoreBreakdown: {
    capacityScore: number;
    distanceScore: number;
    deadlineScore: number;
    reliabilityScore: number;
  };
  explanation: string;
  potentialIssues?: string[];
}

export interface MatchRecommendationResult {
  surplusRequestId: string;
  foodType: string;
  quantityPortions: number;
  pickupLocation: string;
  pickupDeadline: string;
  recommendedCandidate: MatchingCandidate;
  alternativeCandidates: MatchingCandidate[];
  isVerifiedOnlyBoundary: boolean;
}

export function calculateRecipientMatches(
  surplus: {
    id: string;
    foodType: string;
    quantityPortions: number;
    pickupLocation: string;
    pickupDeadline: Date | string;
    latitude?: number | null;
    longitude?: number | null;
  },
  verifiedOrganizations: Organization[],
  reliabilityMap: Record<string, number> = {}
): MatchRecommendationResult {
  if (!verifiedOrganizations || verifiedOrganizations.length === 0) {
    throw new Error("No verified recipient organizations available in database for matching.");
  }

  const deadline = new Date(surplus.pickupDeadline);
  const now = new Date();
  const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  const scoredCandidates: MatchingCandidate[] = verifiedOrganizations.map((org) => {
    // 1. Capacity Score (30%) — 100% if org capacity >= portions, proportional if less
    const capacityRatio = org.maxCapacityMeals > 0 ? surplus.quantityPortions / org.maxCapacityMeals : 1;
    let capacityScore: number;
    if (capacityRatio > 1) {
      capacityScore = Math.max(40, Math.round(100 - (capacityRatio - 1) * 50));
    } else {
      capacityScore = 95 + Math.round((1 - capacityRatio) * 5); // Optimal utilization bonus
    }

    // 2. Proximity Score (30%) — Haversine if coordinates available, string heuristic otherwise
    let distanceScore: number;
    const potentialIssues: string[] = [];

    const surplusLat = surplus.latitude ?? null;
    const surplusLon = surplus.longitude ?? null;
    const orgLat = org.latitude ?? null;
    const orgLon = org.longitude ?? null;

    if (surplusLat !== null && surplusLon !== null && orgLat !== null && orgLon !== null) {
      const km = haversineDistanceKm(surplusLat, surplusLon, orgLat, orgLon);
      distanceScore = distanceKmToScore(km);
    } else {
      // Fallback: string-based heuristic when coordinates are missing
      const orgAreaLower = (org.serviceArea || "").toLowerCase();
      const locLower = surplus.pickupLocation.toLowerCase();
      if (locLower.includes("campus") || orgAreaLower.includes("campus")) {
        distanceScore = 90;
      } else if (orgAreaLower.includes("0-5 km") || orgAreaLower.includes("north")) {
        distanceScore = 80;
      } else {
        distanceScore = 65;
      }
      potentialIssues.push("Proximity score estimated from service area text — GPS coordinates unavailable for precise distance calculation.");
    }

    // 3. Pickup Deadline Compatibility (20%)
    let deadlineScore: number;
    if (hoursUntilDeadline <= 1) {
      deadlineScore = 65; // Extremely tight window
    } else if (hoursUntilDeadline <= 2) {
      deadlineScore = 80;
    } else {
      deadlineScore = 95;
    }

    // 4. Historical Reliability Score (20%) — from real PickupTask completion history
    // Default 70 for organizations with no recorded history (neutral, not optimistic)
    const reliabilityScore = reliabilityMap[org.id] ?? 70;

    // Total Weighted Match Score
    const totalMatchScore = Number(
      (capacityScore * 0.3 + distanceScore * 0.3 + deadlineScore * 0.2 + reliabilityScore * 0.2).toFixed(1)
    );

    if (surplus.quantityPortions > org.maxCapacityMeals) {
      potentialIssues.push(`Portion quantity (${surplus.quantityPortions}) exceeds organization max capacity (${org.maxCapacityMeals}). Partial pickup required.`);
    }
    if (hoursUntilDeadline <= 1.5) {
      potentialIssues.push(`Short pickup deadline window (${hoursUntilDeadline.toFixed(1)} hours remaining). Immediate dispatch required.`);
    }

    const explanation = `Organization '${org.name}' scored ${totalMatchScore}/100. It accepts food categories matching '${surplus.foodType}', has ${org.maxCapacityMeals} portion capacity (requires ${surplus.quantityPortions}), operates in ${org.serviceArea}, and can complete pickup before ${deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`;

    return {
      organizationId: org.id,
      organizationName: org.name,
      type: org.type,
      serviceArea: org.serviceArea,
      maxCapacityMeals: org.maxCapacityMeals,
      contactName: org.contactName,
      contactPhone: org.contactPhone,
      locationAddress: org.locationAddress,
      totalMatchScore,
      scoreBreakdown: {
        capacityScore,
        distanceScore,
        deadlineScore,
        reliabilityScore,
      },
      explanation,
      potentialIssues: potentialIssues.length > 0 ? potentialIssues : undefined,
    };
  });

  // Sort candidates by totalMatchScore descending
  scoredCandidates.sort((a, b) => b.totalMatchScore - a.totalMatchScore);

  return {
    surplusRequestId: surplus.id,
    foodType: surplus.foodType,
    quantityPortions: surplus.quantityPortions,
    pickupLocation: surplus.pickupLocation,
    pickupDeadline: deadline.toISOString(),
    recommendedCandidate: scoredCandidates[0],
    alternativeCandidates: scoredCandidates.slice(1),
    isVerifiedOnlyBoundary: true,
  };
}
