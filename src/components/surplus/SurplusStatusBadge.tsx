import React from "react";
import { Badge } from "@/components/ui/Badge";
import { SurplusStatus, SurplusUrgency } from "@/types";

interface SurplusStatusBadgeProps {
  status: SurplusStatus | string;
}

interface UrgencyBadgeProps {
  urgency: SurplusUrgency | string;
}

export const SurplusStatusBadge: React.FC<SurplusStatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "purple" }> = {
    PENDING: { label: "Pending", variant: "warning" },
    VALIDATING: { label: "Validating AI", variant: "info" },
    MATCHING: { label: "Matching Recipient", variant: "purple" },
    MATCH_FOUND: { label: "Match Found", variant: "info" },
    AWAITING_ACCEPTANCE: { label: "Awaiting Acceptance", variant: "warning" },
    ACCEPTED: { label: "Accepted", variant: "success" },
    PICKUP_ASSIGNED: { label: "Pickup Scheduled", variant: "info" },
    PICKED_UP: { label: "In Transit", variant: "purple" },
    COMPLETED: { label: "Rescue Completed", variant: "success" },
    EXPIRED: { label: "Expired", variant: "danger" },
    CANCELLED: { label: "Cancelled", variant: "default" },
  };

  const config = statusConfig[status] || { label: status, variant: "default" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  const urgencyConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
    LOW: { label: "Low Urgency", variant: "default" },
    MEDIUM: { label: "Medium", variant: "warning" },
    HIGH: { label: "High Urgency", variant: "warning" },
    URGENT: { label: "Urgent Deadline", variant: "danger" },
  };

  const config = urgencyConfig[urgency] || { label: urgency, variant: "default" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
