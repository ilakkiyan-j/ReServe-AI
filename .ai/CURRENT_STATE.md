# Current Project State — ReServe AI

## Current Phase
**Phase 13 — AI Quality & Data Integrity Improvements** (Completed)

## Product Name & Tagline
**ReServe AI — Rescue More. Waste Less.**

## Development Status
🎉 **All 12 Build Phases + Phase 13 AI Quality Pass Completed Successfully!**

## Master Features Matrix
- **Phase 01 — Discovery & Memory Setup**: Memory tracking structure initialized in `.ai/`.
- **Phase 02 — Architecture & UX**: Full system architecture, RBAC matrix, and workflow diagrams created in `docs/`.
- **Phase 03 — Project Foundation**: Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, SQLite DB, and layout shell.
- **Phase 04 — Auth & RBAC**: Bcrypt hashing, `jose` Web Crypto JWT, auth API routes, Edge middleware, and Auth Modal with 4 seed demo accounts.
- **Phase 05 — Event & Surplus Management**: Event CRUD, manual surplus request reporting, deadline urgency calculator (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and status badges.
- **Phase 06 — Cafeteria Demand Prediction (PREVENT Mode)**: Regression forecasting agent, 5% safety margin preparation optimizer, MAE/RMSE accuracy evaluator, prediction cards, SVG comparison charts, and historical log tables.
- **Phase 07 — AI Surplus Extraction (NLP Intake)**: Conversational text entity extractor agent, `POST /api/surplus/extract`, natural language modal with 3 sample prompt chips, confidence score, warning alerts, and human verification form.
- **Phase 08 — AI Recipient Matching Agent (RESCUE Mode)**: Multi-criteria transparent scoring algorithm (Capacity 30%, Proximity 30%, Deadline 20%, Reliability 20%), strict verified database boundary audit, explainability generator, and matching modal dialog.
- **Phase 09 — Pickup & Notification Workflow**: Coordination agent, match response evaluator (ACCEPT/REJECT with candidate fallback re-ranking), pickup state machine (`ASSIGNED` -> `IN_TRANSIT` -> `ARRIVED` -> `COMPLETED`), automatic `ImpactLog` creation, and DB-persisted notification system.
- **Phase 10 — Analytics & Impact Dashboard**: Dynamic sustainability metrics calculator (SDG 12 & SDG 2), total meals rescued, food weight saved, disposal cost saved, CO2 avoided, match success rate, real monthly trend chart from live DB data, department breakdown progress bars, and transparent estimation disclaimers.
- **Phase 11 — RAG Assistant & Responsible AI**: Document-content-driven knowledge retrieval using token-overlap scoring over seeded `KnowledgeDocument` records, sentence extraction from actual document content, domain boundary guardrail protection, conversational drawer UI, and citations grounded in real document data.
- **Phase 12 — Integration & Final Polish**: Branding & tagline sync (**ReServe AI — Rescue More. Waste Less.**), full RBAC testing across 4 demo roles, seed script verification, 100% clean production build (`npm run build`).
- **Phase 13 — AI Quality & Data Integrity**: 9 targeted fixes across all 6 AI agent modules. Haversine proximity scoring, real reliability scores from PickupTask history, DB-persisted notifications, accurate phone extraction, named constants, type safety upgrade, real impact metrics, and genuine document-grounded RAG.

## Working Features
- 100% of planned features fully operational and verified.

## Partially Implemented
- None.

## Broken Features
- None.

## Current Database
- SQLite `prisma/dev.db` — schema updated with `Notification` model (added in Phase 13).
- Contains 4 seed users, 2 verified recipient orgs (with lat/lon), 1 event, 1 surplus request, 6 cafeteria demand logs, 1 impact log, 5 knowledge documents.

## Production Build Status
- `npm run build`: **PASS** (`✓ Generating static pages (21/21)`).

## Phase 13 AI Changes Summary
| Agent | Changes |
|-------|---------|
| `matchingAgent.ts` | Prisma `Organization` type; Haversine distance scoring; real reliability from PickupTask history |
| `surplusExtractorAgent.ts` | Phone regex extraction; `"unknown"` fallback + warning instead of fake number |
| `coordinationAgent.ts` | Named `DISPOSAL_COST_PER_KG` / `CO2_KG_PER_KG_FOOD` constants; async DB-backed `dispatchSystemNotification` / `getSystemNotifications` |
| `impactAgent.ts` | All `Math.max(real, demoFloor)` inflators removed; monthly trend from real `SurplusRequest.createdAt` |
| `ragAssistantAgent.ts` | `if/else` chain replaced with `scoreDocument()` + `extractRelevantSentences()`; confidence from real token-overlap score |
| `prisma/schema.prisma` | New `Notification` model added; `db push` applied |
| `matching/route.ts` | `groupBy` PickupTask query builds `reliabilityMap` before calling agent |
| `notifications/route.ts` | `getSystemNotifications` is now awaited (async DB call) |
