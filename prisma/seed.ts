import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Verified Recipient Organizations
  const org1 = await prisma.organization.upsert({
    where: { id: "org-care-hope" },
    update: {},
    create: {
      id: "org-care-hope",
      name: "Community Care Hope Shelter",
      type: "SHELTER",
      verificationStatus: "VERIFIED",
      serviceArea: "North Campus & Suburbs (0-5 km)",
      maxCapacityMeals: 120,
      acceptedCategories: JSON.stringify(["VEGETARIAN", "VEGAN", "NON_VEGETARIAN", "DRY_GOODS"]),
      pickupAvailability: JSON.stringify({ hours: "08:00 - 21:00", days: "Mon-Sun" }),
      contactName: "Sarah Jenkins",
      contactPhone: "+1 (555) 234-5678",
      locationAddress: "142 Hope St, North Campus District",
      latitude: 40.7128,
      longitude: -74.006,
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { id: "org-youth-harvest" },
    update: {},
    create: {
      id: "org-youth-harvest",
      name: "City Youth Food Bank",
      type: "FOOD_BANK",
      verificationStatus: "VERIFIED",
      serviceArea: "Central Campus (0-8 km)",
      maxCapacityMeals: 250,
      acceptedCategories: JSON.stringify(["VEGETARIAN", "DRY_GOODS", "BAKED_GOODS"]),
      pickupAvailability: JSON.stringify({ hours: "09:00 - 20:00", days: "Mon-Sat" }),
      contactName: "David Miller",
      contactPhone: "+1 (555) 876-5432",
      locationAddress: "88 Central Ave, City Center",
      latitude: 40.715,
      longitude: -74.002,
    },
  });

  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  // Seed Users for each Role
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@campusfoodrescue.ai" },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: "user-admin-1",
      name: "Campus Admin",
      email: "admin@campusfoodrescue.ai",
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
    },
  });

  const cafeteriaUser = await prisma.user.upsert({
    where: { email: "messmanager@campus.edu" },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: "user-cafeteria-1",
      name: "John Mess Manager",
      email: "messmanager@campus.edu",
      passwordHash: defaultPasswordHash,
      role: "CAFETERIA_MANAGER",
    },
  });

  const eventUser = await prisma.user.upsert({
    where: { email: "events@studentclub.edu" },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: "user-event-1",
      name: "Alex Event Organizer",
      email: "events@studentclub.edu",
      passwordHash: defaultPasswordHash,
      role: "EVENT_MANAGER",
    },
  });

  const recipientUser = await prisma.user.upsert({
    where: { email: "contact@carehope.org" },
    update: { passwordHash: defaultPasswordHash },
    create: {
      id: "user-recipient-1",
      name: "Sarah (Care Hope Shelter)",
      email: "contact@carehope.org",
      passwordHash: defaultPasswordHash,
      role: "RECIPIENT_ORGANIZATION",
      organizationId: org1.id,
    },
  });

  // Seed Sample Campus Event
  const demoEvent = await prisma.event.upsert({
    where: { id: "evt-ai-hackathon" },
    update: {},
    create: {
      id: "evt-ai-hackathon",
      name: "AI & Sustainability Campus Hackathon",
      organizerId: eventUser.id,
      department: "Computer Science Dept",
      eventDate: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      location: "Science Hall Auditorium",
      expectedAttendance: 250,
      mealsPrepared: 280,
      foodProvider: "Campus Central Catering",
    },
  });

  // Seed Sample Surplus Request
  await prisma.surplusRequest.upsert({
    where: { id: "req-hackathon-surplus" },
    update: {},
    create: {
      id: "req-hackathon-surplus",
      sourceType: "EVENT",
      sourceId: demoEvent.id,
      reporterId: eventUser.id,
      foodType: "Vegetarian Lunch Boxes & Salad Packs",
      quantityPortions: 65,
      estimatedWeightKg: 16.25,
      availableFrom: new Date(),
      pickupDeadline: new Date(Date.now() + 3.5 * 3600 * 1000),
      pickupLocation: "Science Hall, Room 102 Pantry",
      contactPhone: "+1 (555) 345-6789",
      notes: "Fresh untouched buffet lunch containers from hackathon afternoon session.",
      urgencyLevel: "MEDIUM",
      status: "PENDING",
    },
  });

  // Seed Sample Impact Log
  await prisma.impactLog.upsert({
    where: { surplusRequestId: "req-hackathon-surplus" },
    update: {},
    create: {
      surplusRequestId: "req-hackathon-surplus",
      mealsRescued: 65,
      weightKgPrevented: 16.25,
      disposalCostSavedUsd: 40.62,
      co2EmissionsAvoidedKg: 40.62,
    },
  });

  // Seed Knowledge Documents for RAG Assistant (Phase 11)
  const knowledgeDocs = [
    {
      id: "doc-food-safety-4hr",
      title: "4-Hour Food Safety Rule & Temperature Control Protocol",
      category: "Food Safety",
      content: `Per FDA Food Code and Campus Food Rescue Guidelines, prepared perishable food must be consumed or safely redistributed within 4 hours of being removed from temperature control.
Key Rules:
1. Hot Food Holding: Hot cooked meals must be maintained at or above 135°F (57°C) prior to pickup.
2. Cold Food Holding: Refrigerated items must be maintained at or below 41°F (5°C).
3. 4-Hour Time Limit: Perishable food held between 41°F and 135°F for more than 4 hours MUST be safely discarded and CANNOT be redistributed.
4. Packaging: All surplus food must be sealed in clean, food-grade containers labeled with food name and preparation time.`,
    },
    {
      id: "doc-recipient-onboarding",
      title: "Recipient Organization Onboarding & Food Safety Verification",
      category: "Onboarding Rules",
      content: `To become a Verified Recipient Organization on Campus Food Rescue AI:
1. 501(c)(3) or Registered NGO Status: Organization must submit tax-exempt certification or official charity registration.
2. Food Handler Certification: At least one staff member or volunteer driver must hold an active ServSafe or state food handler certificate.
3. Cold Chain Transport: Vehicles transporting perishable surplus must have insulated containers or active refrigeration capability.
4. Human Verification: Administration manually verifies all credentials before setting status to 'VERIFIED'.`,
    },
    {
      id: "doc-sdg-campus-policy",
      title: "Campus Food Rescue & SDG 12 Waste Prevention Policy",
      category: "SDG 12 & Campus Best Practices",
      content: `Campus Policy for Food Waste Prevention (PREVENT Mode & RESCUE Mode):
1. PREVENT Mode: Mess and cafeteria managers must review AI demand forecasts 24 hours prior to service to adjust raw preparation quantities by 5%.
2. RESCUE Mode: Event organizers are required to report unavoidable surplus within 30 minutes of event conclusion via freeform AI text intake.
3. Zero Food Waste Target: Aligns with United Nations Sustainable Development Goal 12.3 (Halve per capita global food waste by 2030).`,
    },
  ];

  for (const doc of knowledgeDocs) {
    await prisma.knowledgeDocument.upsert({
      where: { id: doc.id },
      update: {},
      create: doc,
    });
  }
  const demoLogs = [
    { date: new Date(Date.now() - 6 * 86400 * 1000), mealType: "LUNCH", expectedAttendance: 600, academicCalendarType: "REGULAR_CLASS", dayOfWeek: 1, predictedConsumption: 510, recommendedPreparation: 536, actualPrepared: 540, actualConsumed: 518, actualSurplus: 22, maeScore: 8.0 },
    { date: new Date(Date.now() - 5 * 86400 * 1000), mealType: "LUNCH", expectedAttendance: 620, academicCalendarType: "REGULAR_CLASS", dayOfWeek: 2, predictedConsumption: 527, recommendedPreparation: 553, actualPrepared: 555, actualConsumed: 530, actualSurplus: 25, maeScore: 3.0 },
    { date: new Date(Date.now() - 4 * 86400 * 1000), mealType: "LUNCH", expectedAttendance: 580, academicCalendarType: "REGULAR_CLASS", dayOfWeek: 3, predictedConsumption: 493, recommendedPreparation: 518, actualPrepared: 520, actualConsumed: 485, actualSurplus: 35, maeScore: 8.0 },
    { date: new Date(Date.now() - 3 * 86400 * 1000), mealType: "DINNER", expectedAttendance: 550, academicCalendarType: "REGULAR_CLASS", dayOfWeek: 4, predictedConsumption: 412, recommendedPreparation: 433, actualPrepared: 435, actualConsumed: 420, actualSurplus: 15, maeScore: 8.0 },
    { date: new Date(Date.now() - 2 * 86400 * 1000), mealType: "LUNCH", expectedAttendance: 650, academicCalendarType: "REGULAR_EXAM", dayOfWeek: 5, predictedConsumption: 497, recommendedPreparation: 522, actualPrepared: 525, actualConsumed: 490, actualSurplus: 35, maeScore: 7.0 },
    { date: new Date(Date.now() - 1 * 86400 * 1000), mealType: "LUNCH", expectedAttendance: 400, academicCalendarType: "REGULAR_CLASS", dayOfWeek: 6, predictedConsumption: 238, recommendedPreparation: 250, actualPrepared: 250, actualConsumed: 242, actualSurplus: 8, maeScore: 4.0 },
  ];

  for (const item of demoLogs) {
    await prisma.cafeteriaDemandLog.create({
      data: item,
    });
  }

  // Seed Sustainability Knowledge Documents for RAG
  await prisma.knowledgeDocument.createMany({
    data: [
      {
        title: "SDG 12 — Responsible Consumption and Campus Food Safety Guidelines",
        category: "SDG 12",
        content: "UN SDG 12 targets halving global food waste at retail and consumer levels by 2030. Campus cafeteria operations can achieve this by implementing demand-forecasting models, portion control, and direct donor-to-recipient redistribution workflows for safe, hot food within 4 hours of preparation.",
        sourceUrl: "https://sdgs.un.org/goals/goal12",
      },
      {
        title: "Safe Food Redistribution Procedures & Storage Standards",
        category: "Food Safety",
        content: "Prepared hot food intended for redistribution must be maintained above 60°C (140°F) or cooled rapidly to below 4°C (40°F). Prepared meals left at ambient room temperature must be picked up and distributed within a strict 3-hour window.",
        sourceUrl: "https://www.foodsafety.gov",
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
