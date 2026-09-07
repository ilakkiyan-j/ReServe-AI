# Cafeteria Prevention & Demand Forecasting Workflow — Campus Food Rescue AI

## 1. PREVENT Mode Workflow Diagram

```mermaid
graph TD
    subgraph Input Data Pipeline
        HIST[Historical Meal Consumption Logs]
        CAL[Academic Calendar & Holiday Flags]
        DAY[Day of Week & Meal Type]
        EVENT[Scheduled Campus Events & Expected Attendance]
    end

    subgraph AI Demand Forecasting Engine (lib/ai/demandPredictionAgent.ts)
        MODEL[Forecasting Model / Regression Engine]
        SAFETY[Safety Buffer & Risk Evaluator]
    end

    subgraph Outputs & Actions
        PRED[Predicted Meal Demand e.g. 520 portions]
        REC[Recommended Preparation e.g. 540 portions]
        RISK[Surplus Risk Rating e.g. LOW]
        UI[Cafeteria Manager Dashboard Display]
    end

    HIST --> MODEL
    CAL --> MODEL
    DAY --> MODEL
    EVENT --> MODEL

    MODEL --> PRED
    PRED --> SAFETY
    SAFETY --> REC
    SAFETY --> RISK

    PRED --> UI
    REC --> UI
    RISK --> UI

    subgraph Post-Meal Logging & Evaluation
        ACTUAL[Record Actual Consumption & Preparation]
        EVAL[Compute MAE & RMSE Accuracy Metrics]
        LOGDB[(Save to CafeteriaDemandLog)]
    end

    UI --> ACTUAL
    ACTUAL --> EVAL
    EVAL --> LOGDB
    LOGDB --> HIST
```

---

## 2. Recommendation Formula & Risk Assessment

- **Predicted Demand (\(D_{pred}\))**: Statistical baseline model taking weighted historical averages for the meal type, adjusted by event attendance.
- **Safety Margin (\(S_{margin}\))**: A conservative buffer (typically 3%–5%) to prevent meal shortages while minimizing waste.
- **Recommended Preparation (\(P_{rec}\))**:
  \[
  P_{rec} = \lceil D_{pred} \times (1 + S_{margin}) \rceil
  \]
- **Surplus Risk Classification**:
  - **LOW**: Predicted consumption within 5% of average capacity.
  - **MEDIUM**: Event conflict or academic schedule change; potential variance 10%-15%.
  - **HIGH**: Major holiday break departure or unexpected event cancellation.
