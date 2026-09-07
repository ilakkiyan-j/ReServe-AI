import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PredictionChartProps {
  logs: any[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ logs }) => {
  const displayLogs = [...logs].reverse().slice(-7); // Last 7 records

  const maxVal = Math.max(...displayLogs.map((l) => Math.max(l.predictedConsumption, l.actualConsumed || 0, l.recommendedPreparation)), 600);

  return (
    <Card title="Predicted vs Actual Meal Consumption" subtitle="Last 7 Cafeteria Service Sessions (portions)">
      <div className="mt-4 pt-2">
        {/* Legend */}
        <div className="flex items-center gap-6 text-xs mb-6 justify-end">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-brand-500 inline-block" />
            <span className="text-slate-300">Predicted Consumption</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-sky-400 inline-block" />
            <span className="text-slate-300">Actual Consumed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-400/80 inline-block" />
            <span className="text-slate-300">Recommended Prep</span>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="flex items-end justify-between gap-3 h-48 px-2 border-b border-slate-800">
          {displayLogs.map((log, i) => {
            const predHeight = Math.round((log.predictedConsumption / maxVal) * 100);
            const actualHeight = Math.round(((log.actualConsumed || log.predictedConsumption) / maxVal) * 100);
            const prepHeight = Math.round((log.recommendedPreparation / maxVal) * 100);

            const dayLabel = new Date(log.date).toLocaleDateString([], { weekday: "short" });

            return (
              <div key={log.id || i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-40">
                  {/* Predicted Bar */}
                  <div
                    style={{ height: `${predHeight}%` }}
                    className="w-3 bg-brand-500 rounded-t-sm transition-all group-hover:bg-brand-400 relative"
                    title={`Predicted: ${log.predictedConsumption}`}
                  />

                  {/* Actual Consumed Bar */}
                  <div
                    style={{ height: `${actualHeight}%` }}
                    className="w-3 bg-sky-400 rounded-t-sm transition-all group-hover:bg-sky-300 relative"
                    title={`Actual: ${log.actualConsumed || "N/A"}`}
                  />

                  {/* Recommended Prep Bar */}
                  <div
                    style={{ height: `${prepHeight}%` }}
                    className="w-3 bg-amber-400/80 rounded-t-sm transition-all group-hover:bg-amber-300 relative"
                    title={`Rec Prep: ${log.recommendedPreparation}`}
                  />
                </div>

                <span className="text-[11px] text-slate-400 font-semibold mt-1">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
