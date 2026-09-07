# ReServe AI — Improvement Plan
# AI Agent Quality Fixes

Generated from code review of all 6 AI agents in `src/lib/ai/`.
Ordered by severity (High → Medium → Low), then by lowest implementation risk first within each tier.

---

## Priority 1 — Low-risk, High-value (Correctness Fixes)

### Fix #7 — Replace `any[]` type in matchingAgent
**File:** `src/lib/ai/matchingAgent.ts`
**Problem:** `verifiedOrganizations: any[]` strips all Prisma type safety from the most critical AI function.
**Fix:** Import `Organization` from `@prisma/client` and type the parameter correctly.
**Risk:** Minimal — pure type change, no runtime behaviour change.

---

### Fix #9 — Remove hardcoded phone fallback in surplusExtractorAgent
**File:** `src/lib/ai/surplusExtractorAgent.ts`
**Problem:** `contactPhone: "+1 (555) 345-6789"` — a fake US number — is silently returned and saved to the DB on every extraction that doesn't find a phone number.
**Fix:** Return `"unknown"`, add it to `warnings[]`, and don't include it in the confidence calculation fields (it was never counted there anyway).
**Risk:** Minimal — no downstream logic depends on a specific phone value.

---

### Fix #8 — Name the CO2 and cost constants in coordinationAgent
**File:** `src/lib/ai/coordinationAgent.ts`
**Problem:** Both `disposalCostSaved` and `co2Avoided` use the magic number `2.50`. They have different units (USD/kg vs kg-CO2/kg) and will silently diverge if either constant changes.
**Fix:** Declare `const DISPOSAL_COST_PER_KG = 2.50` and `const CO2_KG_PER_KG_FOOD = 2.50` at module top. No numeric change, but intent is now explicit.
**Risk:** Zero — purely named constants.

---

## Priority 2 — Medium Complexity (Real Data Wiring)

### Fix #2 — Haversine proximity scoring in matchingAgent
**File:** `src/lib/ai/matchingAgent.ts`
**Problem:** The 30%-weight proximity score is derived from `string.includes("campus")`, not actual distance. The schema has `latitude`/`longitude` on `Organization` but they're never used.
**Fix:**
1. Add a `haversineDistanceKm(lat1, lon1, lat2, lon2)` utility function.
2. Accept a `surplusLatitude` / `surplusLongitude` parameter in `calculateRecipientMatches()` (optional — fall back to string heuristic if null).
3. Map computed km distance to a 0–100 score (0–2km → 98, 2–5km → 88, 5–10km → 75, >10km → 55).
4. If either lat/lon is null, keep the existing string heuristic but flag it in `potentialIssues`.
**Risk:** Low — additive change, existing path preserved as fallback.

---

### Fix #3 — Dynamic reliability score in matchingAgent
**File:** `src/lib/ai/matchingAgent.ts` + `src/app/api/matching/route.ts`
**Problem:** `const reliabilityScore = 92` — every org gets the same score. `PickupTask` has full history.
**Fix:**
1. In the matching API route, query each candidate org's `PickupTask` completion stats: `count(status === 'COMPLETED')` / `count(status IN ['COMPLETED','FAILED'])`.
2. Pass a `reliabilityMap: Record<orgId, number>` into `calculateRecipientMatches()`.
3. In the agent, use `reliabilityMap[org.id] ?? 70` (70 = neutral default for orgs with no history).
**Risk:** Low — new query + map lookup, no schema changes needed.

---

### Fix #6 — Persist notifications to database
**File:** `prisma/schema.prisma`, `src/lib/ai/coordinationAgent.ts`, `src/app/api/notifications/route.ts`
**Problem:** `const notificationStore: SystemNotification[] = []` — in-memory only, lost on restart, broken in serverless.
**Fix:**
1. Add `Notification` model to Prisma schema with fields: `id`, `type`, `title`, `message`, `targetRole?`, `surplusRequestId?`, `isRead` (default false), `createdAt`.
2. Replace `notificationStore` array with `prisma.notification.create()` in `dispatchSystemNotification`.
3. Replace `getSystemNotifications()` with a Prisma query ordered by `createdAt DESC`, limit 50.
4. Run `prisma db push` to apply.
**Risk:** Medium — requires schema migration and DB push.

---

## Priority 3 — Impact Dashboard (Data Integrity)

### Fix #4 & #5 — Remove hardcoded floor values and static monthly trend
**File:** `src/lib/ai/impactAgent.ts`
**Problem:**
- `Math.max(totalMealsRescued, 2840)` silently inflates every metric.
- Monthly trend (Mar–Jul 2026) is fully static hardcoded data.
**Fix:**
1. Remove all `Math.max(realValue, demoFloor)` wrappers — return real DB values directly.
2. Replace static `monthlyTrend` array with a dynamic aggregation:
   - Query `SurplusRequest` records grouped by `YYYY-MM` of `createdAt` where `status IN ['COMPLETED', 'ACCEPTED']`.
   - Return real monthly counts. If fewer than 3 months of data exist, return what's there (empty chart is honest).
3. Move the demo floor values into `prisma/seed.ts` so a fresh seeded install shows representative data legitimately.
**Risk:** Medium — chart will show sparse/empty data until real usage accumulates. This is the correct and honest behaviour.

---

## Priority 4 — RAG Assistant (Core AI Quality)

### Fix #1 — Replace hard-coded if/else with document-content-driven answers
**File:** `src/lib/ai/ragAssistantAgent.ts`
**Problem:** The entire RAG agent is an `if/else` chain. Documents are retrieved and assigned as citations but their *content* is never read. It is a rule-based FAQ engine labelled as RAG.
**Fix (pragmatic — no external LLM required):**
1. Load all `KnowledgeDocument` records from DB.
2. Score each document against the query using TF-IDF-style token overlap (already partially done in `matchingDocs`).
3. Select the top 2 documents by score.
4. Build the answer by **composing sentences extracted from the actual `doc.content`** of the top-ranked docs, instead of returning a hardcoded string.
5. `confidenceScore` = normalized overlap score (tokens matched / total query tokens), not a fixed constant.
6. Keep the out-of-domain boundary for zero-match cases (no documents score above a threshold).

This keeps the system self-contained (no OpenAI key required) while making citations genuinely grounded in document content.
**Risk:** Medium — output text changes from hardcoded strings to document-derived text. UI is unaffected.

---

## Execution Order

```
Fix #7 → Fix #9 → Fix #8   (type + data correctness — single file each, no schema)
Fix #2 → Fix #3             (matching improvements — no schema change)
Fix #6                      (schema change + DB push required)
Fix #4 + Fix #5             (impact agent cleanup)
Fix #1                      (RAG rework — last, most significant logic change)
```

---

## Files Touched Summary

| File | Fixes |
|------|-------|
| `src/lib/ai/matchingAgent.ts` | #7, #2, #3 |
| `src/lib/ai/surplusExtractorAgent.ts` | #9 |
| `src/lib/ai/coordinationAgent.ts` | #8, #6 |
| `src/lib/ai/impactAgent.ts` | #4, #5 |
| `src/lib/ai/ragAssistantAgent.ts` | #1 |
| `src/app/api/matching/route.ts` | #3 (reliability map query) |
| `src/app/api/notifications/route.ts` | #6 (DB-backed reads) |
| `prisma/schema.prisma` | #6 (Notification model) |
| `prisma/seed.ts` | #4 (move demo floors to seed) |
