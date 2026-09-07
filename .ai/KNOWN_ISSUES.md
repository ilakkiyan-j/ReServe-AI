# Known Issues Log

## Phase 13 — Resolved Issues

The following issues identified during the Phase 13 code review have been fully resolved:

| # | Severity | Issue | Resolution |
|---|----------|-------|------------|
| 1 | High | `ragAssistantAgent` was a hard-coded `if/else` chain, not RAG | Replaced with `scoreDocument()` + `extractRelevantSentences()` over real DB content |
| 2 | High | Proximity score derived from `string.includes("campus")` substring | Haversine distance from lat/lon with score mapping; string fallback flagged in `potentialIssues` |
| 3 | High | Reliability score was constant `92` for all organizations | Real `PickupTask` history query; neutral default 70 for new orgs |
| 4 | Medium | `Math.max(real, 2840)` silently inflated impact metrics | All floor values removed; dashboard shows real DB values |
| 5 | Medium | Monthly trend chart was fully hardcoded (Mar–Jul 2026) | Derived from real `SurplusRequest.createdAt` grouping |
| 6 | Medium | In-memory notification store lost on server restart | New `Notification` DB model; `dispatchSystemNotification` / `getSystemNotifications` are DB-backed |
| 7 | Low | `verifiedOrganizations: any[]` in matching agent | Typed as `Organization[]` from `@prisma/client` |
| 8 | Low | CO2 and cost share same magic number `2.50` accidentally | Named `DISPOSAL_COST_PER_KG` and `CO2_KG_PER_KG_FOOD` constants |
| 9 | Low | Fake phone `+1 (555) 345-6789` silently returned by extractor | Regex phone extraction; `"unknown"` fallback + warning |

## Currently Known Issues

*No known issues detected post Phase 13.*
