# Changelog — ReServe AI

All notable changes to the **ReServe AI — Rescue More. Waste Less.** project will be documented in this file.

## [1.1.0] - Phase 13 AI Quality & Data Integrity Pass
### Fixed
- **matchingAgent.ts** — `verifiedOrganizations` parameter typed as `Organization[]` (was `any[]`). Haversine great-circle distance scoring replaces substring heuristic for Proximity (30%) factor. Reliability score now computed from real `PickupTask` COMPLETED/FAILED history per org (default 70 for new orgs) instead of hardcoded constant 92.
- **surplusExtractorAgent.ts** — Fake US phone `+1 (555) 345-6789` removed. Phone now extracted via regex with `"unknown"` fallback and a user-facing warning added to `warnings[]`.
- **coordinationAgent.ts** — Magic number `2.50` replaced with named constants `DISPOSAL_COST_PER_KG` and `CO2_KG_PER_KG_FOOD`. `dispatchSystemNotification` and `getSystemNotifications` are now `async` and write/read the new `Notification` DB table instead of an in-memory array lost on server restart.
- **impactAgent.ts** — All `Math.max(realValue, demoFloor)` inflators removed. Monthly trend derived from real `SurplusRequest.createdAt` grouping instead of a fully static 2026 hardcoded array. `matchSuccessRate` defaults to `0` instead of `100` when no requests exist.
- **ragAssistantAgent.ts** — Hard-coded `if/else` keyword chain replaced with `scoreDocument()` (token-overlap scoring) + `extractRelevantSentences()` (sentence-level retrieval from actual `KnowledgeDocument.content`). Confidence score is now the normalized retrieval score rather than a fixed constant.
### Added
- **prisma/schema.prisma** — New `Notification` model (`id`, `type`, `title`, `message`, `targetRole?`, `surplusRequestId?`, `isRead`, `createdAt`). Applied via `prisma db push`.
- **matching/route.ts** — `prisma.pickupTask.groupBy()` query builds a `reliabilityMap` per org that is passed into `calculateRecipientMatches()`.
- **notifications/route.ts** — `getSystemNotifications` now awaited (changed from sync to async).

## [1.0.0] - 2026-08-20
### Added & Finalized
- Official Product Branding & Tagline: **ReServe AI — Rescue More. Waste Less.**
- End-to-end integration across all 12 Master AI Agent Development prompt phases.
- Verified 4 RBAC seed accounts (`admin@campusfoodrescue.ai`, `messmanager@campus.edu`, `events@studentclub.edu`, `contact@carehope.org` / password `password123`).
- 6 Decoupled AI Agent Modules:
  1. Demand Forecasting Agent (`demandPredictionAgent.ts`)
  2. NLP Surplus Extractor Agent (`surplusExtractorAgent.ts`)
  3. AI Recipient Matching Agent (`matchingAgent.ts`)
  4. Coordination & Notification Agent (`coordinationAgent.ts`)
  5. Sustainability Impact Agent (`impactAgent.ts`)
  6. RAG Knowledge Assistant Agent (`ragAssistantAgent.ts`)
- Verified 100% clean Next.js production build (`npm run build` -> 21 static/dynamic routes compiled).
- Completed Phase 12: Integration, Testing & Final Polish.
