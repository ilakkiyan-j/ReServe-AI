# 1M1B AI for Sustainability Virtual Internship
## Deliverable 1: Project Description

> **Program**: 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship  
> **In Collaboration with**: IBM SkillsBuild & AICTE  
> **Project Name**: ReServe AI — Campus Food Surplus Prevention & Intelligent Redistribution Platform  
> **Primary SDG**: SDG 12: Responsible Consumption and Production  
> **Secondary SDGs**: SDG 2: Zero Hunger | SDG 11: Sustainable Cities and Communities  

---

## 👨‍🎓 Student & Institutional Information

* **Student Name**: Ilakkiyan J
* **College / Institution Name**: Karpagam College of Engineering
* **Branch / Field of Study**: Computer Science & Design
* **Internship Batch**: July – September 2026 Batch
* **Mentor Name**: Manasa

---

## 🎯 1. Problem Statement

### 1.1 Context & Background
University campuses operate large-scale dining halls, cafeterias, and event venues daily. However, campus food systems face two severe, interconnected sustainability challenges:

1. **Over-Preparation in Cafeterias**: Dining halls cook large buffer volumes to prevent running out during peak student meal hours, generating hundreds of unused meals daily.
2. **Leftover Destruction from Campus Events**: Workshops, club events, and conferences frequently order catered meals. Remaining food is often thrown away due to lack of immediate redistribution channels and logistics coordination.

At the same time, local shelters, community kitchens, and student food pantries within a 5-10 km radius of university campuses struggle with food insecurity.

### 1.2 Formulated Problem Statement
> **"How might we use AI to predict cafeteria demand and match surplus event food with verified local rescue organizations so that campus food redistribution can become more sustainable, transparent, and efficient?"**

---

## 🌍 2. Alignment with UN Sustainable Development Goals (SDGs)

ReServe AI directly addresses three United Nations Sustainable Development Goals:

```
+-----------------------------------------------------------------------------------+
|  PRIMARY FOCUS                                                                    |
|  [SDG 12] Responsible Consumption & Production                                     |
|  - Target 12.3: Halve global per capita food waste by 2030 and reduce food losses. |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|  SECONDARY IMPACTS                                                                |
|  [SDG 2] Zero Hunger                                                              |
|  - Target 2.1: Ensure universal access to safe, nutritious, sufficient food.      |
|                                                                                   |
|  [SDG 11] Sustainable Cities & Communities                                        |
|  - Target 11.6: Reduce urban environmental impact and municipal waste streams.    |
+-----------------------------------------------------------------------------------+
```

---

## 🤖 3. AI Solution Overview

ReServe AI addresses food waste through a dual-mode operational architecture:

```
                       +----------------------------------------+
                       |               ReServe AI               |
                       +----------------------------------------+
                                           |
                  +------------------------+------------------------+
                  |                                                 |
                  v                                                 v
      +-----------------------+                         +-----------------------+
      |     PREVENT Mode      |                         |      RESCUE Mode      |
      | (Demand Forecasting)  |                         |  (Surplus Matching)   |
      +-----------------------+                         +-----------------------+
      | - Statistical AI      |                         | - NLP Intake Extractor|
      | - 5% Safety Buffer    |                         | - Multi-Factor Matcher|
      | - MAE/RMSE Evaluation |                         | - Grounded RAG Engine |
      +-----------------------+                         +-----------------------+
```

### 3.1 PREVENT Mode (Over-Cooking Reduction)
* **Demand Prediction Agent (`demandPredictionAgent.ts`)**: Analyzes meal types (Breakfast, Lunch, Dinner), scheduled student headcount, day of week, and academic calendar status (`REGULAR_CLASS`, `REGULAR_EXAM`, `HOLIDAY`).
* **Optimized Preparation Recommendation**: Computes recommended prep quantities with a strict **5% safety margin** to prevent food shortage while eliminating excess waste.
* **Accuracy Feedback Loop**: Measures Mean Absolute Error (MAE) and RMSE against actual consumption data to refine forecasts over time.

### 3.2 RESCUE Mode (Leftover Redistribution)
* **Natural Language Surplus Intake (`surplusExtractorAgent.ts`)**: Enables event managers to type or dictate unformatted leftover notices (e.g., *"60 veg meal boxes remaining at Seminar Hall until 8 PM"*). The NLP agent extracts meal count, food type, location, and deadline.
* **Multi-Criteria Recipient Matching (`matchingAgent.ts`)**: Evaluates surplus requests against verified local recipient organizations using a weighted 4-factor matrix:
  1. **Capacity Match (30%)**: Matches food quantity against org recipient capacity.
  2. **Proximity Score (30%)**: Uses Haversine distance scoring between donor and recipient.
  3. **Deadline Alignment (20%)**: Ensures pickup can be completed before food expires.
  4. **Historical Reliability (20%)**: Factors in past completed pickup task rate.
* **State-Machine Pickup Coordination (`coordinationAgent.ts`)**: Tracks pickup progress (`ASSIGNED` -> `IN_TRANSIT` -> `ARRIVED` -> `COMPLETED`) with automated status updates.
* **Food Safety RAG Assistant (`ragAssistantAgent.ts`)**: Answers food handling questions using Retrieval-Augmented Generation grounded in official FDA food safety guidelines (4-Hour Rule, holding temperatures).

---

## 👥 4. Target Users & Beneficiaries

| User Persona | Role | Primary Needs | System Feature Used |
| :--- | :--- | :--- | :--- |
| **Mess / Cafeteria Manager** | Campus Dining Operator | Accurate daily preparation counts, zero food shortage risk | **PREVENT Mode**: Demand forecasting & MAE tracking |
| **Campus Event Coordinator** | Student Club / Faculty Organizer | Quick, zero-friction reporting of leftover food from events | **RESCUE Mode**: Natural Language Surplus Intake |
| **Recipient Organization** | Local NGO, Shelter, Pantry Manager | Immediate alerts for nearby fresh surplus food | **RESCUE Mode**: AI Match Proposals & Pickup Tracker |
| **System Administrator** | University Sustainability Officer | Compliance tracking, NGO verification, impact analytics | **Admin Dashboard**: Live SDG metrics & notifications |

---

## ⚖️ 5. Responsible AI Considerations

ReServe AI is built on the **IBM Responsible AI Framework**:

1. **Fairness**: Recipient matching uses objective, deterministic scoring (proximity, capacity, deadline, reliability) to prevent bias or favoritism toward specific organizations.
2. **Transparency & Explainability**: Every match proposal displays a 0–100 score along with a human-readable factor breakdown explaining why the recipient was chosen.
3. **Ethics & Safety Boundaries**:
   * **Zero Hallucinated Recipients**: Matching operates exclusively on verified organizations (`verificationStatus === "VERIFIED"`).
   * **Human-in-the-Loop Verification**: Extracted surplus details are displayed in an editable preview screen requiring explicit user confirmation before saving to the database.
4. **Privacy & Security**: Enforces Role-Based Access Control (RBAC) via cryptographically signed HttpOnly JWT cookies. Personal contact details are protected behind authorized role permissions.

---

## 📊 6. Expected Sustainability Impact

```
+-----------------------------------------------------------------------------------+
|                            EXPECTED ANNUAL CAMPUS IMPACT                          |
+-----------------------------------------------------------------------------------+
|  [SOCIAL]         15,000+ Nutritious Meals Rescued & Redistributed                |
|  [ENVIRONMENTAL]  6.2+ Metric Tons of CO2 Emissions Avoided                        |
|  [ECONOMIC]       $15,000+ Saved in Waste Disposal & Municipal Hauling Fees       |
|  [OPERATIONAL]    18% Average Reduction in Cafeteria Over-Preparation Waste       |
+-----------------------------------------------------------------------------------+
```

---

*Submitted as part of the 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship July-Sep 2026.*
