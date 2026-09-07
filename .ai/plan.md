# Campus Food Rescue AI — Complete Project Plan

## 1. Project Overview

**Project Title:** Campus Food Rescue AI  
**Primary SDG:** SDG 12 — Responsible Consumption and Production  
**Secondary SDG:** SDG 2 — Zero Hunger (where redistribution reaches appropriate community organizations)

### One-line concept

An AI-powered campus platform that predicts avoidable food surplus from messes/cafeterias and helps event organizers report unavoidable surplus, then intelligently matches available edible surplus with verified recipient organizations and coordinates redistribution.

### Core principle

The project follows two complementary modes:

1. **PREVENT** — predict food demand and reduce over-preparation.
2. **RESCUE** — when surplus already exists, help redistribute it instead of treating it as waste.

The internship guideline emphasizes real-world problem identification, responsible AI, SDG alignment, and a conceptual or working prototype rather than technology complexity for its own sake.


---

# 2. Problem Statement

## Primary Problem

College campuses can generate avoidable food surplus through cafeterias/messes and unavoidable surplus through events such as conferences, workshops, hackathons, seminars, cultural programs, department functions, and student-club activities.

There is often no centralized software workflow to:

- estimate expected meal demand,
- report surplus food,
- identify suitable verified recipients,
- coordinate pickup,
- track redistribution,
- measure sustainability impact.

## Refined Problem Statement

> **How might we use AI to predict and reduce food surplus in campus cafeterias and enable event organizers to efficiently redistribute unavoidable surplus food to verified community organizations, so that campus food waste and disposal costs are minimized?**

## Design Question

> How can AI help a campus prevent unnecessary food preparation and responsibly coordinate unavoidable edible surplus?


---

# 3. Target Users

## Primary Users

### A. Cafeteria / Mess Manager

Responsibilities:
- View predicted meal demand.
- Enter or upload historical consumption data.
- Review AI preparation recommendations.
- Report actual surplus.
- View waste and rescue statistics.

### B. Event Manager / Event Organizer

Responsibilities:
- Create an event.
- Enter expected food quantity.
- Report surplus after the event.
- Specify food type, quantity, location, and pickup deadline.
- Track the redistribution request.

### C. Campus Sustainability / Administrator

Responsibilities:
- Monitor campus-wide food surplus.
- Verify recipient organizations.
- Monitor rescue activity.
- View analytics and impact reports.
- Manage users and organizations.

### D. Verified Recipient Organization

Responsibilities:
- Maintain organization profile.
- Specify capacity and availability.
- Accept or reject suitable surplus requests.
- Confirm pickup.
- Record successful receipt.

---

# 4. Project Scope

## Included

- Campus cafeteria/mess demand prediction.
- Event surplus reporting.
- AI-based food information extraction.
- Recipient matching.
- Agentic redistribution workflow.
- Pickup coordination.
- Notifications/status tracking.
- Sustainability analytics.
- Responsible AI considerations.
- RAG-based sustainability/food-rescue information assistant.
- Prototype/demo using synthetic or sample data.

## Not Required for MVP

- IoT sensors.
- Smart bins.
- Arduino/ESP32.
- Hardware integration.
- Physical weighing systems.
- Real-time kitchen sensors.
- Autonomous vehicles.
- Complex logistics optimization.
- Actual NGO onboarding.
- Medical/food safety certification.

The first version should remain a software and AI prototype.


---

# 5. High-Level System Concept

```text
                         CAMPUS FOOD RESCUE AI
                                  |
                    +-------------+-------------+
                    |                           |
              PREVENT MODE                RESCUE MODE
                    |                           |
             Mess/Cafeteria              Events + Cafeteria
                    |                           |
             Demand Prediction             Surplus Report
                    |                           |
                    +-------------+-------------+
                                  |
                         AI Processing Layer
                                  |
              +-------------------+-------------------+
              |                   |                   |
        Prediction AI       Matching Agent       RAG Assistant
              |                   |                   |
              +-------------------+-------------------+
                                  |
                       Verified Organizations
                                  |
                       Pickup Coordination
                                  |
                         Impact Analytics
```


---

# 6. Main Feature Modules

## Module 1 — Authentication & Role Management

Roles:

- Admin
- Mess/Cafeteria Manager
- Event Manager
- Recipient Organization

Features:

- Login/signup.
- Role-based dashboard.
- Role-based permissions.
- Organization verification status.
- Basic profile management.

---

# 7. Module 2 — Campus Event Management

Event managers can create an event.

### Event fields

```text
Event Name
Organizer
Department/Club
Date
Start Time
End Time
Location
Expected Attendance
Food Provider
Expected Meals
```

### Example

```text
Event: AI Workshop
Expected Attendance: 250
Meals Prepared: 280
Location: Seminar Hall
Date: 17 Aug 2026
```

After the event, the manager can report surplus.

---

# 8. Module 3 — Surplus Food Reporting

An event manager or cafeteria manager can create a surplus request.

### Manual form

```text
Food Type
Quantity / Estimated Portions
Food Category
Preparation Time
Available Until
Pickup Location
Contact Person
Notes
```

### Example

```text
Food Type: Vegetarian Meals
Quantity: 60 portions
Available Until: 8:00 PM
Location: Seminar Hall
```

### Optional AI input

Allow the user to enter natural language:

> "We have around 60 vegetarian meals left from today's conference. They are available at the seminar hall until 8 PM."

AI extracts structured information:

```json
{
  "quantity": 60,
  "food_type": "vegetarian",
  "location": "seminar hall",
  "pickup_deadline": "8:00 PM"
}
```

This demonstrates entity extraction and conversational AI.


---

# 9. Module 4 — Food Demand Prediction

This module applies primarily to recurring cafeteria/mess operations.

## Inputs

- Historical meal consumption.
- Expected attendance.
- Day of week.
- Meal type.
- Academic calendar.
- Holidays.
- Event schedules.
- Previous surplus.
- Previous consumption.

## Output

```text
Expected attendance: 600
Predicted consumption: 520
Recommended preparation: 540
Expected surplus risk: Low
```

## MVP Approach

Start with a simple forecasting model.

Possible approaches:

- Moving average.
- Linear regression.
- Random Forest regression.
- Gradient boosting.
- Time-series forecasting.

Do not start with a complicated deep-learning model.

The goal is to demonstrate useful prediction, not model complexity.

---

# 10. Module 5 — Surplus Classification

The system classifies requests into categories such as:

```text
LOW SURPLUS
MEDIUM SURPLUS
HIGH SURPLUS
URGENT
```

Possible factors:

- Quantity.
- Time remaining.
- Pickup deadline.
- Food category.
- Recipient capacity.
- Distance.
- Availability.

Example:

```text
60 meals
Pickup deadline: 45 minutes

Risk: HIGH / URGENT
Reason:
Short redistribution window.
```

This helps the matching agent prioritize requests.


---

# 11. Module 6 — Verified Recipient Directory

The platform maintains a list of recipient organizations.

### Organization fields

```text
Organization Name
Verification Status
Service Area
Maximum Capacity
Accepted Food Categories
Pickup Availability
Contact Information
Operating Hours
```

### Important design rule

The AI must not invent recipient organizations.

Only organizations already present and marked as verified in the system should be considered for matching.


---

# 12. Module 7 — AI Matching Agent

This is the main agentic component.

## Input

```text
Surplus Request
+
Verified Organization Database
+
Capacity
+
Availability
+
Location
+
Food Category
+
Pickup Deadline
```

## Processing

The agent ranks possible recipients.

### Example

```text
Surplus:
60 vegetarian meals

Organization A
Capacity: 40
Distance: 3.2 km
Available: Yes

Organization B
Capacity: 100
Distance: 7.8 km
Available: No

Organization C
Capacity: 25
Distance: 2.1 km
Available: Yes
```

### Recommendation

```text
Best Match: Organization A

Reason:
- Accepts vegetarian meals.
- Has available capacity.
- Pickup window is compatible.
- Shorter practical distance than other available options.
```

The final decision should remain transparent and reviewable rather than pretending the AI is infallible.


---

# 13. Module 8 — Redistribution Workflow

```text
SURPLUS CREATED
       |
       v
VALIDATE REQUEST
       |
       v
CHECK TIME / QUANTITY
       |
       v
FIND VERIFIED ORGANIZATIONS
       |
       v
RANK POSSIBLE MATCHES
       |
       v
SEND REQUEST
       |
       +------> REJECTED
       |            |
       |            v
       |       TRY NEXT MATCH
       |
       v
ACCEPTED
       |
       v
PICKUP ASSIGNED
       |
       v
PICKUP CONFIRMED
       |
       v
RESCUE COMPLETED
       |
       v
IMPACT RECORDED
```

---

# 14. Module 9 — Notifications

Notifications can be generated when:

- A surplus request is created.
- A suitable recipient is found.
- A recipient accepts.
- A recipient rejects.
- Pickup deadline is approaching.
- Pickup is confirmed.
- Redistribution is completed.

Example:

> 60 vegetarian meals have been matched with a verified recipient organization. Pickup should be completed before 8:00 PM.


---

# 15. Module 10 — Pickup Coordination

For MVP, keep this simple.

The system generates a pickup task containing:

```text
Request ID
Pickup Location
Food Quantity
Food Category
Pickup Deadline
Assigned Organization
Status
```

Possible statuses:

```text
PENDING
MATCHING
MATCH_FOUND
AWAITING_ACCEPTANCE
ACCEPTED
PICKUP_ASSIGNED
PICKED_UP
COMPLETED
EXPIRED
CANCELLED
```

A real map/routing API can be added later, but it is not required for the first prototype.


---

# 16. Module 11 — Impact Dashboard

Dashboard metrics:

```text
Total surplus reported
Total meals rescued
Estimated food waste prevented
Number of participating events
Number of participating cafeterias
Number of successful redistributions
Number of verified organizations
Estimated disposal cost avoided
Estimated environmental impact
```

## Example

```text
CAMPUS FOOD RESCUE

Meals Rescued                 2,840
Surplus Requests              74
Successful Redistributions    51
Events Participated           37
Organizations Connected        8
Estimated Waste Prevented    426 kg
```

Any environmental or financial calculation should clearly be labeled as an estimate unless supported by measured data.


---

# 17. Module 12 — Sustainability RAG Assistant

Create a separate AI assistant that answers questions using a curated knowledge base.

Example questions:

- How can campuses reduce food waste?
- What should be considered before redistributing surplus food?
- What are sustainable food practices?
- What does SDG 12 mean?
- How can event organizers plan food quantities more efficiently?

## RAG pipeline

```text
User Question
      |
      v
Query Processing
      |
      v
Retrieve Relevant Documents
      |
      v
AI Model
      |
      v
Grounded Answer
      |
      v
Source / Reference
```

The assistant should distinguish between information retrieved from the knowledge base and generated recommendations.


---

# 18. Agentic AI Architecture

## Agent 1 — Demand Prediction Agent

Purpose:

> Estimate expected food demand for recurring meals.

Input:
- Historical data
- Attendance
- Calendar
- Meal type

Output:
- Predicted demand
- Recommended preparation
- Confidence/uncertainty information

---

## Agent 2 — Surplus Intake Agent

Purpose:

> Convert natural-language event/cafeteria reports into structured surplus requests.

Input:

> "We have 80 meals left from the conference."

Output:

```text
Quantity: 80
Food Category: Meal
Source: Conference
Status: Pending validation
```

---

## Agent 3 — Matching Agent

Purpose:

> Find the best verified recipient based on capacity, compatibility, availability, and practical pickup constraints.

---

## Agent 4 — Coordination Agent

Purpose:

> Generate and manage pickup notifications and status updates.

---

## Agent 5 — Impact Agent

Purpose:

> Convert completed rescue records into sustainability metrics and reports.


---

# 19. AI Architecture

```text
                   USER INPUT
                       |
        +--------------+--------------+
        |                             |
   Structured Form              Natural Language
        |                             |
        +--------------+--------------+
                       |
                 AI Processing
                       |
        +--------------+--------------+
        |              |              |
   Prediction     Extraction      Classification
        |              |              |
        +--------------+--------------+
                       |
                 Agent Workflow
                       |
        +--------------+--------------+
        |              |              |
    Matching      Coordination      Impact
        |              |              |
        +--------------+--------------+
                       |
                PostgreSQL DB
                       |
                Web Dashboard
```


---

# 20. Recommended Technology Stack

## Frontend

- Next.js / React
- TypeScript
- Tailwind CSS
- Chart library for analytics

## Backend

- Node.js
- Express.js or Next.js API routes

## Database

- PostgreSQL

## AI

Use an AI model/workflow permitted by the internship.

Potential components:

- IBM Granite
- Prompt engineering
- RAG
- Agentic workflows
- Classification
- Prediction model
- Entity extraction

## Authentication

- JWT or secure session-based authentication.

## Optional

- Map/routing API.
- Email notification service.
- PDF report generation.


---

# 21. Database Design

## users

```text
id
name
email
password_hash
role
organization_id
created_at
```

## organizations

```text
id
name
type
verification_status
service_area
capacity
accepted_food_categories
availability
contact
```

## events

```text
id
name
organizer_id
department
date
location
expected_attendance
meals_prepared
```

## surplus_requests

```text
id
source_type
source_id
food_category
quantity
available_from
pickup_deadline
location
status
created_at
```

## matches

```text
id
surplus_request_id
organization_id
match_score
match_reason
status
```

## pickups

```text
id
match_id
pickup_time
pickup_location
status
confirmed_at
```

## meal_consumption

```text
id
date
meal_type
attendance
meals_prepared
meals_consumed
surplus
```

## impact_records

```text
id
surplus_request_id
meals_rescued
estimated_weight
estimated_cost_saved
estimated_environmental_metric
created_at
```


---

# 22. Matching Score

Do not make the matching AI a black box.

Use a transparent scoring approach.

Example:

```text
Match Score =
    Capacity Compatibility
  + Food Compatibility
  + Availability
  + Pickup Deadline Compatibility
  + Distance / Travel Practicality
```

The exact weights can be configured and displayed.

Example:

```text
Organization A

Capacity compatibility     90
Food compatibility        100
Availability              100
Pickup feasibility         85
Distance                   80
--------------------------------
Overall Score               91
```

The dashboard should show why the organization was recommended.


---

# 23. Food Safety and Responsible AI

This is a critical part of the project.

The AI should NOT make unsafe claims such as:

> "This food is definitely safe to eat."

Instead:

> "The system has identified this request as potentially eligible for redistribution based on the information provided. Food safety and applicable local requirements must be verified by the responsible organization before acceptance."

## Responsible AI requirements

### Fairness

Avoid systematically prioritizing or excluding organizations based on irrelevant characteristics.

### Transparency

Explain:
- Why a demand prediction was produced.
- Why a recipient was recommended.
- Which factors affected a match.

### Ethics

The system must not encourage unsafe redistribution merely to improve sustainability statistics.

### Privacy

Avoid collecting unnecessary personal or sensitive information.

### Human Oversight

Important decisions should remain reviewable by responsible campus staff/organizations.


---

# 24. Data Strategy

For the prototype, use:

### Option A — Synthetic Dataset

Create realistic sample records for:

- Attendance
- Meals prepared
- Meals consumed
- Events
- Surplus
- Recipient capacity

Clearly label the dataset as synthetic.

### Option B — Small Pilot Dataset

If the college provides data, use aggregated information.

Do not collect unnecessary personal information.

### Example dataset

```text
date,meal,attendance,prepared,consumed,surplus
2026-08-01,lunch,520,550,510,40
2026-08-02,lunch,580,620,570,50
2026-08-03,lunch,490,520,480,40
```

---

# 25. MVP

The first working prototype should contain only the most important functionality.

## MVP Features

- Login.
- Role-based dashboard.
- Event creation.
- Surplus reporting.
- Cafeteria consumption dataset.
- Basic demand prediction.
- Verified organization database.
- AI recipient matching.
- Pickup status.
- Impact dashboard.

## MVP Flow

```text
Event Manager
     |
Create Event
     |
Report Surplus
     |
AI extracts/validates information
     |
Matching Agent
     |
Verified Recipient
     |
Accept
     |
Pickup
     |
Completed
     |
Impact Dashboard
```


---

# 26. Phase 2 Features

After MVP:

- RAG sustainability assistant.
- Natural-language surplus reporting.
- Image-based food information extraction.
- Automated notifications.
- Better prediction model.
- Event food planning recommendations.
- AI-generated sustainability reports.


---

# 27. Phase 3 Features

Optional advanced features:

- Route optimization.
- Multi-recipient matching.
- Demand forecasting by food item.
- Campus-wide waste trends.
- Event sustainability score.
- Recommendation engine for event organizers.
- What-if simulation.

Example:

> "If expected attendance is 500, how much food should we prepare to keep expected surplus below 5%?"


---

# 28. Event Manager Experience

This should be one of the strongest parts of the demo.

## Before Event

AI asks:

```text
Expected attendance?
Event duration?
Meal type?
Previous similar event?
```

Then:

```text
Recommended preparation:
520 meals

Expected demand:
495–510 meals

Surplus risk:
LOW
```

## During/After Event

Organizer enters:

```text
Remaining food:
65 meals
```

## AI

```text
Surplus detected.

Potential verified matches:
1. Organization A
2. Organization C
```

## After Pickup

Organizer sees:

```text
RESCUE COMPLETED

65 meals redirected
0 disposal required

Event contribution:
Food Waste Prevention
+65 meals rescued
```


---

# 29. Cafeteria/Mess Experience

## Morning

```text
TODAY'S DEMAND FORECAST

Expected attendance: 620
Predicted meals: 575
Recommended preparation: 595

Surplus risk: LOW
```

## Evening

Manager enters actual consumption:

```text
Prepared: 595
Consumed: 570
Surplus: 25
```

The system stores this information and improves future predictions.


---

# 30. Admin Dashboard

```text
CAMPUS SUSTAINABILITY

Today's Status
-------------------------
Meals Prepared       1,240
Meals Rescued          180
Surplus               210
Successful Matches      12

This Month
-------------------------
Events                  37
Requests                74
Rescues                 51
Organizations            8
```

Charts:

- Food surplus by day.
- Surplus by event.
- Surplus by cafeteria.
- Successful rescue percentage.
- Monthly trend.
- Prediction vs actual consumption.


---

# 31. API Design

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Events

```text
POST /api/events
GET  /api/events
GET  /api/events/:id
PUT  /api/events/:id
```

## Surplus

```text
POST /api/surplus
GET  /api/surplus
GET  /api/surplus/:id
PATCH /api/surplus/:id/status
```

## Organizations

```text
GET  /api/organizations
POST /api/organizations
PATCH /api/organizations/:id/verify
```

## Matching

```text
POST /api/matching/:surplusId
GET  /api/matching/:surplusId
POST /api/matching/:matchId/accept
POST /api/matching/:matchId/reject
```

## Pickup

```text
POST /api/pickups
PATCH /api/pickups/:id/status
```

## Analytics

```text
GET /api/analytics/overview
GET /api/analytics/events
GET /api/analytics/surplus
GET /api/analytics/impact
```

## Prediction

```text
POST /api/prediction/demand
GET /api/prediction/history
```


---

# 32. Frontend Pages

```text
/login

/dashboard

/events
/events/create
/events/:id

/surplus
/surplus/create
/surplus/:id

/organizations
/organizations/:id

/matches
/pickups

/predictions

/analytics

/ai-assistant

/settings
```

## Dashboards

### Admin

Overview + analytics + organizations + requests.

### Event Manager

Events + surplus + matches + pickup status.

### Cafeteria Manager

Forecast + preparation recommendation + surplus.

### Recipient Organization

Available requests + accepted requests + pickup tasks.


---

# 33. UI Design Direction

Use a clean sustainability-focused interface.

### Main dashboard cards

```text
Meals Rescued
Surplus Prevented
Active Requests
Successful Matches
```

### Status indicators

```text
LOW RISK
MODERATE
URGENT
MATCHED
PICKUP PENDING
COMPLETED
```

Use clear icons and accessible text rather than relying only on color.


---

# 34. AI Prompt Structure

## Surplus Extraction Prompt

The model should receive:

```text
Extract only the following fields:
- quantity
- food category
- source
- location
- availability deadline

Do not invent missing values.
Return unknown when information is not provided.
```

## Matching Prompt

```text
You are a food redistribution matching assistant.

Only recommend organizations from the supplied verified organization list.

Consider:
1. Food compatibility
2. Capacity
3. Availability
4. Pickup deadline
5. Practical travel distance

Explain the recommendation.

Never invent organizations or facts.
```

## Impact Prompt

```text
Generate a concise sustainability summary using only
the provided completed redistribution records.

Clearly distinguish measured values from estimates.
Do not invent environmental benefits.
```


---

# 35. Prediction Evaluation

The demand model should be evaluated using historical/synthetic test data.

Possible metrics:

- MAE
- RMSE
- MAPE

Example:

```text
Predicted: 520
Actual:    510

Absolute Error: 10
```

For the presentation, show:

```text
Prediction vs Actual

Predicted     520
Actual        510
Error          10
```

Avoid claiming the model is production-ready from a small synthetic dataset.


---

# 36. Agent Evaluation

Measure:

### Matching accuracy

How often the top recommendation is acceptable.

### Invalid recommendation rate

The agent should never recommend an unverified organization.

### Explanation quality

Can a user understand why the match was selected?

### Workflow completion

How many simulated requests successfully move through:

```text
Created → Matched → Accepted → Pickup → Completed
```


---

# 37. Key Demo Scenario

Use one complete story in the final presentation.

## Scenario

A college hosts an AI workshop.

```text
Expected attendance: 250
Meals prepared: 280
Meals consumed: 215
Surplus: 65
```

Event manager opens the platform.

### Step 1

Reports:

> "65 vegetarian meals are available at Seminar Hall until 8 PM."

### Step 2

AI extracts:

```text
65 meals
Vegetarian
Seminar Hall
8 PM deadline
```

### Step 3

Matching agent searches verified organizations.

### Step 4

AI recommends the best available match.

### Step 5

Recipient accepts.

### Step 6

Pickup task is generated.

### Step 7

Pickup is confirmed.

### Step 8

Dashboard updates:

```text
65 meals rescued
1 event contribution
1 successful redistribution
```

This single scenario demonstrates most of the system.


---

# 38. Second Demo Scenario — Prevention

Cafeteria manager views tomorrow's forecast.

```text
Expected attendance: 600
Predicted consumption: 545
Recommended preparation: 565
```

The system explains:

> Historical Tuesday consumption is lower than the weekly average. The recommendation includes a buffer to reduce the risk of shortage while limiting expected surplus.

Then compare:

```text
Without AI:
600 meals prepared

With AI:
565 meals recommended
```

The presentation should describe this as a modelled/prototype scenario unless supported by real campus data.


---

# 39. Project Impact

## Environmental

Potentially reduce unnecessary food disposal.

## Social

Help connect suitable edible surplus with verified community organizations.

## Economic

Potentially reduce food procurement and disposal inefficiencies.

## Operational

Provide event managers and cafeteria staff with a centralized workflow.

## Educational

Demonstrate responsible application of AI to a sustainability problem.


---

# 40. Success Metrics

Use measurable prototype metrics.

### Operational

- Number of surplus requests processed.
- Matching completion rate.
- Pickup completion rate.
- Average matching time.

### Prediction

- MAE.
- RMSE.
- Prediction error.

### Sustainability

- Meals rescued.
- Estimated food weight redirected.
- Estimated disposal reduction.
- Number of participating events.

### AI Quality

- Extraction accuracy.
- Invalid recommendation rate.
- Match acceptance rate.


---

# 41. Limitations

Clearly state:

- Prototype may use synthetic data.
- Demand forecasts depend on data quality.
- Food quantities may be estimates.
- Recipient availability may change.
- Actual redistribution requires responsible human verification.
- Environmental impact calculations are estimates unless validated.
- Real deployment requires appropriate institutional, legal, food-safety, and organizational processes.

Being transparent about limitations strengthens the responsible-AI section.


---

# 42. Responsible AI Checklist

- [ ] Explain AI recommendations.
- [ ] Do not invent organizations.
- [ ] Do not invent quantities.
- [ ] Mark uncertain values.
- [ ] Protect user information.
- [ ] Avoid unnecessary personal data.
- [ ] Keep human oversight.
- [ ] Do not make definitive food-safety claims.
- [ ] Distinguish estimates from measured values.
- [ ] Test matching for unfair bias.
- [ ] Provide fallback/manual workflow if AI fails.


---

# 43. Development Roadmap

## Phase 1 — Problem Definition

- Finalize problem statement.
- Finalize SDG alignment.
- Identify user roles.
- Define project scope.
- Define success metrics.

## Phase 2 — UX & Architecture

- Create user flows.
- Create wireframes.
- Design database.
- Design system architecture.
- Define AI workflows.

## Phase 3 — Backend Foundation

- Create project.
- Configure PostgreSQL.
- Implement authentication.
- Implement roles.
- Implement event APIs.
- Implement surplus APIs.

## Phase 4 — Frontend Foundation

- Build login.
- Build dashboard.
- Build event management.
- Build surplus reporting.
- Build organization management.

## Phase 5 — Prediction

- Create dataset.
- Build baseline model.
- Train/test model.
- Add prediction API.
- Display forecast.

## Phase 6 — AI Extraction

- Create natural-language input.
- Implement entity extraction.
- Validate structured data.
- Handle missing values.

## Phase 7 — Matching Agent

- Implement organization filtering.
- Implement transparent scoring.
- Implement AI explanation.
- Add accept/reject workflow.

## Phase 8 — Pickup Workflow

- Implement pickup creation.
- Implement status tracking.
- Implement notifications.
- Implement completion confirmation.

## Phase 9 — Analytics

- Build sustainability dashboard.
- Add prediction vs actual charts.
- Add rescue statistics.
- Add impact calculations.

## Phase 10 — RAG Assistant

- Prepare trusted knowledge base.
- Build retrieval pipeline.
- Connect AI model.
- Display grounded answers.

## Phase 11 — Responsible AI

- Test hallucinations.
- Test invalid organizations.
- Test missing data.
- Test biased matching scenarios.
- Add warnings and human review.

## Phase 12 — Final Prototype

- Fix UI.
- Test complete workflows.
- Prepare demo data.
- Capture screenshots.
- Prepare architecture diagrams.
- Prepare final PPT/PDF.


---

# 44. Suggested GitHub Structure

```text
campus-food-rescue-ai/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── ai/
│   ├── prompts/
│   ├── prediction/
│   ├── matching/
│   ├── extraction/
│   └── rag/
│
├── database/
│   ├── schema/
│   ├── migrations/
│   └── seed/
│
├── data/
│   ├── synthetic/
│   └── evaluation/
│
├── docs/
│   ├── architecture/
│   ├── diagrams/
│   └── responsible-ai/
│
├── README.md
└── plan.md
```


---

# 45. Architecture Diagram for Final Presentation

Use this simplified diagram:

```text
                   CAMPUS FOOD RESCUE AI

   +----------------+       +--------------------+
   | Event Manager  |       | Cafeteria Manager  |
   +-------+--------+       +---------+----------+
           |                          |
           | Surplus                  | Consumption
           |                          |
           +------------+-------------+
                        |
                        v
               +------------------+
               | AI Processing    |
               |------------------|
               | Prediction       |
               | Extraction       |
               | Classification   |
               +--------+---------+
                        |
                        v
               +------------------+
               | AI Agent Layer   |
               |------------------|
               | Matching Agent   |
               | Coordination     |
               | Impact Agent     |
               +--------+---------+
                        |
                        v
               +------------------+
               | Verified Org DB  |
               +--------+---------+
                        |
                        v
               +------------------+
               | Pickup Workflow  |
               +--------+---------+
                        |
                        v
               +------------------+
               | Impact Dashboard |
               +------------------+
```


---

# 46. Final Presentation Structure

The internship guideline requires the final PPT/PDF to cover project description, SDG alignment, problem statement, AI solution, target users, responsible AI, expected impact, and a prototype/demo. 

Recommended slide structure:

## Slide 1 — Title

**Campus Food Rescue AI**

AI-powered food surplus prevention and redistribution platform.

Name  
College  
Internship

## Slide 2 — Problem

Show:

```text
Food Prepared
      ↓
Food Consumed
      ↓
Surplus
      ↓
Often Disposed
```

## Slide 3 — Why It Matters

Explain:

- Campus cafeterias.
- Events.
- Clubs.
- Conferences.
- Unavoidable surplus.

## Slide 4 — SDG Alignment

Primary:

**SDG 12 — Responsible Consumption and Production**

Secondary:

**SDG 2 — Zero Hunger**

## Slide 5 — Proposed Solution

Show:

```text
Prevent → Report → Match → Pickup → Measure
```

## Slide 6 — User Roles

- Event Manager
- Cafeteria Manager
- Recipient Organization
- Admin

## Slide 7 — AI Architecture

Show prediction + extraction + matching + coordination.

## Slide 8 — Event Manager Workflow

Demonstrate surplus reporting.

## Slide 9 — AI Matching

Show verified organization ranking.

## Slide 10 — Cafeteria Prediction

Show predicted vs actual demand.

## Slide 11 — Dashboard

Show rescued meals and impact.

## Slide 12 — Responsible AI

- Fairness
- Transparency
- Ethics
- Privacy
- Human oversight

## Slide 13 — Expected Impact

Environmental + social + operational impact.

## Slide 14 — Prototype Demo

Show the complete event scenario.

## Slide 15 — Future Scope

- More campuses.
- Better forecasting.
- Routing.
- More organizations.
- Integration with campus systems.


---

# 47. Final Demo Checklist

- [ ] Login works.
- [ ] Event Manager dashboard works.
- [ ] Event creation works.
- [ ] Surplus submission works.
- [ ] Natural-language extraction works.
- [ ] Cafeteria prediction works.
- [ ] Verified organizations are available.
- [ ] Matching agent works.
- [ ] Match explanation is visible.
- [ ] Accept/reject works.
- [ ] Pickup status works.
- [ ] Completion works.
- [ ] Impact dashboard updates.
- [ ] RAG assistant answers from the knowledge base.
- [ ] Responsible AI warnings are visible.
- [ ] Synthetic data is clearly identified.
- [ ] Demo scenario is prepared.
- [ ] PPT/PDF is prepared.


---

# 48. Recommended MVP Priority

If time becomes limited, build in this order:

### MUST HAVE

1. Event manager.
2. Surplus reporting.
3. Verified organization database.
4. AI matching.
5. Pickup workflow.
6. Impact dashboard.

### SHOULD HAVE

7. Cafeteria demand prediction.
8. Natural-language surplus extraction.
9. Notifications.

### NICE TO HAVE

10. RAG assistant.
11. Image input.
12. Route optimization.
13. Advanced forecasting.
14. What-if simulation.


---

# 49. What NOT to Build

Avoid unnecessary complexity.

Do not start with:

- IoT.
- Hardware.
- Sensors.
- Mobile app.
- Microservices.
- Kubernetes.
- Complex deep-learning architectures.
- Autonomous delivery.
- Blockchain.
- Real-time GPS tracking.

A polished web prototype with a strong AI workflow is more valuable for this internship than a technically huge but unfinished system.


---

# 50. Final Project Definition

## Project Name

**Campus Food Rescue AI**

## Primary SDG

**SDG 12 — Responsible Consumption and Production**

## Core Problem

Food surplus occurs through both recurring cafeteria operations and one-time campus events, while there may be no centralized system to prevent unnecessary preparation or efficiently coordinate redistribution.

## Core Solution

A software-based AI platform that:

1. Predicts cafeteria meal demand.
2. Allows event managers to report surplus.
3. Converts natural-language reports into structured data.
4. Matches surplus with verified recipient organizations.
5. Coordinates pickup.
6. Tracks completed redistribution.
7. Measures estimated sustainability impact.
8. Provides a RAG-based sustainability assistant.

## Core AI Components

```text
Demand Prediction
+
Entity Extraction
+
Classification
+
Agentic Matching
+
RAG
+
Impact Analysis
```

## Core User Journey

```text
                    FOOD SOURCE
                         |
          +--------------+--------------+
          |                             |
       CAFETERIA                      EVENT
          |                             |
    Predict demand                Report surplus
          |                             |
          +--------------+--------------+
                         |
                    AI PLATFORM
                         |
                  Verify / Validate
                         |
                  Matching Agent
                         |
                Verified Recipient
                         |
                  Pickup Workflow
                         |
                    Completed
                         |
                  Impact Dashboard
```

## Final Goal

> **Use AI not merely to identify food waste, but to help a campus prevent avoidable surplus and responsibly redirect unavoidable edible surplus.**

This keeps the project focused on the internship's central principles: **problem solving, meaningful AI use, SDG alignment, responsible AI, and measurable real-world impact.**
