import { prisma } from "@/lib/db/prisma";

const DISPOSAL_COST_PER_KG = 2.50;  // USD saved per kg of food diverted from disposal
const CO2_KG_PER_KG_FOOD   = 2.50;  // kg of CO2 emissions avoided per kg of food rescued

export type NotificationType =
  | "MATCH_PROPOSED"
  | "MATCH_ACCEPTED"
  | "MATCH_REJECTED"
  | "PICKUP_ASSIGNED"
  | "STATUS_UPDATE"
  | "RESCUE_COMPLETED"
  | "EXPIRATION_WARNING";

export interface SystemNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  targetRole?: string | null;
  surplusRequestId?: string | null;
  isRead: boolean;
}

export async function dispatchSystemNotification(
  notification: Omit<SystemNotification, "id" | "timestamp" | "isRead">
): Promise<SystemNotification> {
  const record = await prisma.notification.create({
    data: {
      type: notification.type,
      title: notification.title,
      message: notification.message,
      targetRole: notification.targetRole ?? null,
      surplusRequestId: notification.surplusRequestId ?? null,
    },
  });
  return {
    id: record.id,
    type: record.type as NotificationType,
    title: record.title,
    message: record.message,
    timestamp: record.createdAt.toISOString(),
    targetRole: record.targetRole ?? undefined,
    surplusRequestId: record.surplusRequestId ?? undefined,
    isRead: record.isRead,
  };
}

export async function getSystemNotifications(userRole?: string): Promise<SystemNotification[]> {
  const records = await prisma.notification.findMany({
    where: userRole
      ? { OR: [{ targetRole: null }, { targetRole: userRole }, { targetRole: "ALL" }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return records.map((r) => ({
    id: r.id,
    type: r.type as NotificationType,
    title: r.title,
    message: r.message,
    timestamp: r.createdAt.toISOString(),
    targetRole: r.targetRole ?? undefined,
    surplusRequestId: r.surplusRequestId ?? undefined,
    isRead: r.isRead,
  }));
}

export async function processMatchResponse(
  surplusRequestId: string,
  organizationId: string,
  accepted: boolean,
  rejectionReason?: string
) {
  const surplus = await prisma.surplusRequest.findUnique({
    where: { id: surplusRequestId },
    include: { event: true, reporter: true },
  });

  if (!surplus) throw new Error("Surplus request not found");

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!org) throw new Error("Organization not found");

  if (accepted) {
    // 1. Update Surplus Request Status -> ACCEPTED & PICKUP_ASSIGNED
    await prisma.surplusRequest.update({
      where: { id: surplus.id },
      data: { status: "ACCEPTED" },
    });

    // 2. Create PickupTask
    const pickupTask = await prisma.pickupTask.upsert({
      where: { surplusRequestId: surplus.id },
      update: {
        status: "ASSIGNED",
        assignedOrgId: org.id,
        pickupDeadline: surplus.pickupDeadline,
      },
      create: {
        surplusRequestId: surplus.id,
        assignedOrgId: org.id,
        pickupDeadline: surplus.pickupDeadline,
        status: "ASSIGNED",
      },
    });

    // 3. Dispatch Notification
    await dispatchSystemNotification({
      type: "MATCH_ACCEPTED",
      title: "Match Accepted & Pickup Assigned!",
      message: `Organization '${org.name}' accepted the surplus request (${surplus.quantityPortions} portions of ${surplus.foodType}). Pickup deadline is ${new Date(surplus.pickupDeadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
      surplusRequestId: surplus.id,
      targetRole: "ALL",
    });

    return { success: true, pickupTask, action: "ACCEPTED" };
  } else {
    // Rejected: Update recommendation status
    await prisma.matchRecommendation.updateMany({
      where: { surplusRequestId: surplus.id, organizationId: org.id },
      data: { status: "REJECTED" },
    });

    await dispatchSystemNotification({
      type: "MATCH_REJECTED",
      title: "Match Declined by Recipient",
      message: `Organization '${org.name}' declined surplus match. Reason: ${rejectionReason || "Capacity unavailable"}. Re-evaluating next candidate...`,
      surplusRequestId: surplus.id,
      targetRole: "EVENT_MANAGER",
    });

    return { success: true, action: "REJECTED" };
  }
}

export async function advancePickupLifecycleStatus(
  pickupTaskId: string,
  newStatus: "ASSIGNED" | "IN_TRANSIT" | "ARRIVED" | "COMPLETED" | "FAILED",
  confirmedByUserId?: string
) {
  const task = await prisma.pickupTask.findUnique({
    where: { id: pickupTaskId },
    include: { surplusRequest: true, assignedOrg: true },
  });

  if (!task) throw new Error("Pickup task not found");

  const updatedTask = await prisma.pickupTask.update({
    where: { id: pickupTaskId },
    data: {
      status: newStatus,
      confirmedByUserId: confirmedByUserId || null,
      completedAt: newStatus === "COMPLETED" ? new Date() : undefined,
    },
  });

  // Map to SurplusRequest status
  let reqStatus = task.surplusRequest.status;
  if (newStatus === "IN_TRANSIT") reqStatus = "PICKED_UP";
  if (newStatus === "COMPLETED") reqStatus = "COMPLETED";

  await prisma.surplusRequest.update({
    where: { id: task.surplusRequestId },
    data: { status: reqStatus },
  });

  // Dispatch Status Notification
  await dispatchSystemNotification({
    type: newStatus === "COMPLETED" ? "RESCUE_COMPLETED" : "STATUS_UPDATE",
    title: newStatus === "COMPLETED" ? "🎉 Surplus Food Rescue Completed!" : `Pickup Status: ${newStatus.replace("_", " ")}`,
    message: `Pickup for '${task.surplusRequest.foodType}' (${task.surplusRequest.quantityPortions} portions) is now ${newStatus.replace("_", " ")}. Assigned Org: ${task.assignedOrg.name}.`,
    surplusRequestId: task.surplusRequestId,
    targetRole: "ALL",
  });

  // If completed, automatically calculate & log impact metrics!
  if (newStatus === "COMPLETED") {
    const meals = task.surplusRequest.quantityPortions;
    const weightKg = task.surplusRequest.estimatedWeightKg;
    const disposalCostSaved = Number((weightKg * DISPOSAL_COST_PER_KG).toFixed(2));
    const co2Avoided        = Number((weightKg * CO2_KG_PER_KG_FOOD).toFixed(2));

    await prisma.impactLog.upsert({
      where: { surplusRequestId: task.surplusRequestId },
      update: {},
      create: {
        surplusRequestId: task.surplusRequestId,
        mealsRescued: meals,
        weightKgPrevented: weightKg,
        disposalCostSavedUsd: disposalCostSaved,
        co2EmissionsAvoidedKg: co2Avoided,
      },
    });
  }

  return updatedTask;
}
