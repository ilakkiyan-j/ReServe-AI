import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma before importing the agent
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    notification: {
      create: vi.fn().mockImplementation(({ data }: any) => ({
        id: "notif-test-1",
        ...data,
        isRead: false,
        createdAt: new Date(),
      })),
      findMany: vi.fn().mockResolvedValue([]),
    },
    surplusRequest: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    organization: {
      findUnique: vi.fn(),
    },
    matchRecommendation: {
      updateMany: vi.fn(),
    },
    pickupTask: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    impactLog: {
      upsert: vi.fn(),
    },
  },
}));

import { dispatchSystemNotification, getSystemNotifications } from "@/lib/ai/coordinationAgent";
import { prisma } from "@/lib/db/prisma";

describe("coordinationAgent — dispatchSystemNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls prisma.notification.create with correct data", async () => {
    const createSpy = vi.mocked(prisma.notification.create);
    createSpy.mockResolvedValueOnce({
      id: "notif-1",
      type: "MATCH_ACCEPTED",
      title: "Match Accepted!",
      message: "Org X accepted.",
      targetRole: "ALL",
      surplusRequestId: "req-1",
      isRead: false,
      createdAt: new Date(),
    } as any);

    const result = await dispatchSystemNotification({
      type: "MATCH_ACCEPTED",
      title: "Match Accepted!",
      message: "Org X accepted.",
      targetRole: "ALL",
      surplusRequestId: "req-1",
    });

    expect(createSpy).toHaveBeenCalledOnce();
    expect(result.id).toBe("notif-1");
    expect(result.type).toBe("MATCH_ACCEPTED");
    expect(result.isRead).toBe(false);
  });

  it("returns a notification with a timestamp string", async () => {
    const now = new Date();
    vi.mocked(prisma.notification.create).mockResolvedValueOnce({
      id: "notif-2", type: "STATUS_UPDATE", title: "Updated", message: "msg",
      targetRole: null, surplusRequestId: null, isRead: false, createdAt: now,
    } as any);

    const result = await dispatchSystemNotification({
      type: "STATUS_UPDATE", title: "Updated", message: "msg",
    });
    expect(typeof result.timestamp).toBe("string");
    expect(result.timestamp).toBe(now.toISOString());
  });
});

describe("coordinationAgent — getSystemNotifications", () => {
  beforeEach(() => vi.clearAllMocks());

  it("queries DB with role filter when role is provided", async () => {
    const findSpy = vi.mocked(prisma.notification.findMany).mockResolvedValueOnce([]);
    await getSystemNotifications("EVENT_MANAGER");
    expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ OR: expect.any(Array) }),
    }));
  });

  it("queries DB without filter when no role provided", async () => {
    const findSpy = vi.mocked(prisma.notification.findMany).mockResolvedValueOnce([]);
    await getSystemNotifications();
    expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({
      where: undefined,
    }));
  });

  it("limits results to 50", async () => {
    const findSpy = vi.mocked(prisma.notification.findMany).mockResolvedValueOnce([]);
    await getSystemNotifications();
    expect(findSpy).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }));
  });

  it("maps DB records to SystemNotification shape", async () => {
    const now = new Date();
    vi.mocked(prisma.notification.findMany).mockResolvedValueOnce([{
      id: "n1", type: "RESCUE_COMPLETED", title: "Done!", message: "All rescued.",
      targetRole: "ALL", surplusRequestId: "req-1", isRead: true, createdAt: now,
    }] as any);

    const results = await getSystemNotifications();
    expect(results[0].id).toBe("n1");
    expect(results[0].timestamp).toBe(now.toISOString());
    expect(results[0].isRead).toBe(true);
  });
});
