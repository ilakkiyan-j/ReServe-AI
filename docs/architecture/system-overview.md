# System Architecture Overview — Campus Food Rescue AI

## 1. System Vision & Architecture Principles

Campus Food Rescue AI is built as a **Modular Monolith** using Next.js 14+ (App Router), React, TypeScript, and Prisma ORM.

### Key Principles
- **Dual-Mode System**: Supports both **PREVENT** (Cafeteria demand prediction & preparation optimization) and **RESCUE** (Event surplus reporting & matching redistribution).
- **Strict Human-in-the-Loop**: AI outputs (natural language extraction, recipient matching scores, food preparation recommendations) are transparent, explainable, and reviewable by human operators before final action.
- **Zero IoT Hardware**: 100% software-based solution using standard web interfaces, direct user forms, and natural language text input.
- **Strict Verification Boundaries**: The AI matching agent will ONLY evaluate verified recipient organizations present in the local database.

---

## 2. Role-Based Access Control (RBAC) Matrix

| User Role | Access Boundaries & Permissions |
| :--- | :--- |
| **`ADMIN`** | Full system access. Verifies recipient organizations, manages users/roles, monitors global audit logs, views full impact dashboard, manages RAG knowledge base. |
| **`CAFETERIA_MANAGER`** | Access to cafeteria demand forecasting, historical consumption upload/entry, preparation recommendations, actual surplus reporting, cafeteria impact metrics. |
| **`EVENT_ORGANIZER`** | Access to event management (creation, update), surplus reporting (manual form & AI natural language intake), request tracking, pickup status monitoring. |
| **`RECIPIENT_ORGANIZATION`** | Access to organization profile (capacity, food category preferences, operating hours, location), incoming surplus match requests, match acceptance/rejection, pickup confirmation. |

---

## 3. High-Level Modular Monolith Structure

```text
d:\Projects\ReServe AI\
├── docs/                      # Architecture, diagrams, and workflow specs
├── prisma/                    # Database schema & migrations
├── src/                       # Application source code
│   ├── app/                   # Next.js App Router (pages & API routes)
│   │   ├── (auth)/            # Login, register, profile pages
│   │   ├── (dashboard)/       # Role-specific dashboards (admin, cafeteria, event, recipient)
│   │   ├── api/               # Server API routes
│   │   │   ├── auth/          # Auth endpoints
│   │   │   ├── events/        # Event CRUD
│   │   │   ├── surplus/       # Surplus request lifecycle
│   │   │   ├── prediction/    # Demand prediction APIs
│   │   │   ├── matching/      # AI Recipient matching APIs
│   │   │   ├── pickups/       # Pickup coordination APIs
│   │   │   ├── impact/        # Analytics & metrics APIs
│   │   │   └── rag/           # Sustainability assistant APIs
│   ├── components/            # UI components (Design System)
│   │   ├── ui/                # Buttons, cards, modals, tables, badges
│   │   ├── layout/            # Navbar, sidebar, footers
│   │   └── modules/           # Module-specific widgets (surplus form, prediction chart, matching view)
│   ├── lib/                   # Core business services & utilities
│   │   ├── db/                # Prisma client & database queries
│   │   ├── ai/                # AI Agent implementations
│   │   │   ├── demandPredictionAgent.ts
│   │   │   ├── surplusExtractorAgent.ts
│   │   │   ├── matchingAgent.ts
│   │   │   ├── coordinationAgent.ts
│   │   │   ├── impactAgent.ts
│   │   │   └── ragAssistantAgent.ts
│   │   ├── auth/              # JWT & session utilities
│   │   └── utils/             # Formatters, validators, calculations
│   └── types/                 # TypeScript interfaces & enums
```

---

## 4. Phase 13 AI Improvements Summary

| Area | Before | After |
|------|--------|-------|
| Proximity scoring | `string.includes("campus")` substring | Haversine distance from `lat`/`lon` |
| Reliability scoring | Hardcoded `92` for every org | Real `PickupTask` COMPLETED/FAILED ratio |
| Notification storage | In-memory array (lost on restart) | `Notification` DB model (persistent) |
| Impact metrics | `Math.max(real, 2840)` inflation | Real DB values only |
| Monthly trend | Static hardcoded 2026 array | Grouped from `SurplusRequest.createdAt` |
| RAG assistant | `if/else` keyword chain | Token-overlap scoring + sentence extraction from `KnowledgeDocument.content` |
| Phone extraction | Fake `+1 (555) 345-6789` fallback | Regex extraction; `"unknown"` + warning |
| Type safety | `verifiedOrganizations: any[]` | `Organization[]` from Prisma client |
| CO2 / cost constants | Magic number `2.50` shared | Named `DISPOSAL_COST_PER_KG` / `CO2_KG_PER_KG_FOOD` |

---

## 5. Security & Data Protection Policy

1. **Authentication**: JWT-based session tokens stored in HttpOnly cookies.
2. **Input Validation**: Zod schema validation on all incoming API request bodies.
3. **Data Privacy**: No personal recipient/user PII shared beyond contact name and pickup location necessary for food pickup coordination.
4. **SQL Injection & XSS Protection**: Standard Prisma parameterized queries & React JSX automatic escaping.
