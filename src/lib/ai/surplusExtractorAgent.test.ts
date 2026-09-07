import { describe, it, expect } from "vitest";
import { extractSurplusFromText } from "@/lib/ai/surplusExtractorAgent";

describe("surplusExtractorAgent — extractSurplusFromText", () => {
  it("extracts quantity from 'around 60 vegetarian meals'", () => {
    const result = extractSurplusFromText("We have around 60 vegetarian meals left at Seminar Hall until 8 PM.");
    expect(result.quantityPortions).toBe(60);
  });

  it("extracts quantity from explicit portions format", () => {
    const result = extractSurplusFromText("120 portions of rice and curry available at Science Block.");
    expect(result.quantityPortions).toBe(120);
  });

  it("classifies VEGETARIAN correctly", () => {
    const result = extractSurplusFromText("65 veg lunch boxes available from the hackathon.");
    expect(result.foodCategory).toBe("VEGETARIAN");
  });

  it("classifies NON_VEGETARIAN from chicken keyword", () => {
    const result = extractSurplusFromText("50 chicken meals left from the conference.");
    expect(result.foodCategory).toBe("NON_VEGETARIAN");
  });

  it("classifies BAKED_GOODS from sandwich keyword", () => {
    const result = extractSurplusFromText("30 sandwich boxes available at the cafeteria.");
    expect(result.foodCategory).toBe("BAKED_GOODS");
  });

  it("classifies VEGAN correctly", () => {
    const result = extractSurplusFromText("40 vegan wraps left from the workshop.");
    expect(result.foodCategory).toBe("VEGAN");
  });

  it("defaults food category to PREPARED_MEALS for generic 'food'", () => {
    const result = extractSurplusFromText("Some food left from the event.");
    expect(result.foodCategory).toBe("PREPARED_MEALS");
  });

  it("extracts time deadline correctly (PM format)", () => {
    const result = extractSurplusFromText("60 meals at Science Hall until 8 PM.");
    const deadline = new Date(result.pickupDeadline as string);
    // Should be a valid future date or today at 8 PM
    expect(deadline.getTime()).toBeGreaterThan(Date.now() - 5 * 60 * 1000); // within 5 min tolerance for past correction
  });

  it("uses fallback 3-hour window when no time found", () => {
    const before = Date.now();
    const result = extractSurplusFromText("Some surplus food available at the lab.");
    const deadline = new Date(result.pickupDeadline as string);
    const threeHoursFromNow = before + 3 * 3600 * 1000;
    expect(deadline.getTime()).toBeGreaterThan(before);
    expect(deadline.getTime()).toBeLessThanOrEqual(threeHoursFromNow + 5000); // 5s tolerance
  });

  it("adds warning when quantity not extractable", () => {
    const result = extractSurplusFromText("Some food available.");
    expect(result.warnings.some((w) => w.includes("Quantity"))).toBe(true);
  });

  it("adds warning when location not found", () => {
    const result = extractSurplusFromText("60 meals available until 8 PM.");
    expect(result.warnings.some((w) => w.toLowerCase().includes("location"))).toBe(true);
  });

  it("adds phone warning when no phone number in text", () => {
    const result = extractSurplusFromText("Some food surplus at the lab.");
    expect(result.warnings.some((w) => w.toLowerCase().includes("phone"))).toBe(true);
  });

  it("does NOT return the fake fallback phone number", () => {
    const result = extractSurplusFromText("60 meals at Seminar Hall until 8 PM.");
    expect(result.contactPhone).not.toBe("+1 (555) 345-6789");
  });

  it("confidence score is 0.5 for empty/unrecognisable input (deadline + food category always set)", () => {
    // pickupDeadline always gets a fallback value (1 field)
    // foodCategory always defaults to PREPARED_MEALS (1 field)
    // → minimum confidence is 2/4 = 0.5
    const result = extractSurplusFromText("xyz");
    expect(result.confidenceScore).toBe(0.5);
  });

  it("confidence score increases with more fields extracted", () => {
    const partial = extractSurplusFromText("60 meals at hall.");
    const full = extractSurplusFromText("60 vegetarian meals at Science Hall until 8 PM.");
    expect(full.confidenceScore).toBeGreaterThan(partial.confidenceScore);
  });

  it("notes field always returns the original raw text", () => {
    const text = "60 veg meals at Science Hall.";
    const result = extractSurplusFromText(text);
    expect(result.notes).toBe(text);
  });
});
