# AI Natural Language Surplus Intake Workflow — Campus Food Rescue AI

## 1. Natural Language Extraction Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User as Event / Cafeteria Manager
    participant UI as Surplus Intake UI
    participant Agent as AI Surplus Intake Agent
    participant Validator as Input Validation Engine

    User->>UI: Types: "We have ~60 veg meals left from today's hackathon at Seminar Hall. Available until 8 PM."
    UI->>Agent: Send Raw Text Payload
    Agent->>Agent: Extract Entities (quantity, food_category, location, pickup_deadline, notes)
    
    alt Complete Extraction
        Agent-->>UI: Return JSON {quantity: 60, food_category: "Vegetarian", location: "Seminar Hall", deadline: "20:00"}
    else Incomplete / Ambiguous Entities
        Agent-->>UI: Return Partial JSON with "unknown" for missing fields + Confidence Warnings
    end

    UI->>User: Display Editable Structured Form pre-filled with Extracted Data
    User->>User: Review, edit missing/incorrect values
    User->>UI: Click "Confirm & Create Surplus Request"
    UI->>Validator: Validate Schema (Zod)
    Validator-->>UI: Validation PASS
    UI->>UI: Submit Request to API & Database
```

---

## 2. Extraction Schema & Strict Safeguards

```json
{
  "quantityPortions": 60,
  "foodCategory": "VEGETARIAN",
  "location": "Seminar Hall, Ground Floor",
  "pickupDeadline": "2026-08-20T20:00:00Z",
  "notes": "Leftover from afternoon hackathon session",
  "confidenceScore": 0.92
}
```

### Strict Safeguards
1. **Never Invent Data**: If the user omits location or deadline, the agent outputs `unknown` and highlights the field in red on the preview form for mandatory user input.
2. **Never Auto-Submit**: Extracted data must ALWAYS be presented to a human user for verification before persistent storage.
