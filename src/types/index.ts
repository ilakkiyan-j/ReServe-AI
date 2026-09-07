export type UserRole = "ADMIN" | "CAFETERIA_MANAGER" | "EVENT_MANAGER" | "RECIPIENT_ORGANIZATION";

export type OrgType = "CAMPUS_CAFETERIA" | "COMMUNITY_NGO" | "SHELTER" | "FOOD_BANK" | "EVENT_HOST";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type SurplusUrgency = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type SurplusStatus =
  | "PENDING"
  | "VALIDATING"
  | "MATCHING"
  | "MATCH_FOUND"
  | "AWAITING_ACCEPTANCE"
  | "ACCEPTED"
  | "PICKUP_ASSIGNED"
  | "PICKED_UP"
  | "COMPLETED"
  | "EXPIRED"
  | "CANCELLED";

export type PickupStatus = "ASSIGNED" | "IN_TRANSIT" | "ARRIVED" | "COMPLETED" | "FAILED";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string | null;
}
