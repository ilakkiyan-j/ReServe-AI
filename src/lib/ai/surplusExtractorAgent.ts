export interface ExtractedSurplusPayload {
  quantityPortions: number | "unknown";
  foodCategory: string | "unknown";
  sourceEventName: string | "unknown";
  pickupLocation: string | "unknown";
  pickupDeadline: string | "unknown"; // ISO string or human string
  contactPhone: string | "unknown";
  notes: string;
  confidenceScore: number;
  warnings: string[];
}

export function extractSurplusFromText(rawText: string): ExtractedSurplusPayload {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const warnings: string[] = [];

  // 1. Quantity Extraction Regex
  let quantityPortions: number | "unknown" = "unknown";

  // Try patterns in priority order, always extracting the first numeric group
  const qMatch1 = text.match(/(\d+)\s*(portions?|meals?|boxes?|packs?|plates?|servings?)/i);
  const qMatch2 = text.match(/(?:around|approx|approximately|about|~)\s*(\d+)/i);
  const qMatch3 = text.match(/(\d+)\s*(?:vegetarian|veg|non-veg|vegan)?\s*(?:meals?|portions?)/i);
  const rawNum = qMatch1?.[1] ?? qMatch2?.[1] ?? qMatch3?.[1];

  if (rawNum) {
    const num = parseInt(rawNum, 10);
    if (!isNaN(num) && num > 0) {
      quantityPortions = num;
    }
  }

  if (quantityPortions === "unknown") {
    warnings.push("Quantity portions could not be extracted. Please enter quantity manually.");
  }

  // 2. Food Category Extraction
  let foodCategory: string | "unknown" = "unknown";
  if (lower.includes("vegetarian") || lower.includes("veg meal") || lower.includes("veg lunch") || lower.includes("veg dinner")) {
    foodCategory = "VEGETARIAN";
  } else if (lower.includes("vegan")) {
    foodCategory = "VEGAN";
  } else if (lower.includes("non-veg") || lower.includes("chicken") || lower.includes("meat")) {
    foodCategory = "NON_VEGETARIAN";
  } else if (lower.includes("sandwich") || lower.includes("bread") || lower.includes("baked") || lower.includes("pastry")) {
    foodCategory = "BAKED_GOODS";
  } else if (lower.includes("meal") || lower.includes("food") || lower.includes("buffet") || lower.includes("lunch")) {
    foodCategory = "PREPARED_MEALS";
  }

  if (foodCategory === "unknown") {
    warnings.push("Food category unmapped. Defaulted to Prepared Meals.");
    foodCategory = "PREPARED_MEALS";
  }

  // 3. Location Extraction
  let pickupLocation: string | "unknown" = "unknown";
  const locationMatch =
    text.match(/(at|in|located at|from)\s+([A-Z][A-Za-z0-9\s,&-]+?)(?=\s+(until|by|before|available|\.|$))/i) ||
    text.match(/(seminar hall|science hall|auditorium|cafeteria|student center|mess|block [a-z0-9]+|room \d+)/i);

  if (locationMatch) {
    pickupLocation = (locationMatch[2] || locationMatch[1]).trim();
  }

  if (pickupLocation === "unknown") {
    warnings.push("Pickup location missing. Please specify campus building/room.");
  }

  // 4. Pickup Deadline Extraction
  let pickupDeadline: string | "unknown" = "unknown";
  const timeMatch =
    text.match(/(until|by|before)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i) ||
    text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);

  if (timeMatch) {
    const rawTimeStr = timeMatch[2] || timeMatch[1];
    // Create target date assuming today with extracted time
    const today = new Date();
    const timeLower = rawTimeStr.toLowerCase();

    let hours = 20; // Default 8 PM if ambiguous
    let minutes = 0;

    const hourMatch = timeLower.match(/(\d{1,2})(?::(\d{2}))?/);
    if (hourMatch) {
      hours = parseInt(hourMatch[1], 10);
      if (hourMatch[2]) minutes = parseInt(hourMatch[2], 10);
      if (timeLower.includes("pm") && hours < 12) hours += 12;
      if (timeLower.includes("am") && hours === 12) hours = 0;
    }

    today.setHours(hours, minutes, 0, 0);

    // If target time passed today, push to +3 hours from now
    if (today.getTime() < Date.now()) {
      today.setTime(Date.now() + 3 * 3600 * 1000);
    }

    pickupDeadline = today.toISOString();
  } else {
    // Fallback: 3 hours from now
    const fallbackDate = new Date(Date.now() + 3 * 3600 * 1000);
    pickupDeadline = fallbackDate.toISOString();
    warnings.push("Exact deadline time not specified. Set default 3-hour window.");
  }

  // 5. Source Event Name Extraction
  let sourceEventName: string | "unknown" = "unknown";
  const eventMatch = text.match(/(from|after|at)\s+(today's|the)?\s*([A-Z0-9][A-Za-z0-9\s&-]+?(workshop|conference|hackathon|seminar|session|event|meetup|meeting))/i);
  if (eventMatch) {
    sourceEventName = eventMatch[3].trim();
  }

  // Calculate confidence score based on extracted fields count
  let fieldsFound = 0;
  if (quantityPortions !== "unknown") fieldsFound++;
  if (foodCategory !== "unknown") fieldsFound++;
  if (pickupLocation !== "unknown") fieldsFound++;
  if (pickupDeadline !== "unknown") fieldsFound++;

  const confidenceScore = Number((fieldsFound / 4).toFixed(2));

  // 6. Contact Phone — not extractable from free text; require manual entry
  let contactPhone: string = "unknown";
  const phoneMatch = text.match(/(\+?[\d\s\-().]{7,})/);
  if (phoneMatch) {
    contactPhone = phoneMatch[1].trim();
  } else {
    warnings.push("Contact phone number not found. Please enter it manually before submitting.");
  }

  return {
    quantityPortions,
    foodCategory,
    sourceEventName,
    pickupLocation,
    pickupDeadline,
    contactPhone,
    notes: text,
    confidenceScore,
    warnings,
  };
}
