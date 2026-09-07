# 1M1B AI for Sustainability Virtual Internship
# Master Submission Package (PPT / PDF Format)

> **In Collaboration with**: IBM SkillsBuild & AICTE  
> **Project Name**: ReServe AI — Campus Food Surplus Prevention & Intelligent Redistribution Platform  
> **Primary SDG**: SDG 12: Responsible Consumption and Production  
> **Secondary SDGs**: SDG 2: Zero Hunger | SDG 11: Sustainable Cities and Communities  

---

## 🎴 SLIDE 1: Title & Project Overview

* **Project Title**: ReServe AI — Rescue More. Waste Less.
* **Subtitle**: AI-Powered Campus Food Surplus Prevention & Intelligent Redistribution System
* **Primary SDG Focus**: SDG 12 (Responsible Consumption & Production)
* **Program**: 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship (July–Sep 2026)

---

## 🎴 SLIDE 2: Student & Institutional Information

* **Student Name**: Ilakkiyan J
* **College / University**: Karpagam College of Engineering
* **Degree & Branch**: Computer Science & Design
* **Mentor Name**: Manasa
* **Program**: 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship
* **Batch**: July – September 2026 Batch

---

## 🎴 SLIDE 3: Problem Statement & SDG Alignment

### Problem Statement
> *"How might we use AI to predict cafeteria demand and match surplus event food with verified local rescue organizations so that campus food redistribution can become more sustainable, transparent, and efficient?"*

### UN Sustainable Development Goals (SDGs)
* **Primary: SDG 12 (Responsible Consumption & Production)** — Target 12.3: Halve global per capita food waste by 2030.
* **Secondary: SDG 2 (Zero Hunger)** — Target 2.1: Universal access to safe, nutritious, sufficient food.
* **Secondary: SDG 11 (Sustainable Cities)** — Target 11.6: Reduce urban environmental impact and landfill emissions.

---

## 🎴 SLIDE 4: AI Solution Overview (PREVENT & RESCUE Modes)

ReServe AI operates via a dual-mode AI framework:

1. 🛡️ **PREVENT Mode (Demand Forecasting)**
   - Statistical demand prediction agent (`demandPredictionAgent.ts`)
   - 5% Safety Buffer prep recommendation algorithm ($\text{Prep} = \lceil \text{Predicted} \times 1.05 \rceil$)
   - Automated MAE / RMSE prediction accuracy evaluation against actual consumption

2. 🚚 **RESCUE Mode (Intake & Matching)**
   - NLP Natural Language Surplus Intake Extractor (`surplusExtractorAgent.ts`)
   - Multi-Criteria Recipient Matching Engine (`matchingAgent.ts`): Capacity (30%), Proximity (30%), Deadline (20%), Reliability (20%)
   - Pickup Coordination State Machine (`coordinationAgent.ts`)
   - Grounded RAG Food Safety Assistant (`ragAssistantAgent.ts`)

---

## 🎴 SLIDE 5: 5-Stage Design Thinking Methodology

```
+-----------------------------------------------------------------------------------+
|  1. EMPATHIZE : Campus dining halls over-prepare by 15-25%; leftovers discarded.  |
|  2. DEFINE    : Lack of accurate demand prediction & real-time recipient channels.|
|  3. IDEATE    : Dual-mode AI platform (Preventive statistical + Rescue matching). |
|  4. PROTOTYPE : 6 Decoupled AI agents built in Next.js 14, TypeScript & Prisma.  |
|  5. TEST      : Validated against simulated campus demand & event intake.         |
+-----------------------------------------------------------------------------------+
```

---

## 🎴 SLIDE 6: AI System Architecture & Workflows

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

## 🎴 SLIDE 7: Responsible AI Considerations & Risk Mitigation

* **Fairness**: Objective 4-factor scoring matrix eliminates bias toward specific recipient NGOs.
* **Transparency**: Human-readable 0–100 score breakdowns explaining exact match rationales.
* **Ethics**: Operates exclusively on verified organizations (`verificationStatus === "VERIFIED"`). Zero hallucinated entities.
* **Safety & Privacy**: Human-in-the-loop preview screens and HttpOnly JWT role-based access control.

---

## 🎴 SLIDE 8: Expected Sustainability Impact & Benefits

* 🍲 **15,000+ Nutritious Meals Rescued** annually per university campus.
* 🌿 **6.2+ Metric Tons of CO2 Emissions Avoided** from landfill reduction ($2.50\text{ kg CO}_2 / \text{kg food}$).
* 💵 **$15,000+ Saved** in campus municipal waste hauling & disposal fees.
* 📉 **18% Reduction** in cafeteria over-preparation waste.

---

## 🎴 SLIDE 9: Conclusion & Future Outlook

ReServe AI transforms campus dining from a linear waste stream into a circular, sustainable ecosystem.

* **Key Takeaways**:
  1. Proactive waste prevention via statistical demand forecasting.
  2. Real-time community food rescue grounded in Responsible AI guidelines.
  3. Scalable blueprint for universities, cities, and regional food recovery networks.
* **GitHub Repository**: [ReServe AI Workspace](file:///d:/Projects/1-active/ReServe%20AI)
* **Deliverables Directory**: [docs/deliverables/](file:///d:/Projects/1-active/ReServe%20AI/docs/deliverables)

*Submitted in partial fulfillment of the 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship July-Sep 2026.*
