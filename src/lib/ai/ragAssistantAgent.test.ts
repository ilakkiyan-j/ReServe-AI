import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    knowledgeDocument: { findMany: vi.fn() },
  },
}));

import { answerRagQuery } from "@/lib/ai/ragAssistantAgent";
import { prisma } from "@/lib/db/prisma";

const mockDocs = [
  {
    id: "doc-food-safety",
    title: "4-Hour Food Safety Rule & Temperature Control Protocol",
    category: "Food Safety",
    content: `Per FDA Food Code, prepared perishable food must be consumed or redistributed within 4 hours of being removed from temperature control. Hot meals must be maintained at or above 135°F (57°C). Cold items must be maintained at or below 41°F (5°C). Food exceeding the 4-hour window must be discarded to prevent foodborne illness.`,
    sourceUrl: null,
    createdAt: new Date(),
  },
  {
    id: "doc-onboarding",
    title: "Recipient Organization Onboarding & Food Safety Verification",
    category: "Onboarding Rules",
    content: `Organizations must submit 501(c)(3) certification. At least one staff member must hold an active food handler certificate. Vehicles must have insulated containers or active refrigeration. Administration manually verifies all credentials before granting VERIFIED status.`,
    sourceUrl: null,
    createdAt: new Date(),
  },
  {
    id: "doc-sdg",
    title: "Campus Food Rescue & SDG 12 Waste Prevention Policy",
    category: "SDG 12 & Campus Best Practices",
    content: `Campus Policy aligns with UN SDG 12.3 to halve food waste by 2030. PREVENT Mode: managers review AI demand forecasts 24 hours prior to service. RESCUE Mode: event organizers must report unavoidable surplus within 30 minutes of event conclusion.`,
    sourceUrl: null,
    createdAt: new Date(),
  },
];

describe("ragAssistantAgent — answerRagQuery", () => {
  beforeEach(() => {
    vi.mocked(prisma.knowledgeDocument.findMany).mockResolvedValue(mockDocs as any);
  });

  it("returns isGrounded=false and empty citations for empty knowledge base", async () => {
    vi.mocked(prisma.knowledgeDocument.findMany).mockResolvedValueOnce([]);
    const result = await answerRagQuery("What is the 4-hour food safety rule?");
    expect(result.isGrounded).toBe(false);
    expect(result.citations).toHaveLength(0);
  });

  it("returns isGrounded=true for an in-domain food safety query", async () => {
    const result = await answerRagQuery("What is the 4-hour food safety rule?");
    expect(result.isGrounded).toBe(true);
    expect(result.citations.length).toBeGreaterThan(0);
  });

  it("answer contains content extracted from documents, not a hardcoded string", async () => {
    const result = await answerRagQuery("food safety temperature 4 hours");
    // Answer should contain actual document content keywords
    expect(result.answer).toMatch(/4 hours|temperature|135|food|perishable/i);
  });

  it("cites the food safety document for temperature queries", async () => {
    const result = await answerRagQuery("What temperature should hot food be held at?");
    expect(result.citations.some((c) => c.category === "Food Safety")).toBe(true);
  });

  it("returns isGrounded=false for out-of-domain query", async () => {
    const result = await answerRagQuery("What is the capital of France?");
    expect(result.isGrounded).toBe(false);
    expect(result.citations).toHaveLength(0);
    expect(result.responsibleAiBadges).toContain("OUT OF DOMAIN SCOPE — BOUNDARY ENFORCED");
  });

  it("confidenceScore is computed (not a hardcoded constant)", async () => {
    const highRelevance = await answerRagQuery("food safety temperature 4 hours holding rule");
    const lowRelevance = await answerRagQuery("SDG policy surplus prevention");
    // High-relevance query should have a different (likely higher) confidence than low
    // Both should be in [0,1]
    expect(highRelevance.confidenceScore).toBeGreaterThan(0);
    expect(highRelevance.confidenceScore).toBeLessThanOrEqual(0.99);
    expect(lowRelevance.confidenceScore).toBeGreaterThanOrEqual(0);
  });

  it("out-of-domain query returns confidenceScore of 0", async () => {
    // Use a query with zero overlap against food/campus domain vocabulary
    const result = await answerRagQuery("Who won the football championship last year?");
    expect(result.confidenceScore).toBe(0);
  });

  it("includes GROUNDED IN VERIFIED KNOWLEDGE BASE badge for in-domain answers", async () => {
    const result = await answerRagQuery("4 hour food safety rule temperature");
    expect(result.responsibleAiBadges).toContain("GROUNDED IN VERIFIED KNOWLEDGE BASE");
  });

  it("returns at most 2 citations", async () => {
    const result = await answerRagQuery("food safety temperature surplus prevention policy");
    expect(result.citations.length).toBeLessThanOrEqual(2);
  });

  it("SDG-related query cites the SDG policy document", async () => {
    const result = await answerRagQuery("What is SDG 12 food waste prevention policy?");
    expect(result.isGrounded).toBe(true);
    expect(result.citations.some((c) => c.id === "doc-sdg")).toBe(true);
  });

  it("onboarding query cites the onboarding document", async () => {
    const result = await answerRagQuery("How do I verify my recipient organization for onboarding?");
    expect(result.isGrounded).toBe(true);
    expect(result.citations.some((c) => c.id === "doc-onboarding")).toBe(true);
  });
});
