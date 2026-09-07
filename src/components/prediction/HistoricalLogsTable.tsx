import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface LogItem {
  id: string;
  date: string;
  mealType: string;
  expectedAttendance: number;
  predictedConsumption: number;
  recommendedPreparation: number;
  actualPrepared?: number | null;
  actualConsumed?: number | null;
  actualSurplus?: number | null;
  maeScore?: number | null;
}

interface HistoricalLogsTableProps {
  logs: LogItem[];
  metrics: { mae: number; rmse: number; sampleCount: number };
}

export const HistoricalLogsTable: React.FC<HistoricalLogsTableProps> = ({ logs, metrics }) => {
  return (
    <Card
      title="Historical Cafeteria Logs & Accuracy Evaluation"
      subtitle={`MAE (Mean Absolute Error): ${metrics.mae} portions | RMSE: ${metrics.rmse}`}
      action={
        <div className="flex items-center gap-2">
          <Badge variant="success">MAE: {metrics.mae} portions</Badge>
          <Badge variant="purple">RMSE: {metrics.rmse}</Badge>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-800/30">
              <th className="py-2.5 px-3">Date & Meal</th>
              <th className="py-2.5 px-3">Attendance</th>
              <th className="py-2.5 px-3">Predicted</th>
              <th className="py-2.5 px-3">Rec. Prep</th>
              <th className="py-2.5 px-3">Actual Consumed</th>
              <th className="py-2.5 px-3">Actual Surplus</th>
              <th className="py-2.5 px-3">MAE Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.map((log) => {
              const dateStr = new Date(log.date).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });

              return (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    {dateStr} — <span className="text-brand-400">{log.mealType}</span>
                  </td>
                  <td className="py-2.5 px-3">{log.expectedAttendance}</td>
                  <td className="py-2.5 px-3 font-semibold text-brand-400">{log.predictedConsumption}</td>
                  <td className="py-2.5 px-3 text-amber-300">{log.recommendedPreparation}</td>
                  <td className="py-2.5 px-3 font-semibold text-sky-400">{log.actualConsumed || "—"}</td>
                  <td className="py-2.5 px-3 text-rose-400">{log.actualSurplus !== null && log.actualSurplus !== undefined ? `${log.actualSurplus} portions` : "—"}</td>
                  <td className="py-2.5 px-3 font-mono text-purple-300">{log.maeScore !== null && log.maeScore !== undefined ? `${log.maeScore} portions` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
