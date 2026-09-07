import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DemandPredictionResult } from "@/lib/ai/demandPredictionAgent";
import { Utensils, ShieldAlert, Sparkles, CheckCircle, Info } from "lucide-react";

interface PredictionCardProps {
  prediction: DemandPredictionResult;
  onOpenForm: () => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onOpenForm }) => {
  const riskBadgeVariant =
    prediction.surplusRiskLevel === "LOW" ? "success" : prediction.surplusRiskLevel === "MEDIUM" ? "warning" : "danger";

  return (
    <Card className="glass-panel p-6 border-brand-500/30 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" className="text-[10px]">AI PREVENT MODE</Badge>
            <Badge variant="default" className="text-[10px]">DEMO / SYNTHETIC DATA</Badge>
            <Badge variant={riskBadgeVariant}>{prediction.surplusRiskLevel} Surplus Risk</Badge>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Cafeteria Food Demand Forecast <Sparkles className="w-5 h-5 text-brand-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Statistical regression baseline with conservative safety buffer.</p>
        </div>

        <button
          onClick={onOpenForm}
          className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all shadow-md shadow-brand-600/20"
        >
          + Run Custom Forecast
        </button>
      </div>

      {/* Primary Forecast Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Expected Attendance</p>
          <h4 className="text-2xl font-extrabold text-white mt-1">{prediction.expectedAttendance} <span className="text-xs text-slate-400 font-normal">students</span></h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Campus attendance input</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Predicted Meal Consumption</p>
          <h4 className="text-2xl font-extrabold text-brand-400 mt-1">{prediction.predictedConsumption} <span className="text-xs text-slate-400 font-normal">portions</span></h4>
          <p className="text-[11px] text-brand-300 mt-0.5">Estimated baseline</p>
        </div>

        <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-500/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-brand-300 font-semibold">Recommended Preparation</p>
            <Badge variant="success">+{prediction.safetyMarginPercentage}% Buffer</Badge>
          </div>
          <h4 className="text-2xl font-extrabold text-emerald-400 mt-1">{prediction.recommendedPreparation} <span className="text-xs text-emerald-300 font-normal">portions</span></h4>
          <p className="text-[11px] text-emerald-300 mt-0.5">+{prediction.safetyMarginPortions} portion safety margin</p>
        </div>
      </div>

      {/* Rationale & Safety Explanation */}
      <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">AI Preparation Rationale: </span>
          {prediction.rationale}
        </div>
      </div>
    </Card>
  );
};
