# Domain Data Models & Prisma Schema Specification — Campus Food Rescue AI

## Entity Relationship Overview

```text
+--------------+       1:N       +-----------------+
| Organization | <-------------> | User            |
+--------------+                 +-----------------+
       ^                                  |
       | 1:N                              | 1:N
       v                                  v
+-----------------+              +-----------------+
| SurplusRequest  |              | Event           |
+-----------------+              +-----------------+
       |                                  |
       | 1:1                              | 1:N (optional)
       v                                  v
+-----------------+              +-----------------+
| PickupTask      |              | SurplusRequest  |
+-----------------+              +-----------------+
       |
       v 1:1
+-----------------+
| ImpactLog       |
+-----------------+
```

---

## Detailed Data Schemas

### 1. User (`User`)
- `id`: String (UUID, PK)
- `name`: String
- `email`: String (Unique)
- `passwordHash`: String
- `role`: Enum (`ADMIN`, `CAFETERIA_MANAGER`, `EVENT_MANAGER`, `RECIPIENT_ORGANIZATION`)
- `organizationId`: String (FK, Optional -> Organization)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2. Organization (`Organization`)
- `id`: String (UUID, PK)
- `name`: String
- `type`: Enum (`CAMPUS_CAFETERIA`, `COMMUNITY_NGO`, `SHELTER`, `FOOD_BANK`, `EVENT_HOST`)
- `verificationStatus`: Enum (`PENDING`, `VERIFIED`, `REJECTED`)
- `serviceArea`: String
- `maxCapacityMeals`: Int
- `acceptedCategories`: String (JSON Array / Comma-separated: e.g., `["VEGETARIAN", "VEGAN", "NON_VEGETARIAN", "DRY_GOODS"]`)
- `pickupAvailability`: String (JSON operating hours)
- `contactName`: String
- `contactPhone`: String
- `locationAddress`: String
- `latitude`: Float (Optional)
- `longitude`: Float (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 3. Event (`Event`)
- `id`: String (UUID, PK)
- `name`: String
- `organizerId`: String (FK -> User)
- `department`: String
- `eventDate`: DateTime
- `startTime`: String
- `endTime`: String
- `location`: String
- `expectedAttendance`: Int
- `mealsPrepared`: Int (Optional)
- `foodProvider`: String
- `createdAt`: DateTime

### 4. SurplusRequest (`SurplusRequest`)
- `id`: String (UUID, PK)
- `sourceType`: Enum (`EVENT`, `CAFETERIA`)
- `sourceId`: String (Optional FK to Event)
- `reporterId`: String (FK -> User)
- `foodType`: String (e.g., "Vegetarian Prepared Meals")
- `quantityPortions`: Int
- `estimatedWeightKg`: Float
- `availableFrom`: DateTime
- `pickupDeadline`: DateTime
- `pickupLocation`: String
- `contactPhone`: String
- `notes`: String (Optional)
- `urgencyLevel`: Enum (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- `status`: Enum (`PENDING`, `VALIDATING`, `MATCHING`, `MATCH_FOUND`, `AWAITING_ACCEPTANCE`, `ACCEPTED`, `PICKUP_ASSIGNED`, `PICKED_UP`, `COMPLETED`, `EXPIRED`, `CANCELLED`)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 5. MatchRecommendation (`MatchRecommendation`)
- `id`: String (UUID, PK)
- `surplusRequestId`: String (FK -> SurplusRequest)
- `organizationId`: String (FK -> Organization)
- `matchScore`: Float (0 - 100)
- `scoreBreakdown`: String (JSON: capacityScore, distanceScore, deadlineScore, foodTypeScore)
- `explanation`: String
- `status`: Enum (`PROPOSED`, `SELECTED`, `ACCEPTED`, `REJECTED`)
- `createdAt`: DateTime

### 6. PickupTask (`PickupTask`)
- `id`: String (UUID, PK)
- `surplusRequestId`: String (FK, Unique -> SurplusRequest)
- `assignedOrgId`: String (FK -> Organization)
- `pickupDeadline`: DateTime
- `status`: Enum (`ASSIGNED`, `IN_TRANSIT`, `ARRIVED`, `COMPLETED`, `FAILED`)
- `confirmedByUserId`: String (FK, Optional -> User)
- `completedAt`: DateTime (Optional)
- `notes`: String (Optional)

### 7. CafeteriaDemandLog (`CafeteriaDemandLog`)
- `id`: String (UUID, PK)
- `date`: DateTime
- `mealType`: Enum (`BREAKFAST`, `LUNCH`, `DINNER`, `SNACKS`)
- `expectedAttendance`: Int
- `academicCalendarType`: String (e.g. "REGULAR_EXAM", "REGULAR_CLASS", "HOLIDAY")
- `dayOfWeek`: Int
- `predictedConsumption`: Int
- `recommendedPreparation`: Int
- `actualPrepared`: Int (Optional)
- `actualConsumed`: Int (Optional)
- `actualSurplus`: Int (Optional)
- `maeScore`: Float (Optional)
- `createdAt`: DateTime

### 8. ImpactLog (`ImpactLog`)
- `id`: String (UUID, PK)
- `surplusRequestId`: String (FK, Unique -> SurplusRequest)
- `mealsRescued`: Int
- `weightKgPrevented`: Float
- `disposalCostSavedUsd`: Float
- `co2EmissionsAvoidedKg`: Float
- `recordedAt`: DateTime

### 9. KnowledgeDocument (`KnowledgeDocument`)
- `id`: String (UUID, PK)
- `title`: String
- `category`: String (e.g. "Food Safety", "SDG 12", "Campus Best Practices")
- `content`: String
- `sourceUrl`: String (Optional)
- `createdAt`: DateTime

### 10. Notification (`Notification`) *(Added Phase 13)*
- `id`: String (UUID, PK)
- `type`: String — one of `MATCH_PROPOSED`, `MATCH_ACCEPTED`, `MATCH_REJECTED`, `PICKUP_ASSIGNED`, `STATUS_UPDATE`, `RESCUE_COMPLETED`, `EXPIRATION_WARNING`
- `title`: String
- `message`: String
- `targetRole`: String (Optional — `null` means all roles see it)
- `surplusRequestId`: String (Optional FK reference, not enforced at DB level)
- `isRead`: Boolean (default `false`)
- `createdAt`: DateTime

> **Note:** Replaces the former in-memory `notificationStore[]` array in `coordinationAgent.ts`. Notifications now persist across server restarts and are consistent across serverless instances.
