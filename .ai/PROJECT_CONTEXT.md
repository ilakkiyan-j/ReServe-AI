# Campus Food Rescue AI — Project Context

## Project Overview
- **Project Name:** Campus Food Rescue AI
- **Primary SDG:** SDG 12 — Responsible Consumption and Production
- **Secondary SDG:** SDG 2 — Zero Hunger (where redistribution reaches verified community organizations)
- **Core Concept:** An AI-powered campus platform that predicts avoidable food surplus from messes/cafeterias (PREVENT mode) and helps event organizers report unavoidable surplus (RESCUE mode), intelligently matching edible surplus with verified recipient organizations and coordinating redistribution.

## Target Users
1. **Cafeteria / Mess Manager**: Views meal demand predictions, inputs consumption data, reviews preparation recommendations, reports actual surplus.
2. **Event Organizer / Event Manager**: Registers campus events, reports unavoidable food surplus post-event via structured forms or natural language, tracks redistribution.
3. **Campus Sustainability / Administrator**: Monitors campus-wide food surplus, verifies recipient organizations, monitors rescue activity, views impact analytics.
4. **Verified Recipient Organization**: Manages org profile, capacity, accepted food categories, accepts/rejects surplus matches, confirms pickup & receipt.

## Core Feature Modules
- Module 1: Authentication & Role-Based Access Control (RBAC)
- Module 2: Campus Event Management
- Module 3: Surplus Food Intake (Form + Natural Language AI Extraction)
- Module 4: Cafeteria Food Demand Prediction (Prevent Mode)
- Module 5: Surplus Classification & Urgency Assessment
- Module 6: Verified Recipient Directory
- Module 7: AI Recipient Matching Agent (Transparent Multi-Criteria Scoring)
- Module 8: Redistribution Workflow
- Module 9: Notifications & Status Tracking
- Module 10: Pickup Coordination Engine
- Module 11: Impact & Sustainability Dashboard (SDG 12 / SDG 2 metrics)
- Module 12: Sustainability RAG Assistant (Grounded Knowledge QA)

## Technology Stack
- **Frontend & App Framework:** Next.js 14+ (App Router, React 18, TypeScript)
- **Styling:** Custom CSS System / Tailwind CSS (Sleek dark/light theme, glassmorphism, dynamic micro-animations)
- **Database & ORM:** PostgreSQL / SQLite with Prisma ORM
- **AI Stack:** Demand Forecasting Models, Structured NLP Entity Extractor, Rule/Agentic Matcher, Grounded RAG Pipeline

## Key Constraints
- **NO IoT / Hardware:** Pure software and AI project. No sensors, smart bins, Arduino, or physical weighing devices.
- **No Over-Engineering:** Modular monolith structure preferred over unnecessary microservices or distributed infrastructure.
- **Strict Verification:** AI matching must ONLY consider verified recipient organizations stored in the official database. No hallucinated recipients.
- **Human Oversight:** Critical food redistribution decisions and surplus reports remain human-verifiable.
- **Data Integrity:** Synthetic demo data must be explicitly labeled as synthetic.
