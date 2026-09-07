"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Utensils, Calendar, Users, X, Sparkles } from "lucide-react";

interface PredictionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPredictionGenerated: () => void;
}

export const PredictionFormModal: React.FC<PredictionFormModalProps> = ({
  isOpen,
  onClose,
  onPredictionGenerated,
}) => {
  const [mealType, setMealType] = useState<"BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS">("LUNCH");
  const [expectedAttendance, setExpectedAttendance] = useState<number>(600);
  const [academicCalendarType, setAcademicCalendarType] = useState<"REGULAR_CLASS" | "REGULAR_EXAM" | "HOLIDAY">("REGULAR_CLASS");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType,
          expectedAttendance: Number(expectedAttendance),
          academicCalendarType,
          date,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate prediction");
      }

      onPredictionGenerated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="relative p-6 bg-slate-900/95 border-slate-800 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Run Demand Prediction</h2>
            </div>
            <p className="text-xs text-slate-400">Generate statistical forecast & preparation recommendations.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Select Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="BREAKFAST">Breakfast (07:30 - 09:30)</option>
                <option value="LUNCH">Lunch (12:00 - 14:30)</option>
                <option value="DINNER">Dinner (19:00 - 21:00)</option>
                <option value="SNACKS">Evening Snacks (16:30 - 18:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Expected Campus / Mess Attendance</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="number"
                  required
                  min={10}
                  value={expectedAttendance}
                  onChange={(e) => setExpectedAttendance(Number(e.target.value))}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Academic Calendar Status</label>
              <select
                value={academicCalendarType}
                onChange={(e) => setAcademicCalendarType(e.target.value as any)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="REGULAR_CLASS">Regular Teaching Day</option>
                <option value="REGULAR_EXAM">Exam / Assessment Period</option>
                <option value="HOLIDAY">Vacation / Semester Break</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
              Run AI Prediction Engine
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
