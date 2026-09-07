# ReServe AI — Rescue More. Waste Less.

> **Campus Food Surplus Prevention & Intelligent Redistribution Platform**  
> *Developed for the **1M1B – IBM SkillsBuild & AICTE AI for Sustainability Virtual Internship (July–September 2026)**.*  
> *Aligned with United Nations Sustainable Development Goals **SDG 12** (Responsible Consumption & Production), **SDG 2** (Zero Hunger), and **SDG 11** (Sustainable Cities & Communities).*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://reserve-ai.vercel.app)
[![Database](https://img.shields.io/badge/Database-Neon%20Postgres-blue?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![Framework](https://img.shields.io/badge/Framework-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 👨‍🎓 Student & Institutional Information

* **Student Name**: Ilakkiyan J
* **College / Institution Name**: Karpagam College of Engineering
* **Branch / Field of Study**: Computer Science & Design
* **Mentor Name**: Manasa
* **Program**: 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship
* **Batch**: July – September 2026 Batch

---

## 🚀 Live Demo & Deployment

* **Live Demo URL**: [https://reserve-ai.vercel.app](https://reserve-ai.vercel.app) *(Deploy to Vercel to activate link)*
* **Cloud Database**: Neon Postgres (`neondb`)
* **GitHub Repository**: [https://github.com/ilakkiyan-j/ReServe-AI.git](https://github.com/ilakkiyan-j/ReServe-AI.git)

---

## 📸 Master Presentation Slide Deck (9 Slides)

<details>
<summary><b>▶️ Click here to expand & view the 9-Slide Presentation Deck</b></summary>

<br>

### 🎴 SLIDE 1: Title & Project Overview
* **Project Title**: ReServe AI — Rescue More. Waste Less.
* **Subtitle**: AI-Powered Campus Food Surplus Prevention & Intelligent Redistribution System
* **Primary Focus**: UN Sustainable Development Goal 12 (Responsible Consumption & Production)
* **Program**: 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship (July–Sep 2026)

---

### 🎴 SLIDE 2: Student & Institutional Metadata
* **Student Name**: Ilakkiyan J
* **College / University**: Karpagam College of Engineering
* **Degree & Branch**: Computer Science & Design
* **Mentor Name**: Manasa
* **Program**: 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship

---

### 🎴 SLIDE 3: Problem Statement & SDG Alignment
* **Formulated Question**: *"How might we use AI to predict cafeteria demand and match surplus event food with verified local rescue organizations so that campus food redistribution can become more sustainable, transparent, and efficient?"*
* **Primary Goal**: **SDG 12 (Responsible Consumption & Production)** — Target 12.3: Halve food waste by 2030.
* **Secondary Goals**: **SDG 2 (Zero Hunger)** & **SDG 11 (Sustainable Cities)**.

---

### 🎴 SLIDE 4: AI Solution Overview (PREVENT & RESCUE Modes)
* 🛡️ **PREVENT Mode**: Statistical demand prediction (`demandPredictionAgent.ts`) + 5% Safety Buffer prep recommendation algorithm.
* 🚚 **RESCUE Mode**: Natural language surplus text intake (`surplusExtractorAgent.ts`) + Multi-Criteria Recipient Matching (`matchingAgent.ts`).
* 💬 **RAG Assistant**: Grounded FDA Food Code safety Q&A agent (`ragAssistantAgent.ts`).

---

### 🎴 SLIDE 5: 5-Stage Design Thinking Framework
```
1. EMPATHIZE : Campus dining halls over-prepare by 15-25%; leftovers discarded.
2. DEFINE    : Lack of accurate demand prediction & real-time recipient channels.
3. IDEATE    : Dual-mode AI platform (Preventive statistical + Rescue matching).
4. PROTOTYPE : 6 Decoupled AI agents built in Next.js 14, TypeScript & Prisma.
5. TEST      : Validated against simulated campus demand & event intake.
```

---

### 🎴 SLIDE 6: AI System Architecture & Workflows
```
  Cafeteria Data --------> [Demand Prediction Agent] ------> 5% Buffer Prep Recommendation
                                                                    |
  Event Text Input -------> [NLP Surplus Extractor] -------> Structured Surplus Record
                                                                    |
  Surplus Record ---------> [Multi-Criteria Matcher] ------> Top Verified NGO Candidates
                                                                    |
  NGO Acceptance ---------> [Coordination State Machine] -> Real-time Pickup Tracking
                                                                    |
  Completed Pickup -------> [Impact Analytics Agent] ------> Live SDG 12 Metrics
```

---

### 🎴 SLIDE 7: Responsible AI & Ethical Framework
* **Fairness**: Objective 4-factor scoring matrix eliminates bias.
* **Transparency**: Human-readable 0–100 score breakdowns explaining exact match rationales.
* **Ethics**: Operates exclusively on verified organizations (`verificationStatus === "VERIFIED"`). Zero hallucinated entities.
* **Privacy & Security**: Role-based access control (RBAC) via cryptographically signed HttpOnly JWT cookies.

---

### 🎴 SLIDE 8: Expected Sustainability Impact & Benefits
* 🍲 **15,000+ Nutritious Meals Rescued** annually per university campus.
* 🌿 **6.2+ Metric Tons of CO2 Emissions Avoided** from landfill reduction ($2.50\text{ kg CO}_2 / \text{kg food}$).
* 💵 **$15,000+ Saved** in campus municipal waste hauling & disposal fees.
* 📉 **18% Reduction** in cafeteria over-preparation waste.

---

### 🎴 SLIDE 9: Conclusion & Future Outlook
* **Key Takeaway**: ReServe AI transforms campus dining from a linear waste stream into a circular, sustainable ecosystem.
* **Scalability**: A proven blueprint for universities, smart cities, and regional food banks.

</details>

---

## 📑 1M1B Internship Deliverables

This repository contains complete documentation and deliverables for the **1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship**:

| Deliverable | Description | File Link |
| :--- | :--- | :--- |
| **Deliverable 1** | Project Description, SDG Alignment, Problem Statement & Target Users | [01_project_description.md](file:///d:/Projects/1-active/ReServe%20AI/docs/deliverables/01_project_description.md) |
| **Deliverable 2** | Prototype Architecture, AI Agent Workflows, Prompt & RAG Demos | [02_prototype_and_agent_architecture.md](file:///d:/Projects/1-active/ReServe%20AI/docs/deliverables/02_prototype_and_agent_architecture.md) |
| **Deliverable 3** | Sustainability Impact Statement & Responsible AI Audit | [03_impact_statement_and_responsible_ai.md](file:///d:/Projects/1-active/ReServe%20AI/docs/deliverables/03_impact_statement_and_responsible_ai.md) |
| **Deliverable 4** | Master PPT / PDF Presentation Submission Package | [04_final_submission_package.md](file:///d:/Projects/1-active/ReServe%20AI/docs/deliverables/04_final_submission_package.md) |

---

## 🌟 Overview

**ReServe AI** is a full-stack, AI-powered food rescue and sustainability platform designed for university campuses, cafeterias, and institutional dining facilities. It tackles food waste across two complementary operational modes:

1. 🛡️ **PREVENT Mode**: Statistical demand forecasting for cafeteria dining halls to prevent over-preparation waste before food is cooked.
2. 🚚 **RESCUE Mode**: Natural language intake and multi-criteria AI recipient matching to redistribute unavoidable event leftovers to verified local NGOs and shelters.

---

## 👥 Role-Based Access Control (RBAC) & Seed Accounts

ReServe AI supports 4 role-based user personas. You can test any role instantly using the built-in Auth Modal:

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@campusfoodrescue.ai` | `password123` | Full system overview, recipient verification, impact analytics, notifications |
| **Cafeteria / Mess Manager** | `messmanager@campus.edu` | `password123` | **PREVENT Mode**: Demand forecasting, safety margin prep recommendations, MAE/RMSE evaluation |
| **Campus Event Manager** | `events@studentclub.edu` | `password123` | **RESCUE Mode**: Event registration, manual & natural language text surplus reporting |
| **Recipient Organization** | `contact@carehope.org` | `password123` | **RESCUE Mode**: Reviewing AI match proposals, ACCEPT/REJECT matches, pickup tracking |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS + Tailwind CSS (Custom Dark Mode & Glassmorphism Design System)
- **Database**: Neon Postgres (`neondb`) / SQLite (local fallback)
- **ORM**: Prisma ORM
- **Authentication**: Bcryptjs password hashing + JOSE Web Crypto JWT cookies + Next.js Edge Middleware
- **AI Modules**: Decoupled statistical regression, NLP extractor, multi-criteria matching, state machine, and keyword RAG engine

---

## ⚙️ Local Setup & Running Instructions

### 1. Prerequisites
- Node.js v18.x or later
- npm v9.x or later

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ilakkiyan-j/ReServe-AI.git
cd "ReServe AI"
npm install
```

### 3. Database Sync & Seeding (Neon Postgres)
Initialize database tables and seed demo data:
```bash
npx prisma db push
npm run db:seed
```

### 4. Running the Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
Copyright (c) 2026 ReServe AI.
