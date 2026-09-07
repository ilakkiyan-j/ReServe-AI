# Architecture Decision Records (ADRs)

## ADR-001 — Framework Selection: Next.js 14+ with App Router
Date: 2026-08-20
Status: Accepted

### Context
The application requires a seamless web interface for multi-role campus users (Admin, Mess Manager, Event Manager, Recipient Org) alongside backend API endpoints and AI integrations.

### Decision
Use **Next.js 14+** with TypeScript, App Router, Server Actions, and API Routes as a Modular Monolith.

### Alternatives Considered
- Separate Express.js backend + React SPA frontend: Adds cross-origin complexity and deployment overhead without significant benefit for prototype scope.

### Reason
Next.js provides built-in server-side API capabilities, unified type-safety, efficient routing, and simplified deployment.

### Consequences
Code structure will maintain clear separation between `/app` (pages/UI), `/lib/services` (business logic), `/lib/ai` (AI agents), and `/prisma` (data access).

---

## ADR-002 — Database Strategy: Prisma ORM with Relational Schema
Date: 2026-08-20
Status: Accepted

### Context
The system manages structured relational entities: users, organizations, events, surplus requests, pickup tasks, and impact logs.

### Decision
Use **Prisma ORM** targeting SQLite for zero-config rapid local development and testing, maintaining 100% migration compatibility with PostgreSQL.

### Alternatives Considered
- Raw SQL / Custom DB wrappers: High maintenance, prone to schema drift.
- NoSQL (MongoDB): Poor fit for relational matching and transactional pickup status workflows.

### Reason
Prisma offers full type generation, schema migration support, and clean relational queries.

---

## ADR-003 — AI Agent Architecture: Specialized Function Modules
Date: 2026-08-20
Status: Accepted

### Context
The system includes multiple AI capabilities (demand forecasting, NLP entity extraction, transparent matching, RAG assistant).

### Decision
Implement AI capabilities as modular agentic handlers located in `lib/ai/`:
1. `demandPredictionAgent.ts`
2. `surplusExtractorAgent.ts`
3. `matchingAgent.ts`
4. `coordinationAgent.ts`
5. `impactAgent.ts`
6. `sustainabilityRagAgent.ts`

### Alternatives Considered
- Single monolithic LLM prompt: Unreliable, non-deterministic, hard to audit and test.

### Reason
Decoupled agent modules allow independent testing, structured fallbacks, deterministic scoring, and clear human-in-the-loop verification interfaces.

---

## ADR-004 — Synthetic Data & Transparency Protocol
Date: 2026-08-20
Status: Accepted

### Context
Initial deployment and testing rely on synthetic campus food consumption datasets and test recipient org profiles.

### Decision
All synthetic metrics and predictions MUST be explicitly labeled in the UI as `[DEMO / SYNTHETIC DATA]`. AI matching recommendations MUST display transparent scoring factors (e.g. distance, capacity match, category compatibility).

### Reason
Adheres to Responsible AI principles and explicit Master Prompt directives against presenting synthetic data as real measurements.

---

## ADR-005 — Proximity Scoring: Haversine over String Heuristics
Date: Phase 13
Status: Accepted

### Context
The original proximity score for recipient matching used `string.includes("campus")` substring matching — a fabricated score that violated ADR-004's transparency requirement. The `Organization` schema already carries `latitude` and `longitude` fields that were unused.

### Decision
Use the Haversine formula to compute great-circle distance (km) between the surplus pickup location and each recipient organization's stored coordinates. Map distance to a 0–100 score (≤2 km → 98, ≤5 km → 88, ≤10 km → 75, >10 km → 55). When coordinates are absent on either side, fall back to the service-area string heuristic, but add a `potentialIssues` warning to the match output.

### Reason
Transparent, auditable, and measurable. Eliminates fabricated scores while maintaining a graceful degradation path.

---

## ADR-006 — Reliability Score: Real History over Constant
Date: Phase 13
Status: Accepted

### Context
Every recipient organization was assigned `reliabilityScore = 92` regardless of their actual pickup history, undermining the claimed transparency of the 4-factor matching algorithm.

### Decision
Query `PickupTask` completion stats per organization (`COMPLETED` / (`COMPLETED` + `FAILED`) × 100). Pass results as a `reliabilityMap: Record<orgId, number>` into `calculateRecipientMatches()`. Organizations with no resolved pickup history default to a neutral score of 70 (not 92).

### Reason
ADR-003 requires deterministic, auditable scoring. A hardcoded constant is neither.

---

## ADR-007 — Notification Persistence: Database over In-Memory Store
Date: Phase 13
Status: Accepted

### Context
`coordinationAgent.ts` stored notifications in a module-level `const notificationStore: SystemNotification[] = []`. This is lost on every server restart and incompatible with serverless/multi-instance deployments.

### Decision
Add a `Notification` model to the Prisma schema. `dispatchSystemNotification` writes to the DB. `getSystemNotifications` queries with `orderBy: createdAt desc, take: 50`. Both functions are now `async`.

### Reason
Correct and deployment-safe. Notifications survive restarts and are consistent across instances.

---

## ADR-008 — RAG Assistant: Document-Content Retrieval over Hard-Coded Responses
Date: Phase 13
Status: Accepted

### Context
`ragAssistantAgent.ts` was an `if/else` chain on keyword strings. Documents were retrieved and attached as citations, but their *content* was never read — answers were pre-written strings. This is not retrieval-augmented generation.

### Decision
Replace the `if/else` chain with `scoreDocument()` (token-overlap TF-IDF approximation) and `extractRelevantSentences()` (sentence-level extraction from `doc.content`). The answer is built from actual document sentences ranked by query relevance. Confidence score is the normalized retrieval score, not a fixed constant. No external LLM required.

### Reason
Answers are now genuinely grounded in the knowledge base content. Citations are accurate. The system degrades gracefully to an out-of-domain boundary when no document scores above the relevance threshold.
