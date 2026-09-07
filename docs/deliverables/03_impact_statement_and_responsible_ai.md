# 1M1B AI for Sustainability Virtual Internship
## Deliverable 3: Impact Statement & Responsible AI Evaluation

> **Program**: 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship  
> **In Collaboration with**: IBM SkillsBuild & AICTE  
> **Project**: ReServe AI — Campus Food Surplus Prevention & Intelligent Redistribution Platform  

---

## 🎯 1. Impact Statement: What Changes with ReServe AI?

### 1.1 The Baseline (Before ReServe AI)
* **Unpredictable Cafeteria Preparation**: Mess managers rely on static manual guesses, over-preparing by 15–25% daily to prevent food shortages.
* **Wasted Leftovers**: Event leftovers end up in dumpster bins within 2–3 hours due to lack of immediate contact channels with local shelters.
* **Zero Metrics**: University sustainability offices have no data on campus food waste, CO2 emissions, or financial loss.

### 1.2 The Transformation (With ReServe AI)

```
 BEFORE (Traditional Campus)               AFTER (ReServe AI Powered Campus)
 ---------------------------               ---------------------------------
 [Manual Guessing]                        [Demand Forecasting Agent]
        |                                                |
        v                                                v
 [15-25% Over-Cooking]                    [5% Controlled Safety Buffer]
        |                                                |
        v                                                v
 [Event Leftovers -> Trash Bin]           [NLP Intake & Multi-Factor Matching]
        |                                                |
        v                                                v
 [Landfill Waste & CO2 Damage]            [Food Delivered to Local Shelters]
```

---

## 📊 2. Quantified Impact Model

### 2.1 Environmental Impact
- **Methane & CO2 Avoidance**: Food waste decomposing in municipal landfills is a major source of methane ($\text{CH}_4$). Every 1 kg of food rescued prevents **2.50 kg of CO2 equivalent emissions**.
- **Water & Resource Preservation**: Rescuing 15,000 meals annually saves an estimated **7.5 million liters of embedded agricultural water**.

### 2.2 Social Impact
- **Nutritious Meals Provided**: Redistributes fresh, unconsumed campus meals directly to vulnerable community members, low-income students, and local shelters.
- **Dignified Community Support**: Provides structured, predictable food deliveries to recipient organizations instead of ad-hoc donations.

### 2.3 Economic Impact
- **Campus Disposal Savings**: Reduces municipal solid waste (MSW) hauling and incineration tipping fees by **$2.50 per kg of waste avoided**.
- **Procurement Efficiency**: Saves dining services 10–15% in raw ingredient purchasing costs through demand prediction.

---

## 👥 3. Stakeholder Benefit Matrix

| Stakeholder Group | Immediate Benefit | Long-Term Value |
| :--- | :--- | :--- |
| **University & Administration** | Compliance with institutional SDG sustainability targets | Reduced waste management costs & enhanced green reputation |
| **Cafeteria Operators** | Optimized daily prep schedules & automated MAE tracking | Lower food procurement expenditures & stress reduction |
| **Campus Event Organizers** | 30-second leftover reporting via natural language text | Zero guilt over discarded event catering |
| **Recipient NGOs & Shelters** | Real-time notifications of fresh food within 2–5 km | Increased meal volume with zero procurement cost |
| **Local Community & Climate** | Reduced landfill burden & lower greenhouse gas footprint | Healthier local urban ecosystem |

---

## ⚖️ 4. Responsible AI Principles & Ethical Audit

ReServe AI was audited against the **IBM Responsible AI Framework**:

```
+-----------------------------------------------------------------------------------+
|                            RESPONSIBLE AI CORE PILLARS                            |
+-----------------------------------------------------------------------------------+
|  1. FAIRNESS       - Objective multi-criteria recipient scoring matrix           |
|  2. TRANSPARENCY   - Human-readable 0-100 score breakdown rationales              |
|  3. ETHICS         - Strict verified DB boundary & human-in-the-loop validation  |
|  4. PRIVACY        - Role-based HttpOnly JWT authentication & access boundaries   |
+-----------------------------------------------------------------------------------+
```

### 4.1 Pillar 1: Fairness
* **Risk**: AI algorithms favoring larger or wealthier NGOs over smaller community shelters.
* **Mitigation**: Scoring uses strict mathematical criteria (Proximity 30%, Capacity 30%, Deadline 20%, Reliability 20%). Distance and capacity scores are computed objectively without organizational bias.

### 4.2 Pillar 2: Transparency & Explainability
* **Risk**: Black-box matching decisions leaving NGOs and event managers confused.
* **Mitigation**: Every match proposal presents a step-by-step breakdown explaining why the recipient received its score (e.g., *"Score 92/100: Capacity 100%, Distance 1.8km (98%), Deadline 45m remaining (85%), Reliability 95%"*).

### 4.3 Pillar 3: Ethics & Safety Safeguards
* **Risk**: Hallucinated entity data or unsafe food distribution.
* **Mitigation**:
  * **Verified Organization Boundary**: The AI matching engine operates strictly on database entities where `verificationStatus === "VERIFIED"`. It cannot send alerts to unverified third parties.
  * **Human-in-the-Loop**: All NLP-extracted surplus reports require explicit human review and confirmation before database commit.
  * **FDA 4-Hour Rule Guardrail**: RAG assistant enforces safe handling guidelines (holding temperatures $\ge 135^\circ\text{F}$ or $\le 41^\circ\text{F}$, maximum 4-hour room temperature window).

### 4.4 Pillar 4: Privacy & Data Protection
* **Risk**: Unauthorized access to contact phone numbers or location data.
* **Mitigation**: Implements Next.js Edge Middleware for Role-Based Access Control (RBAC). Sensitive endpoints require cryptographically verified HttpOnly JWT tokens.

---

*Submitted as part of the 1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship July-Sep 2026.*
